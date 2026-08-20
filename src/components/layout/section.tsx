import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  /** Rendered as the section's <h2>. Omit for a section that has its own heading. */
  heading?: ReactNode;
  /** Anchor target, e.g. for a nav link to `/#work`. */
  id?: string;
  spacing?: "default" | "tight";
  /**
   * Skip the built-in Container so the section's background can run edge to
   * edge. The caller then has to place its own Container around the content.
   */
  bleed?: boolean;
  className?: string;
};

const SPACING = {
  default: "py-section",
  tight: "py-section-tight",
} as const;

/**
 * A band of the page: vertical rhythm plus, by default, the Container.
 *
 * Wrapping the Container is deliberate — it is why a page file can read as a
 * flat outline of sections with no layout classes of its own. The escape hatch
 * is `bleed`, for a section whose background must reach the viewport edge.
 */
export function Section({
  children,
  heading,
  id,
  spacing = "default",
  bleed = false,
  className,
}: Props) {
  const body = (
    <>
      {heading ? <h2 className="text-h-md text-ink mb-6">{heading}</h2> : null}
      {children}
    </>
  );

  return (
    <section id={id} className={cn(SPACING[spacing], className)}>
      {bleed ? body : <Container>{body}</Container>}
    </section>
  );
}
