"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { checkRateLimit, describeRetryAfter } from "@/lib/rate-limit";
import { contactSchema, MIN_SUBMIT_MS } from "@/lib/validation/contact";

/* ---------------------------------------------------------------------------
   The contact form's Server Action. Spec: build-plan.md PORT-041 and PORT-043,
   code-standards.md §6, architecture.md §5.

   THIS FILE IS A NETWORK ENDPOINT. "use server" does not mean "runs on the
   server" — it means every exported function here is callable by anyone who
   can reach the site, with any arguments they choose. Nothing that happened in
   the browser is evidence: not the `required` attributes, not `type="email"`,
   not the honeypot being hidden, and not the `startedAt` timestamp. The guards
   below are the only thing standing between an arbitrary POST body and the
   rest of the app, which is why PORT-040 put the schema in lib/validation/
   shared with the client and made THIS parse the authoritative one.

   Only `submitContact` is exported, and deliberately so: every export from a
   "use server" module becomes its own callable endpoint, so a helper exported
   "just for testing" would be reachable from the open internet.

   THE ORDER OF THE GUARDS BELOW IS LOAD-BEARING, and it is NOT the order
   architecture.md §5 originally drew (parse → honeypot → rate limit). Both
   later checks moved ahead of the parse, for two different reasons:

     1. RATE LIMIT FIRST, because a limiter that only counts VALID submissions
        counts nothing a flooder sends. A bot posting garbage would fail the
        parse every time and never increment a counter, leaving the endpoint
        wide open to exactly the traffic the limit exists to stop. The cheapest
        check goes first — that is the entire point of a rate limit.

     2. HONEYPOT SECOND, ahead of the parse, because PORT-041 found by running
        it that checking it afterwards is a real bug. See the comment on that
        block.

   §5 has been corrected to match. The known cost of (1) is that a visitor
   whose password manager fills the honeypot spends quota on submissions that
   are silently dropped; chosen 2026-09-05 over the alternative, which is that
   a bot tripping the honeypot is never rate limited at all and can hammer the
   endpoint indefinitely.
--------------------------------------------------------------------------- */

/**
 * The union every Server Action in this project returns (code-standards.md §6).
 * Declared here because this is the only action that exists; when a second one
 * arrives it moves somewhere shared rather than being duplicated.
 *
 * Note what is NOT here: no error object, no stack, no field the browser did
 * not send. `message` is always something a visitor can read.
 *
 * A NOTE ON THE TWO FAILURE SHAPES, because the form branches on it: a result
 * WITH `fieldErrors` renders inline under the named fields; a result WITHOUT
 * it renders the form-level banner, which carries the mailto: fallback. So
 * `fieldErrors` must be omitted entirely — not sent as an empty object — for
 * any failure no visible field owns. An empty object is the worst of both:
 * "please check the fields below" with nothing marked.
 */
export type ActionResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

/**
 * The caller's IP, or a shared fallback key.
 *
 * `headers()` IS A PROMISE in Next 16, the same rule as `params` and
 * `searchParams`. Forgetting the await does not fail loudly — it stringifies
 * to "[object Promise]", every visitor on earth shares one bucket, and the
 * sixth person ever to use the form is locked out. It would look exactly like
 * a working rate limiter until someone else tried to send a message.
 *
 * `x-forwarded-for` IS CLIENT-SUPPLIED. Behind Vercel's proxy the leftmost
 * entry is rewritten to the real peer and can be trusted; run this anywhere
 * without a proxy that does the same and a bot sets the header to a fresh
 * random value per request, gets a fresh bucket each time, and has infinite
 * quota. That is a property of where this deploys, not of the code — worth
 * knowing before anyone calls this security.
 *
 * The fallback matters: when no header is present (a direct connection, a
 * local `next start`) every such caller shares the key "unknown". That is the
 * conservative direction — an unidentifiable caller is rate limited WITH the
 * other unidentifiable callers rather than being waved through unlimited.
 */
async function getClientKey(): Promise<string> {
  const headerList = await headers();

  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = headerList.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "unknown";
}

export async function submitContact(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  /**
   * GUARD 1 — the rate limit, before anything else touches the submission.
   *
   * Calling checkRateLimit IS the attempt; there is no separate consume step,
   * so this line must run exactly once per submission and must not sit behind
   * an early return. Everything that reaches this action is counted, including
   * malformed bodies and honeypot-tripped bots, which is the whole reason it
   * is first.
   *
   * This is the one guard that tells the caller plainly what happened. A
   * silent success here would be worse than useless: a real person who sends
   * several messages in a morning deserves to know why the next one did not
   * go, and a bot learning it has been throttled changes nothing — it cannot
   * evade a limit keyed on the address it has to post from.
   */
  const key = await getClientKey();
  const limit = checkRateLimit(key);

  if (!limit.allowed) {
    console.warn("[contact] rate limit hit", {
      key,
      retryAfterSeconds: limit.retryAfterSeconds,
      at: new Date().toISOString(),
    });

    /**
     * No `fieldErrors` — nothing the visitor typed is wrong, so this is a
     * form-level failure and renders in the banner.
     *
     * The message deliberately does NOT end with "email me directly": the
     * banner that renders it already follows every form-level message with a
     * mailto: fallback sentence, and the first draft of this string said it
     * too. Read in a browser rather than in the source, it came out as
     * "…email me directly. Nothing was lost — copy your message and email me
     * directly instead." The banner owns the fallback; the message owns the
     * reason.
     */
    return {
      ok: false,
      message: `That is several messages in a short time — please try again ${describeRetryAfter(
        limit.retryAfterSeconds,
      )}.`,
    };
  }

  /**
   * GUARD 2 — THE HONEYPOT, BEFORE THE PARSE, AND THE ORDER IS THE WHOLE POINT.
   *
   * The first build of this file checked it after `safeParse`, reasoning that
   * the schema's own `.max(0)` rule would reject a filled honeypot anyway. It
   * does — and that is exactly the bug. The rejection came back as
   * `{ ok: false, fieldErrors: { honeypot: [...] } }`, and because no visible
   * <Field> renders a `honeypot` key, the form simply refused to submit with
   * no reason shown. A caught bot learned it had been caught, and a real
   * person whose password manager filled the trap got a dead form instead of
   * the silent drop this design promises.
   *
   * Reading it off the raw FormData means the answer never depends on whether
   * the rest of the submission was valid — a bot that fills the trap AND
   * botches the email still gets the same bland success as any other.
   *
   * Returning `ok: true` is deliberate (code-standards.md §6, architecture.md
   * §5): an error tells the bot's author which field caught them, and the next
   * run omits it. The submission is dropped, no email is sent, and from the
   * outside this is indistinguishable from a message that went through.
   */
  const honeypot = formData.get("honeypot");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    console.info("[contact] honeypot tripped — submission dropped", {
      key,
      at: new Date().toISOString(),
    });
    return { ok: true };
  }

  /**
   * `Object.fromEntries` on FormData gives `Record<string, FormDataEntryValue>`
   * — string | File. The schema rejects a File on every field, which is the
   * correct answer to someone posting one: unknown keys are stripped by Zod's
   * default object behaviour, so an attacker cannot smuggle extra fields
   * through to PORT-042 either.
   */
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    /**
     * `honeypot` and `startedAt` are deliberately deleted from what the
     * browser is told.
     *
     * Both can still fail the schema here — most obviously when the hidden
     * input is missing from the markup entirely, which PORT-040 and PORT-043
     * each made a hard failure on purpose so a bot cannot skip a guard by
     * omitting its field. But that is OUR bug to see in the logs, not a
     * message to render: no visible field owns either key, so it would be an
     * error the visitor can neither read nor fix. The form-level message still
     * tells them something is wrong.
     */
    const fieldErrors = z.flattenError(parsed.error).fieldErrors;

    for (const hidden of ["honeypot", "startedAt"] as const) {
      if (fieldErrors[hidden]) {
        console.error(
          `[contact] hidden field "${hidden}" failed to parse — is the input still in the form?`,
        );
        delete fieldErrors[hidden];
      }
    }

    /**
     * IF STRIPPING THE HIDDEN FIELDS EMPTIED THE OBJECT, this is a form-level
     * failure, not a field-level one — and the difference is a dead form.
     *
     * Found by tampering with `startedAt` in a browser and then READING the
     * page rather than trusting the assertion, which had only checked that no
     * "startedAt" error leaked. It did not leak. What rendered instead was
     * "Please check the fields below." above three fields with nothing marked
     * on any of them, no banner (the banner only shows when `fieldErrors` is
     * undefined), and no way forward — the exact dead-end PORT-041 removed for
     * the honeypot, grown back through a different door.
     *
     * Returning `fieldErrors` omitted routes it to the banner, which names the
     * problem and offers the mailto: fallback. `undefined` rather than `{}`:
     * the form branches on `=== undefined`, and an empty object is truthy.
     */
    if (Object.keys(fieldErrors).length === 0) {
      return {
        ok: false,
        message: "This form could not be verified — please reload the page and try again.",
      };
    }

    return {
      ok: false,
      message: "Please check the fields below.",
      /**
       * v4's top-level `z.flattenError()`, not the deprecated
       * `error.flatten()`. PORT-040 proved by running it that this returns
       * exactly the `Record<string, string[]>` that `fieldErrors` is typed as,
       * so nothing here maps an issue tree by hand.
       */
      fieldErrors,
    };
  }

  /**
   * GUARD 3 — minimum time to submit.
   *
   * After the parse rather than before it, because unlike the honeypot this
   * guard needs a NUMBER, and turning the raw FormData string into one safely
   * is precisely what the schema already does: `z.coerce.number().int()
   * .positive()` has already rejected "abc", "" and a negative before this
   * line runs. Doing the coercion by hand here would duplicate that and get it
   * subtly wrong — `Number("")` is 0, not NaN, so an empty value would sail
   * through a naive isNaN check and report an elapsed time of 56 years.
   *
   * A submission from the FUTURE is caught by the same comparison: a negative
   * elapsed time is < MIN_SUBMIT_MS, so a bot that plants a timestamp ahead of
   * now is rejected rather than granted an enormous elapsed time.
   *
   * Like the honeypot this returns `{ ok: true }` and drops the message —
   * telling a script it submitted too fast just teaches it to wait.
   *
   * The known false positive: a visitor who reloads a page restored from
   * bfcache could in principle carry a stale mount time, which only ever makes
   * the elapsed time LARGER and so cannot cause a rejection. The real risk is
   * the opposite — a genuine person who fills three fields in under three
   * seconds — and three seconds is set low precisely because that person, if
   * they exist, is more costly to lose than a bot is to catch.
   */
  const elapsed = Date.now() - parsed.data.startedAt;

  if (elapsed < MIN_SUBMIT_MS) {
    console.info("[contact] submitted too fast — dropped", {
      key,
      elapsed,
      at: new Date().toISOString(),
    });
    return { ok: true };
  }

  try {
    /**
     * PORT-042 replaces this line with `await sendContactEmail(parsed.data)`.
     * Until then the action is real and the guards are real, but nothing is
     * delivered — a submission that passes validation returns success and the
     * message goes nowhere.
     *
     * That gap is PORT-041's honest boundary, carried forward: Resend needs an
     * account and a verified domain that do not exist yet, and PORT-042 is
     * parked by choice. The success panel still claims the message arrived,
     * which stays untrue until then — PORT-044 owns that copy.
     */
    console.info("[contact] validated submission (delivery lands in PORT-042)", {
      name: parsed.data.name,
      email: parsed.data.email,
      length: parsed.data.message.length,
      elapsed,
      remaining: limit.remaining,
      at: new Date().toISOString(),
    });

    return { ok: true };
  } catch (error) {
    /**
     * Logged with context server-side, generic to the browser. An error object
     * reaching the client leaks internals — provider names, keys in a message,
     * file paths — and helps the visitor with none of it.
     *
     * This block is unreachable today because nothing above it throws. It is
     * written now anyway: PORT-042 drops a network call into the try, and a
     * catch added at the same time as the thing that throws is a catch nobody
     * has tested. `console.error` is what Vercel's runtime logs collect.
     */
    console.error("[contact] submission failed", error);
    return {
      ok: false,
      message: "The message could not be sent — the email service did not respond.",
    };
  }
}
