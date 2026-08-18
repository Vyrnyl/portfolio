# UI Rules

The styling contract. Tokens live here and nowhere else. Read before building any component; [ui-registry.md](ui-registry.md) records what has been built against it.

---

## 1. Source of truth

The visual design comes from **Google Stitch**, accessed via its MCP connection.

- **Stitch is the visual reference.** Layout, spacing rhythm, type scale, and color come from the design.
- **This file is the implementation contract.** Every value extracted from Stitch gets written down here *once*, then built against.
- **Stitch's exported markup is a reference, not a drop-in.** It is rebuilt as typed React components using the tokens below. Pasting generated HTML produces hardcoded hexes and one-off class soup — exactly what the registry exists to prevent.

**Workflow:** extract → record in §3 → build against this file. If a value is missing here, add it here first; do not read it out of the design a second time mid-build. Two lookups produce two greys.

> **Status: tokens extracted and proven in both themes** via the design prototype. §3 below is the record. `PORT-003` is now a port job — convert these hex values to `oklch()` and implement the `@theme inline` pattern in §2.

---

## 2. Token strategy (Tailwind v4)

Tailwind v4 configures in CSS, not `tailwind.config.js`. Two blocks, and the split matters:

- **Raw palette values** — defined on `:root`, overridden in `.dark`. These are the actual colors.
- **Semantic tokens** — defined in `@theme inline`, referencing the raw vars. These are what components use.

`@theme inline` (not plain `@theme`) is required when a token's value is a `var()`. Plain `@theme` resolves values at build time, which freezes the light-mode color into the utility class and breaks dark mode. **This is the single most common Tailwind v4 mistake — get it right once here.**

```css
/* src/app/globals.css */
@import "tailwindcss";

/* Class-based dark mode. Without this, v4 keys off prefers-color-scheme
   only and the theme toggle does nothing. */
@custom-variant dark (&:where(.dark, .dark *));

:root {
  --ground:        oklch(0.99 0.004 106);
  --surface:       oklch(1 0 0);
  --surface-2:     oklch(0.97 0.005 106);
  --border:        oklch(0.91 0.005 118);
  --border-strong: oklch(0.85 0.007 118);
  --ink:           oklch(0.25 0.012 158);
  --muted:         oklch(0.49 0.018 158);
  --faint:         oklch(0.64 0.014 152);
  --fern:          oklch(0.52 0.093 159);
  --fern-hover:    oklch(0.44 0.088 159);
  --fern-on:       oklch(1 0 0);
  --fern-wash:     oklch(0.95 0.021 159);
  --coral:         oklch(0.56 0.145 33);
  --coral-wash:    oklch(0.95 0.021 33);
  --ring:          var(--fern);
}

/* Re-derived for dark, not inverted: fern lightens to hold contrast,
   and the on-brand text colour flips to near-black. */
.dark {
  --ground:        oklch(0.20 0.008 158);
  --surface:       oklch(0.25 0.009 158);
  --surface-2:     oklch(0.29 0.009 158);
  --border:        oklch(0.33 0.010 158);
  --border-strong: oklch(0.40 0.011 158);
  --ink:           oklch(0.94 0.005 106);
  --muted:         oklch(0.71 0.014 152);
  --faint:         oklch(0.56 0.016 152);
  --fern:          oklch(0.77 0.115 159);
  --fern-hover:    oklch(0.83 0.105 159);
  --fern-on:       oklch(0.19 0.028 159);
  --fern-wash:     oklch(0.29 0.028 159);
  --coral:         oklch(0.73 0.115 33);
  --coral-wash:    oklch(0.28 0.032 33);
  --ring:          var(--fern);
}

/* `inline` is REQUIRED — plain @theme resolves var() at build time and
   bakes the light value into every utility class, so dark mode silently
   does nothing. This one keyword is the whole trick. */
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

  --radius-sm:   10px;
  --radius-md:   14px;
  --radius-lg:   22px;
  --radius-xl:   28px;
}
```

Components then write `bg-ground`, `text-muted`, `border-border`, `bg-fern text-fern-on`, `rounded-lg` — and dark mode works with **no `dark:` variants on colour at all**.

The oklch values above are converted from the prototype hexes in §3. Verify each against the prototype before trusting it — a conversion that drifts on the fern is immediately visible.

---

## 3. Tokens

**Extracted and validated in the design prototype (PORT-003 substantially complete).** Hex values below are the prototype's; convert to `oklch()` when implementing — Tailwind v4's native space gives perceptually even hover/active steps.

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
