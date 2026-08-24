import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type CardProps = ComponentPropsWithoutRef<"div"> & {
  /**
   * The standard interior padding. Leave it off when a child needs to bleed
   * to the edge — an image, for instance — and pad just the content that
   * needs it instead.
   */
  padded?: boolean;
};

/**
 * A bordered surface box. Knows nothing about what it contains — no Project,
 * no Job, no domain type of any kind. `components/sections/` is where a
 * specific card (ProjectCard, PracticeCard, ...) puts something inside one.
 */
export function Card({ padded = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface",
        padded && "p-6",
        className,
      )}
      {...props}
    />
  );
}
