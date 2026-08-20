import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/**
 * A link that jumps straight to the page's main content.
 *
 * It is invisible until it receives keyboard focus, so it costs a mouse user
 * nothing while saving a keyboard user from tabbing through the whole header
 * on every single page.
 *
 * Must be the first focusable element in <body>, and something on the page
 * must have id="main" for it to land on.
 */
export function SkipLink({ className }: Props) {
  return (
    <a
      href="#main"
      className={cn(
        "sr-only",
        "focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50",
        "focus:bg-fern focus:text-fern-on focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-medium",
        "focus:ring-ring focus:ring-offset-ground focus:ring-2 focus:ring-offset-2 focus:outline-none",
        className,
      )}
    >
      Skip to content
    </a>
  );
}
