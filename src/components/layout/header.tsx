import Link from "next/link";

import { Container } from "@/components/layout/container";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { NavLinks, type NavItem } from "@/components/layout/nav-links";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

/**
 * Hardcoded until PORT-011 creates src/content/site.ts. Replace this array
 * with site.nav then — nothing else in this file has to change.
 */
const NAV: readonly NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/about", label: "About" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

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
 * the browser, so the nav array and everything around it stay on the server.
 *
 * Above 1000px the links sit in a row; below it the row is hidden and
 * MobileMenu's burger takes over. Both are handed the same NAV array, so the
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
          Vernel Aquino
        </Link>

        <div className="flex items-center gap-3">
          <nav aria-label="Main" className="hidden lg:block">
            <NavLinks items={NAV} />
          </nav>
          <ThemeToggle />
          <MobileMenu items={NAV} className="lg:hidden" />
        </div>
      </Container>
    </header>
  );
}
