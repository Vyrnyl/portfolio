import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type ChipProps = {
  /** Whether this chip is the active selection in its group. */
  pressed: boolean;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "className" | "type">;

/**
 * A pill-shaped toggle button — one option in a single-select group, like a
 * tag filter. Purely presentational plus the toggle semantics; which chip is
 * active and what selecting one does belongs to whatever renders the group.
 */
export function Chip({ pressed, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cn(
        "inline-flex cursor-pointer items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
        "focus-visible:ring-ring focus-visible:ring-offset-ground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        pressed
          ? "border-fern-wash bg-fern-wash text-fern"
          : "border-border text-muted hover:border-fern hover:bg-surface-2 hover:text-ink",
        className,
      )}
      {...props}
    />
  );
}
