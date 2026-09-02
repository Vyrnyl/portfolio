"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * The four states this form can be in. Mirrors the shape the Server Action will
 * return in PORT-041 (code-standards.md §6) so that ticket swaps the *source*
 * of this value — useActionState instead of useState — without touching a
 * single branch of the JSX below.
 */
type FormState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> };

const FIELD_ERRORS_EMPTY: Record<string, string[]> = {};

/**
 * PORT-036 IS UI ONLY. Everything in this block is scaffolding and PORT-041
 * deletes it outright — it exists so all four states can actually be reached
 * and reviewed in a browser, which is this ticket's acceptance criterion.
 *
 * It is deliberately NOT a Zod schema. The real one lives in lib/validation/,
 * is shared with the server, and the server parse is authoritative
 * (code-standards.md §6) — writing half of it here, in the wrong layer, to be
 * moved later is worse than checks that are obviously throwaway.
 *
 * How to reach each state:
 *   leave a field empty        -> error, field validation
 *   put "fail" in the email    -> error, provider failure + mailto: fallback
 *   fill everything in         -> pending (1.2s), then success
 */
function mockValidate(values: {
  name: string;
  email: string;
  message: string;
}): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  if (values.name.trim() === "") {
    errors.name = ["Tell me what to call you."];
  }
  if (values.email.trim() === "") {
    errors.email = ["I need an address to reply to."];
  } else if (!values.email.includes("@")) {
    errors.email = ["That does not look like an email address."];
  }
  if (values.message.trim() === "") {
    errors.message = ["The message is empty."];
  }

  return errors;
}

type Props = {
  className?: string;
};

/**
 * The contact form — fields, submit, and the four states.
 *
 * This is the leaf that carries "use client" (code-standards.md §4): the page
 * around it stays a Server Component and Field/Input/Textarea all stay server
 * components too, exactly as PORT-023 built them.
 */
export function ContactForm({ className }: Props) {
  const [state, setState] = useState<FormState>({ status: "idle" });

  const pending = state.status === "pending";
  const fieldErrors =
    state.status === "error" ? (state.fieldErrors ?? FIELD_ERRORS_EMPTY) : FIELD_ERRORS_EMPTY;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const values = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    };

    const errors = mockValidate(values);
    if (Object.keys(errors).length > 0) {
      setState({
        status: "error",
        message: "Some fields need another look.",
        fieldErrors: errors,
      });
      return;
    }

    setState({ status: "pending" });
    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (values.email.includes("fail")) {
      setState({
        status: "error",
        message: "The message could not be sent — the email service did not respond.",
      });
      return;
    }

    setState({ status: "success" });
  }

  if (state.status === "success") {
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
        <Button
          variant="outline"
          size="sm"
          className="mt-6"
          onClick={() => setState({ status: "idle" })}
        >
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={cn("space-y-6", className)}>
      <Field name="name" label="Name" required error={fieldErrors.name?.[0]}>
        {(props) => (
          <Input {...props} type="text" autoComplete="name" placeholder="Your name" />
        )}
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
        {(props) => (
          <Textarea {...props} rows={6} placeholder="What are you working on?" />
        )}
      </Field>

      {/*
        The form-level failure. Field-level problems render inside their own
        Field (PORT-023 wired role="alert" there already), so this banner is
        only for the failure no single field owns — the provider being down —
        and it carries the mailto: fallback code-standards.md §6 requires of
        every user-facing failure.
      */}
      {state.status === "error" && state.fieldErrors === undefined ? (
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

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send message"}
        </Button>
        {/*
          The pending word is announced as well as shown: the button's own label
          changing is a visual cue only for anyone not focused on it.
        */}
        <p aria-live="polite" className="text-muted text-sm">
          {pending ? "Sending your message…" : ""}
        </p>
      </div>
    </form>
  );
}
