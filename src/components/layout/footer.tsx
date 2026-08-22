import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { site } from "@/content/site";
import type { SocialLink } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * The word shown on screen for each platform.
 *
 * site.socials carries the *accessible* name ("GitHub profile"); this is the
 * shorter visible text. Declared as a full Record over the platform union, so
 * adding a platform in types.ts fails the build here until it has a word —
 * rather than rendering `undefined` in the footer.
 */
const PLATFORM_TEXT: Record<SocialLink["platform"], string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  email: "Email",
  x: "X",
  dribbble: "Dribbble",
};

type Props = {
  className?: string;
};

/**
 * The bar across the bottom of every page: copyright and outbound links.
 *
 * Sinks to the bottom of the viewport on short pages, which depends on <body>
 * being a full-height flex column. The root layout sets that up.
 *
 * The year is calculated when the site is built, not when it is viewed,
 * because these pages are static. It updates on the next deploy — the
 * alternative is making the whole footer dynamic to keep one number correct
 * for one night of the year.
 */
export function Footer({ className }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className={cn("border-border mt-auto border-t", className)}>
      <Container className="flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
        <p className="text-faint text-badge font-mono">
          &copy; {year} {site.name}
        </p>

        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {site.socials.map((social) => (
            <li key={social.platform}>
              <a
                href={social.href}
                aria-label={social.label}
                className={cn(
                  "text-muted hover:text-fern inline-flex items-center gap-1 rounded-md text-sm transition-colors",
                  "focus-visible:ring-ring focus-visible:ring-offset-ground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                )}
              >
                {PLATFORM_TEXT[social.platform]}
                <ArrowUpRight size={14} strokeWidth={1.9} aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
