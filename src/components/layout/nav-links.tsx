"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export type NavItem = {
  href: string;
  label: string;
};

type Props = {
  items: readonly NavItem[];
  className?: string;
};

/**
 * The list of navigation links, with the current page marked.
 *
 * Takes its links as a prop rather than importing them, so the same component
 * can serve the desktop header now, the mobile sheet in PORT-007, and a
 * different data source in PORT-011 without being edited.
 */
export function NavLinks({ items, className }: Props) {
  const pathname = usePathname();

  return (
    <ul className={cn("flex items-center gap-1", className)}>
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
              aria-current={active ? "page" : undefined}
              className={cn(
                "block rounded-full px-3 py-1.5 text-sm transition-colors",
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
