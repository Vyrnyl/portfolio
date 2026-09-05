/* ---------------------------------------------------------------------------
   Per-IP rate limiting for the contact form. Spec: build-plan.md PORT-043,
   architecture.md §10.

   IN-MEMORY AND PER-INSTANCE. THIS IS NOT DISTRIBUTED PROTECTION.

   The AC asks for this to be written down rather than discovered later, so:
   the Map below lives in the memory of one server process. On Vercel the site
   runs as serverless functions, which means

     - several instances may be warm at once, and each one holds its OWN empty
       Map, so a caller spread across three instances gets three times the
       quota; and
     - an instance that scales to zero forgets every counter it held, so a
       caller who waits out a cold start starts fresh.

   For a portfolio contact form that is the right trade. The threat here is a
   scraper hammering the endpoint and a stray bot burning through the email
   provider's monthly quota — both of which a leaky bucket still blunts. It is
   NOT protection against a determined distributed attacker, and nothing built
   on top of this should assume otherwise. The fix, if it is ever needed, is a
   shared store (@vercel/kv, Upstash) behind this same function signature —
   which is why the signature takes a key and returns a verdict rather than
   reaching into the Map from the caller.
--------------------------------------------------------------------------- */

/**
 * Five submissions per fifteen minutes, per IP.
 *
 * build-plan.md PORT-043 gives "e.g. 3 per 10 minutes" as its example; this is
 * deliberately looser, chosen 2026-09-05. A single IP is not a single person —
 * an office, a campus network or a mobile carrier behind CGNAT can put dozens
 * of real visitors on one address, and the cost of being wrong is asymmetric.
 * Blocking a genuine message is a lost opportunity with no error the visitor
 * can act on beyond waiting; letting a bot send five instead of three costs
 * two emails.
 */
const LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1000;

/**
 * A fixed window, not a sliding one.
 *
 * `resetAt` is set once when a key's first request lands and does not move as
 * requests arrive — so the window expires at a fixed moment and the counter
 * resets whole. The known trade is burst at the seam: five at 14:59 and five
 * more at 15:01 is ten in two minutes. A sliding window would smooth that at
 * the cost of retaining a timestamp per request, and at this scale the extra
 * bookkeeping buys nothing a portfolio can measure.
 */
type Bucket = {
  count: number;
  resetAt: number;
};

/**
 * Module-level state, which in a "use server" caller means it survives between
 * requests on the same warm instance — the only reason this works at all.
 *
 * NOTE: this Map is never bounded by anything but the sweep below. Without
 * that, every distinct IP that ever submits would hold a key forever and the
 * process would leak memory in proportion to unique visitors.
 */
const buckets = new Map<string, Bucket>();

/**
 * Drop expired buckets. Called on each check rather than on a timer: a
 * `setInterval` in a module that serverless may freeze mid-execution is a
 * worse bet than a few microseconds of sweeping on a path that runs, at most,
 * a handful of times a minute.
 */
function sweep(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export type RateLimitResult = {
  /** False when the caller has exhausted the window and should be turned away. */
  allowed: boolean;
  /** Attempts left after this one. Zero on the request that hits the limit. */
  remaining: number;
  /** Whole seconds until the window resets — for the message shown to a person. */
  retryAfterSeconds: number;
};

/**
 * Record one attempt against `key` and say whether it is allowed.
 *
 * THIS FUNCTION COUNTS. Calling it is the attempt — there is no separate
 * "consume" step, so a caller that checks the verdict and then abandons the
 * request has still spent the quota. That is intentional for the contact
 * action, where the check runs before any other work precisely so that
 * malformed and honeypot-tripped submissions are counted too; a limiter that
 * only counts VALID submissions counts nothing a flooder sends.
 *
 * A blocked call does NOT extend the window. Hammering it while blocked keeps
 * returning the same shrinking `retryAfterSeconds` rather than pushing the
 * reset further out — a limiter that punishes retries locks out the impatient
 * real visitor hardest, and does nothing to a bot that does not read replies.
 */
export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: LIMIT - 1, retryAfterSeconds: 0 };
  }

  const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

  if (existing.count >= LIMIT) {
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: LIMIT - existing.count,
    retryAfterSeconds,
  };
}

/**
 * Turn `retryAfterSeconds` into something a person reads.
 *
 * Lives here rather than in the action because it is the limiter's own unit
 * being described, and the action should not be doing arithmetic on a number
 * this module chose the shape of. Rounds UP to the minute: telling someone to
 * wait 14 minutes when the window has 14 minutes and 40 seconds left sends
 * them back to a form that still refuses them.
 */
export function describeRetryAfter(retryAfterSeconds: number): string {
  if (retryAfterSeconds <= 60) {
    return "in a minute";
  }

  const minutes = Math.ceil(retryAfterSeconds / 60);
  return `in about ${minutes} minutes`;
}

/**
 * TEST SEAM — exported for the verification script, not for application code.
 *
 * Nothing under src/ calls this. It exists because proving the limiter works
 * means running the same key past the limit and then proving the window
 * genuinely resets, and the alternative is either a 15-minute test or reaching
 * into module internals from outside.
 *
 * Deliberately NOT in lib/actions/: every export from a "use server" module is
 * a public endpoint, so a reset function living there would let anyone on the
 * internet clear their own rate limit. This file has no "use server", so it is
 * only ever callable in-process.
 */
export function __resetRateLimits() {
  buckets.clear();
}
