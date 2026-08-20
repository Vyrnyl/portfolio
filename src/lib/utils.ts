import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
