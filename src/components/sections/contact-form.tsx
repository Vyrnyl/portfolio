"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/content/site";
import { submitContact } from "@/lib/actions/contact";
import { cn } from "@/lib/utils";

const FIELD_ERRORS_EMPTY: Record<string, string[]> = {};

type Props = {
  className?: string;
};

/**
 * The contact form — fields, submit, and the four states.
 *
 * This is the leaf that carries "use client" (code-standards.md §4): the page
 * around it stays a Server Component, and Field/Input/Textarea all stay server
 * components too, exactly as PORT-023 built them.
 *
 * PORT-036 shaped this component's local state as the same union the action
 * returns, so PORT-041 changed the SOURCE of `state` and nothing else about
 * how the JSX reads it — `useActionState` in place of `useState`, the action in
 * place of `mockValidate` and its setTimeout.
 */
export function ContactForm({ className }: Props) {
  /**
   * Bumping this remounts <ContactFormFields>, which is the only way to clear
   * a useActionState result — the hook returns no reset function, and its state
   * lives for the life of the mounted component.
   *
   * The first attempt at "Send another" was a <Link href="/contact">, and it
   * was DEAD: the visitor is already on /contact, so the client router treats
   * it as a same-route navigation, keeps the component mounted, and the success
   * panel never goes away. A hard reload cleared it — which is what proved the
   * state is client-only and a remount is the real fix.
   *
   * PORT-043 gave the remount a second job: `startedAt` is captured on mount,
   * so bumping the key also issues a FRESH timestamp for the next message.
   * Without that, "Send another" would reuse the original mount time and the
   * minimum-time guard would wave the second message through on the strength
   * of how long the first one took.
   */
  const [formKey, setFormKey] = useState(0);

  return (
    <ContactFormFields
      key={formKey}
      className={className}
      onReset={() => setFormKey((n) => n + 1)}
    />
  );
}

function ContactFormFields({
  className,
  onReset,
}: {
  className?: string;
  onReset: () => void;
}) {
  /**
   * `useActionState` returns the action's last result, a wrapped action to pass
   * to `<form action>`, and a pending flag. The initial state is `null` — no
   * submission has happened yet, which is a distinct thing from a submission
   * that returned `{ ok: false }`, and the union has no member for "idle"
   * because `null` already says it.
   */
  const [state, formAction] = useActionState(submitContact, null);

  /**
   * When this form became available to fill in — the value the server's
   * minimum-time guard measures against (PORT-043).
   *
   * A LAZY useState initialiser, and the shape is not a free choice. The first
   * build of this used `useRef(Date.now())` and read `startedAt.current` in the
   * JSX; ESLint's react-hooks plugin rejected it twice over, and both rules
   * were right:
   *
   *   - `react-hooks/purity` — `Date.now()` is impure and must not be called
   *     during render. Passing it as useRef's argument calls it on EVERY
   *     render, not just the first; the value is discarded after mount, so it
   *     looked stable while doing pointless work in a rule-breaking place.
   *   - `react-hooks/refs` — reading `.current` during render is a bug in
   *     waiting, because a ref change does not re-render and React makes no
   *     promise the value read at render time is the one committed.
   *
   * `useState(() => Date.now())` fixes both: React calls the initialiser once,
   * on mount, outside the purity constraint, and the value is ordinary state
   * that is legitimately read during render. The setter is deliberately not
   * destructured — nothing ever updates this.
   *
   * IT IS DELIBERATELY NOT A SERVER-COMPUTED DEFAULT. A timestamp baked into
   * the HTML at build time would be the moment `next build` ran — hours or
   * weeks before any visitor arrives — and the elapsed time would be
   * astronomically large for everyone, including a bot. The value has to come
   * from the client for the guard to mean anything, which is also exactly why
   * the server treats it as untrusted.
   */
  const [startedAt] = useState(() => Date.now());

  const fieldErrors =
    state?.ok === false ? (state.fieldErrors ?? FIELD_ERRORS_EMPTY) : FIELD_ERRORS_EMPTY;

  if (state?.ok) {
    return (
      <div
        className={cn("border-fern bg-surface-2 rounded-lg border p-6", className)}
        role="status"
        aria-live="polite"
      >
        <h2 className="text-h-sm text-ink">Message sent</h2>
        <p className="text-muted mt-2 text-sm">
          Thanks — it reached my inbox. I usually reply within a couple of days.
        </p>
        <Button variant="outline" size="sm" className="mt-6" onClick={onReset}>
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className={cn("space-y-6", className)}>
      {/*
        noValidate is load-bearing, as it was in PORT-036 — without it the
        browser's own bubble fires first and preempts the server parse, so the
        authoritative errors never render.
      */}
      <Field name="name" label="Name" required error={fieldErrors.name?.[0]}>
        {(props) => <Input {...props} type="text" autoComplete="name" placeholder="Your name" />}
      </Field>

      <Field
        name="email"
        label="Email"
        required
        hint="So I have somewhere to reply."
        error={fieldErrors.email?.[0]}
      >
        {(props) => (
          <Input {...props} type="email" autoComplete="email" placeholder="you@example.com" />
        )}
      </Field>

      <Field name="message" label="Message" required error={fieldErrors.message?.[0]}>
        {(props) => <Textarea {...props} rows={6} placeholder="What are you working on?" />}
      </Field>

      {/*
        The honeypot. PORT-040 made this REQUIRED in the schema, so the form
        does not parse without it — it is load-bearing markup, not an optional
        extra.

        Hidden three ways, each doing a different job: `.honeypot-field` moves
        it off-canvas (a human never sees it), `aria-hidden` on the WRAPPER
        keeps it out of the accessibility tree without the ARIA violation of
        hiding a focusable control, and `tabIndex={-1}` keeps it out of the tab
        order so keyboard users cannot land in it.

        The input is NAMED `website` on its id rather than `honeypot`: a
        password manager filling every text field it recognises would trip a
        field named for its purpose, and a real person would then be silently
        classed as a bot and told their message sent. `name="honeypot"` is what
        the schema reads. autoComplete="off" is the first line of that defence;
        the id is the second, because "off" is not universally honoured.
      */}
      <div className="honeypot-field" aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input
          id="contact-website"
          name="honeypot"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      {/*
        The mount timestamp for the minimum-time guard (PORT-043). Also
        required by the schema, so this is the SECOND piece of load-bearing
        hidden markup — delete either one and every submission fails.

        type="hidden" rather than the off-canvas treatment the honeypot gets:
        a hidden input is not focusable, not rendered and not in the
        accessibility tree, so it needs none of that machinery. The honeypot
        only lives off-canvas because it has to look real to a bot.

        suppressHydrationWarning IS REQUIRED HERE and is not decoration. This
        component prerenders on the server, where the initialiser runs and
        stamps the server's clock; the client then runs it again on hydration
        and gets a different millisecond. Without the attribute React logs a
        mismatch on every single page load. The CLIENT value is the one that
        survives hydration and the one that gets posted, which is what the
        guard needs — the same class of legitimately-client-only value as the
        next-themes rule in CLAUDE.md, marked as such rather than worked around.
      */}
      <input
        type="hidden"
        name="startedAt"
        value={startedAt}
        suppressHydrationWarning
        readOnly
      />

      {/*
        The form-level failure. Field-level problems render inside their own
        Field (PORT-023 wired role="alert" there already), so this banner is
        only for the failure no single field owns — the rate limit, and the
        provider failure PORT-042 will add — and it carries the mailto:
        fallback code-standards.md §6 requires of every user-facing failure.
      */}
      {state?.ok === false && state.fieldErrors === undefined ? (
        <div className="border-coral bg-surface-2 rounded-lg border p-4" role="alert">
          <p className="text-coral-text text-sm font-medium">{state.message}</p>
          <p className="text-muted mt-2 text-sm">
            Nothing was lost — copy your message and{" "}
            <a
              href={`mailto:${site.email}`}
              className={cn(
                "text-fern hover:text-fern-hover rounded-md font-medium underline underline-offset-2",
                "focus-visible:ring-ring focus-visible:ring-offset-ground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
              )}
            >
              email me directly
            </a>{" "}
            instead.
          </p>
        </div>
      ) : null}

      {/*
        The validation summary is announced, not just displayed. Each field's
        own error already carries role="alert", but a visitor who submits from
        the button hears nothing about WHY the page did not move on unless the
        form-level message is spoken too.
      */}
      <p aria-live="polite" className="sr-only">
        {state?.ok === false && state.fieldErrors !== undefined ? state.message : ""}
      </p>

      <SubmitButton />
    </form>
  );
}

/**
 * The pending spinner.
 *
 * Inline rather than an entry in lib/icons.ts: PORT-024 scoped `IconName` to
 * icons a built content type actually names, and a spinner is a UI affordance
 * with no content behind it. It is also the only place in the project that
 * needs one, so a shared abstraction would have exactly one caller.
 *
 * `aria-hidden` because the pending state is already announced twice over — by
 * the button's label and by the live region beside it. A third announcement of
 * a decorative mark is noise.
 *
 * Note what the global prefers-reduced-motion block does to this: it collapses
 * animation-duration to 0.01ms, which FREEZES the spinner rather than hiding
 * it. That is acceptable because the meaning is carried by the text — the mark
 * is decoration either way — but it is a static circle for those users, not an
 * absent one.
 */
function Spinner() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="animate-spin">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Its own component on purpose. `useFormStatus` reads the status of the
 * PARENT form, so calling it inside ContactFormFields — which renders the form
 * rather than sitting inside one — returns `pending: false` forever.
 */
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <div className="flex items-center gap-4">
      <Button type="submit" disabled={pending}>
        {pending ? (
          <>
            <Spinner />
            Sending…
          </>
        ) : (
          "Send message"
        )}
      </Button>
      {/*
        Pending is announced as well as shown: the button's own label changing
        is a visual-only cue for anyone not focused on it.
      */}
      <p aria-live="polite" className="text-muted text-sm">
        {pending ? "Sending your message…" : ""}
      </p>
    </div>
  );
}
