import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

/**
 * Hardcoded until PORT-011 creates src/content/site.ts. Replace with
 * site.socials then. LinkedIn is missing on purpose — the URL is not known
 * yet, and a guessed one is worse than an absent one.
 */
const SOCIALS = [
  { href: "https://github.com/Vyrnyl", label: "GitHub" },
  { href: "mailto:vernaquino73@gmail.com", label: "Email" },
];

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
        <p className="text-faint text-badge font-mono">&copy; {year} Vernel Aquino</p>

        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {SOCIALS.map((social) => (
            <li key={social.href}>
              <a
                href={social.href}
                className={cn(
                  "text-muted hover:text-fern inline-flex items-center gap-1 rounded-md text-sm transition-colors",
                  "focus-visible:ring-ring focus-visible:ring-offset-ground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                )}
              >
                {social.label}
                <ArrowUpRight size={14} strokeWidth={1.9} aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
