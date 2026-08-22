import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md";

type ButtonOwnProps = {
  /** Visual weight. `primary` is the page's one main action; `ghost` is tertiary. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

/** No `href` -> a real `<button>`. `href?: undefined` is what makes the union narrowable. */
type ButtonAsButton = ButtonOwnProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof ButtonOwnProps> & {
    href?: undefined;
  };

/** With `href` -> a `next/link`, which renders a real `<a>`. */
type ButtonAsLink = ButtonOwnProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof ButtonOwnProps | "type"> & {
    href: string;
    /**
     * Button-only attributes, blocked on the link branch. TypeScript's excess
     * property check on a union accepts a prop that exists on ANY member, so
     * without these an anchor would silently swallow `disabled` / `type`.
     */
    type?: never;
    disabled?: never;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const base = [
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap",
  "rounded-md text-sm font-medium transition-colors",
  "focus-visible:ring-ring focus-visible:ring-offset-ground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
  "active:brightness-95",
  "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  "disabled:pointer-events-none disabled:opacity-50",
];

const variants: Record<ButtonVariant, string> = {
  primary: "bg-fern text-fern-on hover:bg-fern-hover",
  outline: "border-border text-ink hover:bg-surface-2 border",
  ghost: "text-muted hover:text-ink hover:bg-surface-2",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3",
  md: "h-10 px-4",
};

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (props.href !== undefined) {
    return <Link {...props} className={classes} />;
  }

  return <button type="button" {...props} className={classes} />;
}
