import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type FieldRenderProps = {
  id: string;
  name: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  required?: boolean;
};

type FieldProps = {
  /** Also the control's `name` — Field derives `id` from it, so it must be unique on the page. */
  name: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: (props: FieldRenderProps) => ReactNode;
};

/**
 * Owns the id/aria wiring an accessible field needs — `htmlFor`,
 * `aria-describedby`, `aria-invalid` — so no consumer has to get it right.
 * The control itself is a render prop, so Field never needs to know whether
 * it's wrapping an Input or a Textarea.
 */
export function Field({ name, label, hint, error, required, className, children }: FieldProps) {
  const id = `field-${name}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-coral-text">
            *
          </span>
        )}
      </label>
      {children({
        id,
        name,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
        required,
      })}
      {hint && !error && (
        <p id={hintId} className="text-sm text-faint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-sm text-coral-text">
          {error}
        </p>
      )}
    </div>
  );
}
