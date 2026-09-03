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
 * returns, so this ticket changed the SOURCE of `state` and nothing else about
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
        The form-level failure. Field-level problems render inside their own
        Field (PORT-023 wired role="alert" there already), so this banner is
        only for the failure no single field owns — and it carries the mailto:
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
