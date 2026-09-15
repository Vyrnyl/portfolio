import { Resend } from "resend";

import { env } from "@/lib/env";
import type { ContactInput } from "@/lib/validation/contact";

/* ---------------------------------------------------------------------------
   The Resend wrapper. Spec: build-plan.md PORT-042, architecture.md §6.

   The action never touches Resend directly — it calls sendContactEmail() and
   gets back a typed result. That boundary is what lets the provider be swapped
   without editing a network endpoint.

   THE SENDER IS A TESTING ADDRESS, AND THAT IS A KNOWN, RECORDED COMPROMISE
   (decided 2026-09-15). Vernel chose to stay on free Vercel with no custom
   domain, so there is no domain to verify with Resend, so `from` must be the
   shared `onboarding@resend.dev`. Resend's own Next.js quickstart lists that
   address under things not to ship in production. What it costs us:

     1. Resend will deliver ONLY to the address that owns the account. Quoting
        their errors reference verbatim (403 validation_error): "You can only
        send testing emails to your own email address … To send emails to other
        recipients, please verify a domain at resend.com/domains." That is
        survivable here for exactly one reason: this form emails VERNEL, and
        CONTACT_TO_EMAIL is that same owning address. THE MOMENT ANYTHING TRIES
        TO EMAIL THE VISITOR — an acknowledgement copy, say — it will 403 for
        every visitor on earth. Do not add one without a verified domain.

     2. Mail from a shared sender is likelier to be filtered. If submissions
        stop arriving, check spam before suspecting this code.

   Free tier limits, from the same errors page: 100 emails/day and 3,000/month,
   returned as 429 `daily_quota_exceeded` / `monthly_quota_exceeded`. Note their
   wording — "Both sent and received emails count towards this quota."
--------------------------------------------------------------------------- */

const resend = new Resend(env.RESEND_API_KEY);

/**
 * The testing sender. A display name is included so the message does not arrive
 * looking like an unattributed robot — the address is fixed by Resend, the
 * label is ours. If a domain is ever bought, this constant is the ONLY line in
 * this file that changes.
 */
const FROM = "Portfolio contact <onboarding@resend.dev>";

export type SendResult = { ok: true } | { ok: false; reason: string };

/**
 * Send one contact submission.
 *
 * Takes the PARSED value, never raw FormData: every field here has already been
 * trimmed and length-bounded by contactSchema, so nothing unbounded reaches the
 * provider.
 */
export async function sendContactEmail(input: ContactInput): Promise<SendResult> {
  const { name, email, message } = input;

  const { data, error } = await resend.emails.send({
    /**
     * `from` is OURS and constant. `to` is OURS and comes from env. NOTHING the
     * visitor typed appears in a header, the subject, or the recipient —
     * build-plan.md PORT-042 names this explicitly, and the reason is header
     * injection: a newline in a value that becomes a header can forge
     * additional headers. The subject is a fixed string carrying no input at
     * all, not even the sender's name.
     */
    from: FROM,
    to: env.CONTACT_TO_EMAIL,
    subject: "New message from the portfolio contact form",

    /**
     * replyTo is the one place the visitor's address is used, and it is the
     * correct one: hitting Reply in a mail client answers the visitor rather
     * than the testing sender. It is a structured field the SDK encodes, not a
     * header we assemble by hand, and the schema has already proven the value
     * parses as an email.
     */
    replyTo: email,

    /**
     * Plain text, not HTML. Visitor input interpolated into an HTML body is an
     * injection surface for whatever renders it; a text body has none.
     *
     * The timestamp is generated HERE rather than taken from the submission's
     * `startedAt`, which is client-supplied and therefore a lie waiting to
     * happen — see the schema's note on it.
     */
    text: [`From: ${name} <${email}>`, `Received: ${new Date().toISOString()}`, "", message].join(
      "\n",
    ),
  });

  /**
   * THE RESEND SDK DOES NOT THROW ON A REJECTED SEND — it resolves with the
   * failure in `error`. This check is therefore the whole guard, and the
   * action's try/catch around the call would never fire on its own.
   *
   * Getting this wrong is the exact failure this repo has now shipped three
   * times in different costumes: PORT-041's honeypot returning an error no
   * field could render, PORT-043's empty fieldErrors object, PORT-051's
   * placeholder URL passing a word filter. Each was code that looked correct
   * and silently did the wrong thing. Here, ignoring `error` would return
   * success to a visitor whose message went nowhere — the worst version of it,
   * because nobody ever finds out. A 403 from the unverified-domain rule above
   * lands in precisely this branch.
   */
  if (error) {
    console.error("[email] Resend rejected the send", {
      name: error.name,
      message: error.message,
      at: new Date().toISOString(),
    });
    return { ok: false, reason: error.message };
  }

  console.info("[email] sent", { id: data?.id, at: new Date().toISOString() });
  return { ok: true };
}
