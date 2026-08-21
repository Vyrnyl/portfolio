"use client";

import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { NavLinks, type NavItem } from "@/components/layout/nav-links";
import { cn } from "@/lib/utils";

type Props = {
  items: readonly NavItem[];
  className?: string;
};

/**
 * Must match --breakpoint-lg in globals.css. Above this width the desktop nav
 * is back and the burger is hidden, so an open sheet has to close itself —
 * otherwise it keeps the scroll lock and the focus trap with no way to reach
 * the control that dismisses it.
 *
 * Deliberately a literal rather than reading the CSS variable: Tailwind decides
 * which theme variables reach the stylesheet, and a lookup that silently
 * returns "" would fail without a symptom.
 */
const DESKTOP_QUERY = "(min-width: 1000px)";

const SHEET_ID = "mobile-menu";

/* Same shape as ThemeToggle's button so the two read as a pair in the header.
   PORT-020 is the moment to lift this into a shared icon button, not before. */
const BURGER = cn(
  "inline-flex size-9 shrink-0 items-center justify-center rounded-full",
  "border-border text-muted cursor-pointer border transition-colors",
  "hover:bg-surface-2 hover:text-ink",
  "focus-visible:ring-ring focus-visible:ring-offset-ground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
);

/**
 * The navigation for viewports below 1000px: a burger in the header that drops
 * a sheet of links over a blurred scrim.
 *
 * Renders the burger in place; the sheet and scrim are portaled to <body>.
 * That is not a stylistic choice — the header carries `backdrop-blur-md`, and
 * an element with a backdrop-filter becomes the containing block for its
 * `position: fixed` descendants. A scrim rendered inside the header would size
 * itself to the 64px header box instead of the viewport.
 *
 * Props: `items` is the same array the desktop nav is given, so both lists
 * always agree. `className` lands on the burger — the header uses it to hide
 * the button at `lg:`.
 */
export function MobileMenu({ items, className }: Props) {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  /** A close the user asked for: focus goes back to the button they left. */
  const close = useCallback(() => {
    setOpen(false);
    burgerRef.current?.focus();
  }, []);

  // Move focus into the sheet as it opens.
  useEffect(() => {
    if (!open) return;
    sheetRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
  }, [open]);

  // Freeze the page behind the sheet. The padding compensates for the
  // scrollbar the lock removes, so the header does not jump sideways.
  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [open]);

  // Escape, the tab cycle, the back button, and the desktop breakpoint.
  useEffect(() => {
    if (!open) return;

    /**
     * The cycle, in the order the eye reads it: the burger sits above the
     * sheet, and it is the labelled close control, so it belongs inside.
     */
    const focusables = () => {
      const inSheet = sheetRef.current
        ? Array.from(
            sheetRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
          )
        : [];
      return burgerRef.current ? [burgerRef.current, ...inSheet] : inSheet;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab") return;

      const nodes = focusables();
      if (nodes.length === 0) return;

      // Every Tab is handled here, never handed back to the browser. The sheet
      // is portaled to the end of <body>, so it sits after the footer in the
      // DOM while appearing directly under the burger. Native tab order would
      // walk the burger straight into the page behind the scrim; stepping the
      // cycle by hand makes the trap independent of where the portal landed.
      event.preventDefault();

      const index = nodes.indexOf(document.activeElement as HTMLElement);

      // Focus was outside the cycle entirely — pull it to whichever end the
      // user was heading towards.
      if (index === -1) {
        (event.shiftKey ? nodes[nodes.length - 1] : nodes[0])?.focus();
        return;
      }

      const step = event.shiftKey ? -1 : 1;
      nodes[(index + step + nodes.length) % nodes.length]?.focus();
    };

    // Back/forward is navigation too, and it leaves no link click to hook.
    const onPopState = () => setOpen(false);

    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("popstate", onPopState);
    desktop.addEventListener("change", onDesktop);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("popstate", onPopState);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={burgerRef}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        aria-controls={SHEET_ID}
        aria-label={open ? "Close menu" : "Open menu"}
        className={cn(BURGER, className)}
      >
        {open ? <X size={18} strokeWidth={1.9} /> : <Menu size={18} strokeWidth={1.9} />}
      </button>

      {open
        ? createPortal(
            /* Starts at the header's bottom edge and fills the rest of the
               viewport. `overflow-hidden` is what clips the sheet's slide, so
               it appears to come out from under the header. */
            <div className="fixed inset-x-0 top-16 bottom-0 z-50 flex flex-col overflow-hidden">
              <div
                id={SHEET_ID}
                ref={sheetRef}
                className="bg-surface border-border animate-sheet-in max-h-full overflow-y-auto overscroll-contain border-b"
              >
                <nav aria-label="Main" className="px-gut py-4">
                  <NavLinks items={items} orientation="vertical" onNavigate={close} />
                </nav>
              </div>

              {/* Mouse convenience only — Escape and the burger cover keyboard,
                  so this stays out of the accessibility tree. */}
              <div
                aria-hidden
                onClick={close}
                className="bg-ground/60 animate-scrim-in flex-1 backdrop-blur-sm"
              />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
