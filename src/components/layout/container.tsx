import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * The single owner of page width and the horizontal gutter.
 *
 * `max-w-shell` is 1120px and `px-gut` is 24px, tightening to 18px below the
 * `md` (760px) breakpoint — both from the design tokens, so neither number
 * appears here. No page or section may set its own `max-w-*` or `px-*`; if one
 * does, Container is being bypassed and the site's edges stop lining up.
 */
export function Container({ children, className }: Props) {
  return <div className={cn("max-w-shell px-gut mx-auto w-full", className)}>{children}</div>;
}
