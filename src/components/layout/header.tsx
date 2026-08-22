import Link from "next/link";

import { Container } from "@/components/layout/container";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { NavLinks } from "@/components/layout/nav-links";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/**
 * The site header: name on the left, navigation and theme toggle on the right.
 *
 * Stays pinned to the top as you scroll, and is translucent so content reads
 * as passing underneath it rather than colliding with it.
 *
 * This is a Server Component. Only NavLinks, ThemeToggle and MobileMenu run in
 * the browser, so site.nav and everything around it stay on the server.
 *
 * Above 1000px the links sit in a row; below it the row is hidden and
 * MobileMenu's burger takes over. Both are handed the same site.nav, so the
 * two lists cannot drift apart.
 */
export function Header({ className }: Props) {
  return (
    <header
      className={cn(
        "bg-ground/80 border-border sticky top-0 z-40 border-b backdrop-blur-md",
        className,
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className={cn(
            "text-h-sm text-ink -mx-2 rounded-md px-2 py-1 transition-colors",
            "hover:text-fern",
            "focus-visible:ring-ring focus-visible:ring-offset-ground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          )}
        >
          {site.name}
        </Link>

        <div className="flex items-center gap-3">
          <nav aria-label="Main" className="hidden lg:block">
            <NavLinks items={site.nav} />
          </nav>
          <ThemeToggle />
          <MobileMenu items={site.nav} className="lg:hidden" />
        </div>
      </Container>
    </header>
  );
}
