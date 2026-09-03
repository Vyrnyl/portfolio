"use server";

import { z } from "zod";

import { contactSchema } from "@/lib/validation/contact";

/* ---------------------------------------------------------------------------
   The contact form's Server Action. Spec: build-plan.md PORT-041,
   code-standards.md §6, architecture.md §5.

   THIS FILE IS A NETWORK ENDPOINT. "use server" does not mean "runs on the
   server" — it means every exported function here is callable by anyone who
   can reach the site, with any arguments they choose. Nothing that happened in
   the browser is evidence: not the `required` attributes, not `type="email"`,
   not the honeypot being hidden. The safeParse below is the only thing
   standing between an arbitrary POST body and the rest of the app, which is
   why PORT-040 put the schema in lib/validation/ shared with the client and
   made THIS parse the authoritative one.

   Only `submitContact` is exported, and deliberately so: every export from a
   "use server" module becomes its own callable endpoint, so a helper exported
   "just for testing" would be reachable from the open internet.
--------------------------------------------------------------------------- */

/**
 * The union every Server Action in this project returns (code-standards.md §6).
 * Declared here because this is the only action that exists; when a second one
 * arrives it moves somewhere shared rather than being duplicated.
 *
 * Note what is NOT here: no error object, no stack, no field the browser did
 * not send. `message` is always something a visitor can read.
 */
export type ActionResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

export async function submitContact(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  /**
   * THE HONEYPOT IS CHECKED FIRST, BEFORE THE PARSE, AND THE ORDER IS THE
   * WHOLE POINT.
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
     * `honeypot` is deliberately deleted from what the browser is told.
     *
     * It can still fail the schema here — most obviously when the hidden input
     * is missing from the markup entirely, which PORT-040 made a hard failure
     * on purpose so a bot cannot skip the trap by omitting the field. But that
     * is OUR bug to see in the logs, not a message to render: no visible field
     * owns the key, so it would be an error the visitor can neither read nor
     * fix. The form-level message still tells them something is wrong.
     */
    const fieldErrors = z.flattenError(parsed.error).fieldErrors;
    if (fieldErrors.honeypot) {
      console.error("[contact] honeypot field failed to parse — is the hidden input still in the form?");
      delete fieldErrors.honeypot;
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

  try {
    /**
     * PORT-042 replaces this line with `await sendContactEmail(parsed.data)`.
     * Until then the action is real and the parse is real, but nothing is
     * delivered — a submission that passes validation returns success and the
     * message goes nowhere.
     *
     * That gap is this ticket's honest boundary, not an oversight: PORT-041's
     * AC ends at the typed result and the wiring, and Resend needs an account
     * and a verified domain that do not exist yet.
     */
    console.info("[contact] validated submission (delivery lands in PORT-042)", {
      name: parsed.data.name,
      email: parsed.data.email,
      length: parsed.data.message.length,
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
