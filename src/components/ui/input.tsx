import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type InputProps = ComponentPropsWithoutRef<"input">;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-md border border-border-strong bg-ground px-3 py-2 text-base text-ink placeholder:text-faint",
        "focus-visible:ring-ring focus-visible:ring-offset-ground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        "aria-invalid:border-coral",
        className,
      )}
      {...props}
    />
  );
}
