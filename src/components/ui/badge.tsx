import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type BadgeProps = ComponentPropsWithoutRef<"span">;

/**
 * A small text chip for a tag or stack item. Purely presentational — no
 * click behavior, no knowledge of what the text means.
 */
export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-badge font-mono text-muted",
        className,
      )}
      {...props}
    />
  );
}
