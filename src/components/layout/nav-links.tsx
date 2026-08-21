"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export type NavItem = {
  href: string;
  label: string;
};

type Orientation = "horizontal" | "vertical";

type Props = {
  items: readonly NavItem[];
  /**
   * "horizontal" is the header row. "vertical" stacks the links full-width
   * with roomier tap targets — the mobile sheet.
   */
  orientation?: Orientation;
  /**
   * Called after a link is activated. The mobile sheet closes itself with
   * this. It fires even when the link points at the page you are already on,
   * which is why this is a callback rather than watching the pathname.
   */
  onNavigate?: () => void;
  className?: string;
};

const LIST: Record<Orientation, string> = {
  horizontal: "flex items-center gap-1",
  vertical: "flex flex-col items-stretch gap-1",
};

const ITEM: Record<Orientation, string> = {
  horizontal: "px-3 py-1.5 text-sm",
  vertical: "px-4 py-3 text-base",
};

/**
 * The list of navigation links, with the current page marked.
 *
 * Takes its links as a prop rather than importing them, so the same component
 * serves the desktop header and the mobile sheet, and will take a different
 * data source in PORT-011 without being edited.
 */
export function NavLinks({ items, orientation = "horizontal", onNavigate, className }: Props) {
  const pathname = usePathname();

  return (
    <ul className={cn(LIST[orientation], className)}>
      {items.map((item) => {
        // "/" must match exactly or it stays lit on every route. Every other
        // link also matches its children, so /projects/foo marks Projects.
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "block rounded-full transition-colors",
                ITEM[orientation],
                "focus-visible:ring-ring focus-visible:ring-offset-ground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                active
                  ? "bg-fern-wash text-fern font-medium"
                  : "text-muted hover:text-ink hover:bg-surface-2",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
