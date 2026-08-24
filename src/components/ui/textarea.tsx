import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type TextareaProps = ComponentPropsWithoutRef<"textarea">;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full resize-y rounded-md border border-border-strong bg-ground px-3 py-2 text-base text-ink placeholder:text-faint",
        "focus-visible:ring-ring focus-visible:ring-offset-ground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        "aria-invalid:border-coral",
        className,
      )}
      {...props}
    />
  );
}
