"use client";

/**
 * The last-resort error boundary. Spec: the `global-error.tsx` gap carried
 * since Sprint 0.
 *
 * `error.tsx` catches a failure inside a page. THIS catches a failure in the
 * root layout itself — and that difference dictates everything below, because
 * when this renders, the root layout has already failed. Gone with it:
 *
 *   - `<html>` and `<body>`. This file renders them itself. That is why it is
 *     the ONE component in the repo allowed to; anywhere else it would be a
 *     duplicate-document bug.
 *   - `next/font`. `--font-inter` and `--font-jetbrains` are injected onto the
 *     <html> className BY THE ROOT LAYOUT, so `--font-sans: var(--font-inter)`
 *     resolves to nothing here. `font-sans` would silently fall back to the
 *     browser default with no error — the same self-referential-token failure
 *     CLAUDE.md records for next/font naming, arriving through a different door.
 *   - `ThemeProvider`, and with it the `.dark` class the whole token system is
 *     keyed on. `@custom-variant dark (&:where(.dark, .dark *))` matches
 *     nothing when no ancestor carries the class, so every dark value in
 *     globals.css is unreachable — a dark-mode visitor would get the LIGHT
 *     palette on a page whose entire job is to be readable.
 *   - `Header`, `Footer` and `SkipLink`. Nothing to skip to, and a nav rendered
 *     by the layout that just crashed is not a nav worth trusting.
 *
 * So this file imports nothing from `@/components` and no stylesheet, and
 * styles itself with inline `style` objects plus one `<style>` tag. That is not
 * a shortcut — it is the shape Next's own built-in fallback uses
 * (`next/dist/client/components/builtin/global-error.js`), for exactly these
 * reasons. A stylesheet import here is a bet that the CSS pipeline survived a
 * crash severe enough to take out the root layout, and losing that bet means an
 * unstyled error page, which is worse than the plain one it replaced.
 *
 * The token values are therefore HARDCODED, and this is the one file in the
 * repo where the "tokens only, no hex" rule cannot apply — there is no
 * stylesheet to read a token from. ui-rules.md §5 carries the carve-out.
 *
 * THE HEX VALUES ARE COMPUTED, NOT EYEBALLED, and that is load-bearing. They
 * were hand-converted the first time and twelve of the sixteen drifted — light
 * `--faint` landed at 4.33:1 on `--ground`, a real WCAG AA failure, which is
 * the same token and the same failure PORT-052 spent an entire re-solve fixing.
 * If a token in globals.css changes, re-run the oklch->sRGB conversion rather
 * than matching by eye; the difference is invisible on screen and measurable
 * only with a contrast check.
 *
 * Theme comes from `prefers-color-scheme`, not `.dark`. This means a visitor
 * who toggled to dark against a light OS setting sees light here. That is
 * accepted rather than solved: reading the persisted next-themes value would
 * need a blocking inline script, and running more code inside a crash handler
 * to fix a cosmetic mismatch is the wrong trade.
 */

type Props = {
  /** Next passes the thrown error. `digest` is a server-side hash, production only. */
  error: Error & { digest?: string };
  /** Re-renders the whole tree, root layout included. */
  reset: () => void;
};

/* Exact sRGB conversions of the oklch() tokens in src/app/globals.css.
   Light is :root, dark is the .dark block. Measured contrast on --ground:
   light ink 15.21:1, light faint 4.81:1; dark ink 15.18:1, dark faint 5.60:1. */
const css = `
  :root {
    --ge-ground: #fbfaf7;      /* --ground */
    --ge-surface: #ffffff;     /* --surface */
    --ge-border: #e4e5df;      /* --border */
    --ge-ink: #1c2420;         /* --ink */
    --ge-faint: #66726a;       /* --faint, the PORT-052 re-derived value */
    --ge-fern: #2f7d5c;        /* --fern */
    --ge-fern-hover: #256549;  /* --fern-hover */
    --ge-fern-on: #ffffff;     /* --fern-on */
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --ge-ground: #161a18;
      --ge-surface: #1e2320;
      --ge-border: #2e3531;
      --ge-ink: #edefea;
      --ge-faint: #86958c;
      --ge-fern: #5fbf8f;
      --ge-fern-hover: #79cfa3;
      --ge-fern-on: #10201a;
    }
  }

  * { box-sizing: border-box; }

  html, body {
    margin: 0;
    padding: 0;
  }

  body {
    background: var(--ge-ground);
    color: var(--ge-ink);
    /* No next/font here, so this is a real system stack rather than
       font-sans. Inter is named first in case it is installed locally. */
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI",
      Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .ge-eyebrow {
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
      "Liberation Mono", monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ge-faint);
    margin: 0 0 16px;
  }

  .ge-title {
    /* Mirrors --text-h-lg: clamp(1.75rem, 3.6vw, 2.5rem) at 1.1/-0.028em. */
    font-size: clamp(1.75rem, 3.6vw, 2.5rem);
    line-height: 1.1;
    font-weight: 700;
    letter-spacing: -0.028em;
    margin: 0;
  }

  .ge-body {
    font-size: 1rem;
    line-height: 1.7;
    color: var(--ge-faint);
    max-width: 62ch;
    margin: 24px 0 0;
  }

  .ge-digest {
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
      "Liberation Mono", monospace;
    font-size: 0.875rem;
    color: var(--ge-faint);
    margin: 16px 0 0;
    word-break: break-all;
  }

  .ge-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 32px;
  }

  /* Mirrors the Button primitive's base + primary/outline at size md.
     Kept in sync by eye, not by import — see the file header. */
  .ge-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    padding: 0 16px;
    border-radius: 10px;
    font-size: 0.875rem;
    font-weight: 500;
    font-family: inherit;
    text-decoration: none;
    cursor: pointer;
    transition: background-color 0.15s, color 0.15s, border-color 0.15s;
  }

  .ge-btn-primary {
    background: var(--ge-fern);
    color: var(--ge-fern-on);
    border: none;
  }

  .ge-btn-primary:hover { background: var(--ge-fern-hover); }

  .ge-btn-outline {
    background: transparent;
    color: var(--ge-ink);
    border: 1px solid var(--ge-border);
  }

  .ge-btn-outline:hover { background: var(--ge-surface); }

  .ge-btn:focus-visible {
    outline: 2px solid var(--ge-fern);
    outline-offset: 2px;
  }

  /* The a11y floor still applies to a crash page. */
  @media (prefers-reduced-motion: reduce) {
    .ge-btn { transition-duration: 0.01ms; }
  }
`;

export default function GlobalError({ error, reset }: Props) {
  return (
    /* lang is set here because the root <html> that normally carries it is
       gone; without it a screen reader falls back to its own default voice. */
    <html lang="en">
      <body>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <main
          style={{
            minHeight: "100dvh",
            display: "flex",
            alignItems: "center",
            padding: "clamp(24px, 6vw, 96px) 24px",
          }}
        >
          <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
            <p className="ge-eyebrow">Error</p>
            <h1 className="ge-title">This site hit an unexpected problem</h1>
            <p className="ge-body">
              Something failed before the page could be built, so even the
              navigation is missing. Reloading usually clears it. If it keeps
              happening, the fault is on my end rather than yours — and the
              reference below tells me where to look.
            </p>

            {error.digest ? (
              <p className="ge-digest">Reference: {error.digest}</p>
            ) : null}

            <div className="ge-actions">
              <button
                type="button"
                onClick={reset}
                className="ge-btn ge-btn-primary"
              >
                Try again
              </button>
              {/*
                A plain <a>, not next/link, and the lint rule is disabled rather
                than satisfied.

                This is not a style preference. `global-error` is mounted INSIDE
                the AppRouter error boundary (next/dist/client/components/
                app-router.js — `errorComponent: globalError[0]`), so by the time
                this renders, the router that `next/link` navigates through is
                part of what failed. A <Link> would attempt a client-side
                transition on a crashed router and re-enter the same broken
                render; a plain <a> is a full document load that rebuilds the
                tree from scratch, which is the only reliable recovery here.

                Next's own fallback does exactly this, imperatively:
                `window.location.href = '/'`.
              */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/" className="ge-btn ge-btn-outline">
                Back to home
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
