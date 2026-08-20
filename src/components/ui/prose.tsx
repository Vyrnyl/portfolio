import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Long-form text: measure plus styling for elements Prose does not render
 * itself. Everything is a descendant selector, so callers write plain
 * `<p>` / `<h2>` / `<ul>` and get the house style without per-element classes.
 *
 * Deliberately hand-rolled rather than @tailwindcss/typography: the plugin
 * ships its own grey ramp and would have to be re-tokenised rule by rule to
 * respect the theme, which is more work than the dozen lines below.
 */
const prose = [
  // break-words so a long unbroken URL wraps instead of forcing a horizontal
  // scrollbar at 375 — the narrowest column is only ~340px of usable width.
  "max-w-measure text-base text-muted break-words",

  // Vertical rhythm between blocks, so no child needs its own margin.
  "[&>*+*]:mt-5",

  "[&_h2]:text-h-md [&_h2]:text-ink [&_h2]:mt-12",
  "[&_h3]:text-h-sm [&_h3]:text-ink [&_h3]:mt-8",
  "[&>h2:first-child]:mt-0 [&>h3:first-child]:mt-0",

  "[&_strong]:text-ink [&_strong]:font-semibold",
  "[&_em]:italic",

  "[&_a]:text-fern [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4",
  "[&_a]:transition-colors [&_a:hover]:text-fern-hover",

  "[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5",
  "[&_li]:mt-2 [&_li]:marker:text-faint",

  "[&_code]:bg-surface-2 [&_code]:text-ink [&_code]:rounded-sm",
  "[&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm",

  "[&_blockquote]:border-border-strong [&_blockquote]:border-l-2 [&_blockquote]:pl-4",
  "[&_hr]:border-border [&_hr]:my-10",
];

export function Prose({ children, className }: Props) {
  return <div className={cn(prose, className)}>{children}</div>;
}
