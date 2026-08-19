# UI Rules

The styling contract. Tokens live here and nowhere else. Read before building any component; [ui-registry.md](ui-registry.md) records what has been built against it.

---

## 1. Source of truth

The visual design comes from **Google Stitch**, accessed via its MCP connection.

- **Stitch is the visual reference.** Layout, spacing rhythm, type scale, and color come from the design.
- **This file is the implementation contract.** Every value extracted from Stitch gets written down here *once*, then built against.
- **Stitch's exported markup is a reference, not a drop-in.** It is rebuilt as typed React components using the tokens below. Pasting generated HTML produces hardcoded hexes and one-off class soup — exactly what the registry exists to prevent.

**Workflow:** extract → record in §3 → build against this file. If a value is missing here, add it here first; do not read it out of the design a second time mid-build. Two lookups produce two greys.

> **Status: tokens shipped (PORT-003 ✔).** §2 is the shipped `globals.css` verbatim; §3 is the canonical hex record it derives from.

---

## 2. Token strategy (Tailwind v4)

Tailwind v4 configures in CSS, not `tailwind.config.js`. Two blocks, and the split matters:

- **Raw palette values** — defined on `:root`, overridden in `.dark`. These are the actual colors.
- **Semantic tokens** — defined in `@theme inline`, referencing the raw vars. These are what components use.

`@theme inline` (not plain `@theme`) is required when a token's value is a `var()`. Plain `@theme` resolves values at build time, which freezes the light-mode color into the utility class and breaks dark mode. **This is the single most common Tailwind v4 mistake — get it right once here.**

```css
/* src/app/globals.css — this is the shipped file, verbatim. */
@import "tailwindcss";

/* Class-based dark mode. Without this, v4 keys off prefers-color-scheme only
   and the `.dark` toggle does nothing. */
@custom-variant dark (&:where(.dark, .dark *));

/* ---------------------------------------------------------------------------
   Raw palette.
   Source of truth is the prototype hex in ui-rules.md §3; the values below are
   exact sRGB -> OKLCH conversions of those hexes, not hand-tuned. Change the
   hex in §3 first, then re-convert. Never edit these in isolation.
--------------------------------------------------------------------------- */

:root {
  --ground:        oklch(0.985 0.004  91);
  --surface:       oklch(1     0       0);
  --surface-2:     oklch(0.966 0.007 107);
  --border:        oklch(0.919 0.008 114);
  --border-strong: oklch(0.866 0.012 117);
  --ink:           oklch(0.251 0.014 164);
  --muted:         oklch(0.514 0.020 159);
  --faint:         oklch(0.661 0.018 157);
  --fern:          oklch(0.532 0.0931 162.4);
  --fern-hover:    oklch(0.457 0.080 162);
  --fern-on:       oklch(1     0       0);
  --fern-wash:     oklch(0.955 0.013 160);
  --coral:         oklch(0.6065 0.1649 33.4);
  --coral-wash:    oklch(0.951 0.019  38);
  --ring:          var(--fern);

  /* Layout. Not theme-dependent. */
  --gut: 24px;
}

/* Re-derived for dark, not inverted: fern lightens to hold contrast on a dark
   ground, and --fern-on flips from white to near-black. */
.dark {
  --ground:        oklch(0.213 0.007 164);
  --surface:       oklch(0.250 0.009 159);
  --surface-2:     oklch(0.282 0.011 156);
  --border:        oklch(0.321 0.012 161);
  --border-strong: oklch(0.381 0.015 153);
  --ink:           oklch(0.949 0.007 124);
  --muted:         oklch(0.714 0.017 160);
  --faint:         oklch(0.585 0.021 162);
  --fern:          oklch(0.733 0.116 160);
  --fern-hover:    oklch(0.788 0.106 160);
  --fern-on:       oklch(0.227 0.025 168);
  --fern-wash:     oklch(0.284 0.025 166);
  --coral:         oklch(0.731 0.134  33);
  --coral-wash:    oklch(0.271 0.028  37);
  --ring:          var(--fern);
}

/* Page gutter tightens below the 760 breakpoint (ui-rules.md §3). */
@media (width < 760px) {
  :root {
    --gut: 18px;
  }
}

/* ---------------------------------------------------------------------------
   Semantic tokens.
   `inline` is REQUIRED. Plain @theme resolves var() at build time and bakes the
   light value into every utility class, so dark mode silently does nothing.
   This one keyword is the whole trick.
--------------------------------------------------------------------------- */

@theme inline {
  --color-ground:        var(--ground);
  --color-surface:       var(--surface);
  --color-surface-2:     var(--surface-2);
  --color-border:        var(--border);
  --color-border-strong: var(--border-strong);
  --color-ink:           var(--ink);
  --color-muted:         var(--muted);
  --color-faint:         var(--faint);
  --color-fern:          var(--fern);
  --color-fern-hover:    var(--fern-hover);
  --color-fern-on:       var(--fern-on);
  --color-fern-wash:     var(--fern-wash);
  --color-coral:         var(--coral);
  --color-coral-wash:    var(--coral-wash);
  --color-ring:          var(--ring);

  --font-sans: var(--font-inter);
  --font-mono: var(--font-jetbrains);

  --radius-sm: 10px;
  --radius-md: 14px;
  --radius-lg: 22px;
  --radius-xl: 28px;

  /* max-w-shell (page) and max-w-measure (prose). Deliberately not named
     `max`/`prose` — both collide with Tailwind built-ins. */
  --container-shell:   1120px;
  --container-measure:  680px;

  /* px-gut, gap-gut, ... */
  --spacing-gut: var(--gut);
}

/* ------------------------------------------------------------------------- */

@layer base {
  body {
    @apply bg-ground text-ink font-sans antialiased;
  }

  h1, h2, h3, h4 {
    text-wrap: balance;
  }

  p {
    text-wrap: pretty;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Components then write `bg-ground`, `text-muted`, `border-border`, `bg-fern text-fern-on`, `rounded-lg` — and dark mode works with **no `dark:` variants on colour at all**.

**Verified (PORT-003).** Every oklch value above is an exact sRGB→OKLCH conversion of its §3 hex — confirmed by round-tripping the compiled CSS hex fallbacks: all 28 values match to the byte. `fern` and `coral` in light mode need 4 decimal places to round-trip exactly; 3 leaves them one 8-bit unit off.

Ported here beyond colour: `--container-shell` / `--container-measure` (deliberately not named `max` / `prose` — both collide with Tailwind built-ins), `--spacing-gut` (24px, 18px below 760), and the `prefers-reduced-motion` block.

**Deliberately not ported yet:** the type scale (§3) belongs with `Prose` in PORT-004; the shadow tokens (§3) have no dark-theme values recorded, so they land with `Card` in PORT-021; the custom breakpoints (1000 / 760 / 460) are not in `@theme` — see open question 6 in progress.md.

---

## 3. Tokens

**Ported and shipped (PORT-003 ✔).** The hex values below are **canonical** — they are the approved prototype. The `oklch()` in §2 is a derived artifact converted from them. To change a colour: edit the hex here first, re-convert, then update §2. Never edit §2 in isolation.

### Design direction

The Stitch export was a brutalist terminal: cold navy, 2px corners, Material Design token dump. It was reframed as a **workbench** — monospace demoted from interface chrome to margin annotation (labels, metadata, tags), foundation rebuilt warm and rounded. The developer signal survives; the coldness does not.

### Color

Neutrals carry a slight green bias so they read as chosen rather than inherited. Coral is the single accent — status dot and error states only.

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--ground` | `#FBFAF7` | `#161A18` | Page background (warm off-white / warm charcoal) |
| `--surface` | `#FFFFFF` | `#1E2320` | Cards, raised panels |
| `--surface-2` | `#F4F4EF` | `#252B27` | Hover fills, subtle wells |
| `--border` | `#E4E5DF` | `#2E3531` | Hairlines, dividers |
| `--border-strong` | `#D2D4CB` | `#3D453F` | Input borders, emphasised edges |
| `--ink` | `#1C2420` | `#EDEFEA` | Primary text, headings |
| `--muted` | `#5E6B63` | `#9AA69F` | Body copy, secondary text |
| `--faint` | `#8A968E` | `#718078` | Metadata, eyebrow labels |
| `--fern` | `#2F7D5C` | `#5FBF8F` | Brand — primary buttons, links, active nav |
| `--fern-hover` | `#256549` | `#79CFA3` | Primary button hover |
| `--fern-on` | `#FFFFFF` | `#10201A` | Text **on** a fern background |
| `--fern-wash` | `#E9F3ED` | `#1E2E27` | Active nav pill, success note, badge fill |
| `--coral` | `#D2543A` | `#F08670` | Errors, required marks, status dot accent |
| `--coral-wash` | `#FBEBE6` | `#33221D` | Error note background |

Dark is **re-derived, not inverted** — fern lightens to hold contrast on a dark ground, and `--fern-on` flips from white to near-black.

Contrast floor, measured in both themes: `ink`/`ground` ≥ 7:1 · `muted`/`ground` ≥ 4.5:1 · `fern-on`/`fern` ≥ 4.5:1.

### Typography

Production loads these via `next/font` (self-hosted). The prototype uses system stacks, so headings render slightly looser there than they will in the build.

| Token | Family | Used for |
|---|---|---|
| `--font-sans` | Inter | Everything |
| `--font-mono` | JetBrains Mono | Eyebrows, badges, metadata, code |

The identity is the **contrast** between the two: large headlines at tight tracking against small uppercase mono at wide tracking.

| Role | Size | Weight | Tracking |
|---|---|---|---|
| `h-xl` (page hero) | `clamp(2.5rem, 7vw, 4.25rem)` | 750 | `-0.035em` |
| `h-lg` (page title) | `clamp(1.75rem, 3.6vw, 2.5rem)` | 700 | `-0.028em` |
| `h-md` (section) | `1.3rem` | 650 | `-0.02em` |
| `h-sm` (card title) | `1.0625rem` | 650 | `-0.012em` |
| `lead` | `clamp(1.0625rem, 1.7vw, 1.25rem)` | 400 | — |
| body | `1rem` / 1.65 | 400 | — |
| `eyebrow` | `11px` mono, uppercase | 600 | `+0.14em` |
| `badge` | `12px` mono | 400 | — |

Headings get `text-wrap: balance`; body copy gets `text-wrap: pretty`; running text stays near 65ch via `.measure`.

### Radius — generous, and a real scale

The Stitch scale was inverted (`full: 0.75rem` made pills square). Replaced with:

| Token | Value | Used for |
|---|---|---|
| `--r-sm` | `10px` | Small chips, gallery blocks |
| `--r-md` | `14px` | Buttons, inputs, notes |
| `--r-lg` | `22px` | Cards |
| `--r-xl` | `28px` | Large panels, avatar |
| `--r-full` | `999px` | Pills, badges, filter chips, status dot |

### Spacing & elevation

| Token | Value |
|---|---|
| `--max` (container) | `1120px` |
| `--narrow` (prose) | `680px` |
| `--gut` (page gutter) | `24px`, `18px` below 760 |
| Section rhythm | `clamp(56px, 9vw, 104px)` |
| `--shadow` | `0 1px 2px rgba(28,36,32,.05), 0 8px 24px -12px rgba(28,36,32,.14)` |
| `--shadow-lift` | `0 2px 4px rgba(28,36,32,.06), 0 18px 40px -16px rgba(28,36,32,.20)` |

Elevation is **border-first**. Shadows appear only on the primary button, card hover, and the avatar; dark mode swaps to pure-black shadows at higher opacity.

### Motion

| Property | Value |
|---|---|
| Standard | `transition: .18s` on color/border |
| Card hover | `translateY(-3px)` + `--shadow-lift` |
| Status dot | 2.4s `ping` scale-and-fade |
| Hero underline | 0.9s `stroke-dashoffset` draw, 0.5s delay, once |
| Mobile sheet | 0.26s `cubic-bezier(.32,.72,0,1)` slide |

`prefers-reduced-motion` disables all of it, and pins the hero underline to its drawn state.

### Signature detail

A hand-drawn coral underline strokes itself beneath the accent word in the hero on load. It is the **only** flourish on the site — the one element that reads as drawn rather than generated. Everything around it stays quiet deliberately. If it ever feels like too much, delete the `.underlined svg` rule; nothing else depends on it.

### Icons

`lucide-react`, imported per icon. Default `size={18}`, `strokeWidth={1.9}`. Decorative icons `aria-hidden`; icon-only buttons carry `aria-label`.

---

## 4. Layout structure

```
┌────────────────────────────────────────┐
│ SkipLink (visually hidden until focus) │
├────────────────────────────────────────┤
│ Header — sticky, backdrop-blur, border │
│   logo/name        nav      theme·CTA  │
├────────────────────────────────────────┤
│ <main id="main">                       │
│   Section → Container → content        │
│   Section → Container → content        │
├────────────────────────────────────────┤
│ Footer — socials, copyright            │
└────────────────────────────────────────┘
```

Three layout components own all spacing. **Individual pages set no page-level padding or max-width** — if a page is writing `max-w-` or `px-`, that is a bug.

| Component | Responsibility |
|---|---|
| `Container` | `mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8` |
| `Section` | Vertical rhythm `py-16 sm:py-24`, optional heading slot |
| `Prose` | Long-form text width and child element styling (`/about`, project narrative) |

### Breakpoints

Tailwind defaults. Verified at four widths at every visual gate — not retrofitted:

| Width | What changes |
|---|---|
| **1440** | Full layout, max container width reached |
| **1024** (`lg`) | Project grid 3 → 2 columns |
| **768** (`md`) | Nav collapses to a mobile menu; grids → 1 column; resume timeline stacks |
| **375** | Single column throughout; nothing overflows horizontally |

Mobile-first: write the base style for 375, add `sm:`/`md:`/`lg:` upward. Never `max-` variants.

---

## 5. Component contract

Rules for anything in `components/`:

- **Tokens only.** No hex value, no `text-gray-500`, no arbitrary `[#1a1a1a]`. If a value is needed and no token covers it, add the token to §3 first.
- **No `dark:` variants for color.** Colors are semantic tokens that swap automatically. `dark:` is permitted only for genuinely non-color differences (e.g. an image opacity adjustment).
- **Variants are union types**, not loose strings: `variant?: "primary" | "ghost" | "outline"`.
- **Class merging via `cn()`** (`clsx` + `tailwind-merge`), and every component accepts `className` so callers can adjust layout without a new variant.
- **Server by default.** Add `"use client"` only for state, effects, or event handlers — and only on the smallest possible subtree.
- **Focus is visible.** `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg`. Never remove an outline without replacing it.
- **Interactive elements are real elements.** `<button>` and `<a>`, never a `<div onClick>`.
- **Images go through `next/image`** with explicit `width`/`height` (or `fill` + a sized parent) and meaningful `alt`.
- **Every list has a designed empty state.** A filter that matches nothing must say so, not render blank.

---

## 6. Component styling reference

Filled in as components are built. Keep in lockstep with [ui-registry.md](ui-registry.md) — this describes *how it looks*, the registry records *where it lives*.

| Component | Base classes | Notes |
|---|---|---|
| `Button` | `inline-flex items-center justify-center gap-2 rounded-btn text-sm font-medium transition-colors focus-visible:ring-2 …` | Variants: `primary` `outline` `ghost`. Sizes: `sm` `md`. |
| `Card` | `rounded-card border border-border bg-surface` | Elevation via border, not shadow |
| `Badge` | `inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-mono text-fg-muted` | Stack/tag chips |
| `Input` / `Textarea` | `w-full rounded-btn border border-border bg-bg px-3 py-2 text-base placeholder:text-fg-muted focus-visible:ring-2 …` | `aria-invalid` → `border-danger` |
| `Field` | `space-y-1.5` | Wraps label + control + error; owns the `id`/`htmlFor`/`aria-describedby` wiring |
| `Container` | `mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8` | |
| `Section` | `py-16 sm:py-24` | |
| `ProjectCard` | `group` + `Card` + `hover:border-brand transition-colors` | Whole card is one link; title carries the accessible name |
| *(add rows as built)* | | |

---

## 7. Accessibility floor

Non-negotiable, checked at every visual gate:

- One `<h1>` per page; heading levels never skip.
- `<main id="main">` present, targeted by the skip link.
- All form controls have a real `<label>`; errors are linked via `aria-describedby` and the field is `aria-invalid`.
- Form submission result is announced in an `aria-live="polite"` region.
- The site is fully operable by keyboard — including the mobile menu, which must trap focus and close on `Escape`.
- The theme toggle has an `aria-label` and does not cause a flash of wrong theme on load (`next-themes` + `suppressHydrationWarning` on `<html>`).
- Contrast ratios per §3, measured in both themes.
