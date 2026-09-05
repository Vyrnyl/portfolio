import { z } from "zod";

/* ---------------------------------------------------------------------------
   The contact form's one schema. Spec: build-plan.md PORT-040,
   code-standards.md §6.

   ONE schema, imported by both sides — but the two sides are not equals. The
   client may parse this to fail fast and keep a round trip off the wire; the
   SERVER PARSE IS AUTHORITATIVE, because a form post is untrusted input and
   nothing that ran in the browser proves anything about what arrived. This
   file is the only place in the project where that is true, which is why Zod
   is a contact-form dependency and not the content layer's validator
   (build-plan.md §9 — content is typed literals checked by `satisfies`).

   EVERY STRING HAS A .max(). Without one, `z.string()` accepts a body of any
   length: a 10MB message would parse clean, reach lib/email.ts in PORT-042 and
   be handed to the provider. The upper bounds here are the cheapest place to
   stop that, ahead of any network call.

   Zod v4 syntax throughout (4.5.4 installed). Three v3 idioms are deliberately
   NOT used, all of them deprecated: `z.string().email()` (now the top-level
   `z.email()`), the `{ message: … }` error key (now `{ error: … }`), and
   `error.flatten()` (now the top-level `z.flattenError()`, which PORT-041
   calls to get the flat Record<string, string[]> that ActionResult.fieldErrors
   is typed as).
--------------------------------------------------------------------------- */

/**
 * The minimum plausible time between a form appearing and a person submitting
 * it, in milliseconds. PORT-043.
 *
 * Three seconds is short — the point is not to measure typing speed, it is
 * that a scripted POST arrives in tens of milliseconds and a person filling
 * three fields cannot. Set it high enough to catch a fast human and the guard
 * starts rejecting real messages, which is the expensive failure.
 *
 * Exported so the action and the timing schema below share one definition
 * rather than two constants that drift.
 */
export const MIN_SUBMIT_MS = 3000;

/**
 * Trim before length is checked, not after.
 *
 * `.trim()` in Zod v4 is a transform that runs as part of parsing, so `.min(2)`
 * sees the trimmed value: a name of three spaces is length 0 here and fails,
 * where a bare `.min(2)` would have passed it. It also means `parsed.data` is
 * already clean — PORT-042 sends the trimmed value without re-trimming it.
 */
export const contactSchema = z.object({
  name: z
    .string({ error: "Please enter your name." })
    .trim()
    .min(2, { error: "Please enter your name." })
    .max(100, { error: "That name is too long — 100 characters at most." }),

  email: z
    .email({ error: "Please enter a valid email address." })
    .trim()
    .max(200, { error: "That email address is too long — 200 characters at most." }),

  message: z
    .string({ error: "Please write a message." })
    .trim()
    .min(10, { error: "Please write at least a sentence or two." })
    .max(2000, { error: "That message is too long — 2000 characters at most." }),

  /**
   * The honeypot. A real visitor never sees this field and so always submits it
   * empty; a bot that fills every input it finds submits it non-empty and fails
   * here.
   *
   * REQUIRED, not `.optional()` — build-plan.md PORT-040 says "present and
   * required to be empty", and the difference is the whole gate: with
   * `.optional()` a bot that simply omits the field parses clean and the trap
   * never fires. The cost is that the hidden input must actually exist in the
   * form, which is PORT-041's job — until then nothing parses this, because
   * nothing calls it yet.
   *
   * The message is written for a human even though a human should never see it.
   * A machine string ("expected string, received undefined") would be what a
   * real visitor reads if the input ever went missing from the markup — the one
   * case where this message surfaces is a bug in our own form, and that is
   * exactly when it should not read like a stack trace.
   *
   * NOTE: an empty string is what passes. PORT-043 decides what a FILLED
   * honeypot does — and it is not this failure. §6 and architecture.md §5 both
   * say a caught bot gets `{ ok: true }`, never an error, so PORT-041 checks
   * the parsed value itself rather than letting this rule reject it.
   */
  honeypot: z
    .string({ error: "This field must be left empty." })
    .max(0, { error: "This field must be left empty." }),

  /**
   * When the form was rendered, as epoch milliseconds — planted by the client
   * on mount and read back here so the action can reject a submission that
   * arrived too fast to have been typed. PORT-043.
   *
   * THIS VALUE IS NOT TRUSTWORTHY AND IS NOT TREATED AS IF IT WERE. It comes
   * from the browser, so anything that can post a form can post whatever
   * timestamp it likes; a bot that sets it to five seconds ago walks straight
   * past the guard. It stops the naive case — a script that scrapes the form
   * and posts it back immediately — and nothing beyond that, which is why it
   * is one of three guards rather than the only one.
   *
   * `z.coerce.number()` because FormData carries strings and nothing else. It
   * is the one place in this schema where coercion is right: every other field
   * IS a string, and coercing them would turn a bad value into a plausible one
   * rather than rejecting it.
   *
   * The bounds are not cosmetic. `.int().positive()` rejects "abc" (NaN),
   * "" (which coerces to 0, and is what a missing value looks like), and a
   * negative number — each of which would otherwise reach the arithmetic in
   * the action and produce a nonsense elapsed time that happens to pass.
   */
  startedAt: z.coerce
    .number({ error: "This form could not be verified — please reload the page." })
    .int({ error: "This form could not be verified — please reload the page." })
    .positive({ error: "This form could not be verified — please reload the page." }),
});

/**
 * Inferred, never declared twice. A hand-written twin of this type would drift
 * from the schema the first time a field changed, and the compiler would not
 * notice — the schema is the single definition and this reads it.
 */
export type ContactInput = z.infer<typeof contactSchema>;
