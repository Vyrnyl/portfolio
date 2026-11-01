import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/*
 * Every custom --text-* step in globals.css must be listed here. twMerge cannot
 * see the stylesheet, so an unknown `text-badge` reads as a COLOUR, and the
 * next real colour (`text-muted`) silently removes it. The element then falls
 * back to 16px at normal weight with no error anywhere.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["h-xl", "h-lg", "h-md", "h-sm", "lead", "stat", "eyebrow", "badge"],
    },
  },
});

/**
 * Merge Tailwind classes so a caller's `className` always wins.
 *
 * Plain `clsx` would leave both `px-4` and `px-8` in the string and let source
 * order in the compiled stylesheet decide — which is not the order the props
 * were written in. `twMerge` understands the utility groups and drops the loser.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
