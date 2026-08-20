"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

const SHAPE = "inline-flex size-9 shrink-0 items-center justify-center rounded-full";

/** Never notifies, because nothing ever changes. Module scope keeps it stable. */
const neverChanges = () => () => {};

/**
 * false while rendering on the server and during hydration, true afterwards.
 *
 * The familiar useState + useEffect version of this does the same job, but
 * React Compiler's lint rules reject setState inside an effect body.
 */
function useHydrated() {
  return useSyncExternalStore(
    neverChanges,
    () => true,
    () => false,
  );
}

/**
 * Switches the site between light and dark.
 *
 * The server has no way to know which theme the visitor picked, so nothing is
 * rendered until the browser takes over — otherwise the wrong icon appears and
 * visibly swaps a moment later. A blank placeholder of the same size holds the
 * space so the header does not jump when the real button arrives.
 */
export function ThemeToggle({ className }: Props) {
  const { setTheme, resolvedTheme } = useTheme();
  const hydrated = useHydrated();

  if (!hydrated) {
    return <div className={cn(SHAPE, className)} aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      className={cn(
        SHAPE,
        "border-border text-muted cursor-pointer border transition-colors",
        "hover:bg-surface-2 hover:text-ink",
        "focus-visible:ring-ring focus-visible:ring-offset-ground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        className,
      )}
    >
      {isDark ? <Sun size={18} strokeWidth={1.9} /> : <Moon size={18} strokeWidth={1.9} />}
    </button>
  );
}
