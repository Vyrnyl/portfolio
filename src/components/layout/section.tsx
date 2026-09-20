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

/*
 * Every Section carries this marker, and the rule that reads it lives in
 * globals.css: `.section + .section { padding-top: 0 }`.
 *
 * Padding sits on both edges so a lone Section breathes on both sides, but
 * that means every ADJACENT PAIR stacks two paddings and the visible gap is
 * double what either section asked for — measured before the fix at 208px
 * between two `default` sections at 1440, 168px for default+tight, 128px for
 * tight+tight. PORT-036 hit this on /contact and fixed it locally by merging
 * two sections into one; this fixes the cause, so no page has to know.
 *
 * The rule is a real CSS rule rather than a Tailwind `[&+&]` arbitrary
 * variant. That variant does compile, but it keys on the literal class string,
 * so it collapses `tight + tight` and `default + default` while silently
 * MISSING `default + tight` — the exact pair /about uses. One marker class
 * cannot have that bug.
 *
 * Only the top is removed: the pair keeps the FOLLOWING section's rhythm, and
 * the first section on a page keeps its full top padding because nothing
 * precedes it.
 */
const SPACING = {
  default: "section py-section",
  tight: "section py-section-tight",
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
