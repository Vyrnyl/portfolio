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

Added in PORT-004: the **type scale** as `--text-*` tokens (each step carries its own line-height, weight and tracking, so `text-h-lg` is a whole heading style), the **section rhythm** as `--spacing-section` / `--spacing-section-tight`, and the **breakpoints** as an outright replacement of Tailwind's scale (open question 6, answered — see §4).

**Ported in PORT-021:** `--shadow-card` / `--shadow-card-lift`, the two shadow tokens §3 had recorded with no dark-theme values. Dark uses pure black at higher opacity rather than an inverted version of the light rgba — a warm near-black shadow reads as dirt on a dark surface. The exact numbers are a judgment call, not measured against the prototype (it isn't in the repo) — flagged for a real eyeball pass whenever it turns up. Card itself stays shadow-free at rest; only `ProjectCard`'s hover/focus state uses `shadow-card-lift`. Also added: `--aspect-thumbnail: 16 / 10`, matching the already-decided thumbnail ratio, so a `next/image fill` box crops instead of shifting when PORT-057 swaps in real captures.

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
| `--shadow-card` | Light `0 1px 2px rgba(28,36,32,.05), 0 8px 24px -12px rgba(28,36,32,.14)` · Dark `0 1px 2px rgba(0,0,0,.24), 0 8px 24px -12px rgba(0,0,0,.45)` |
| `--shadow-card-lift` | Light `0 2px 4px rgba(28,36,32,.06), 0 18px 40px -16px rgba(28,36,32,.20)` · Dark `0 2px 4px rgba(0,0,0,.32), 0 18px 40px -16px rgba(0,0,0,.55)` |

Elevation is **border-first**. `Card` carries no shadow at rest — only `ProjectCard`'s hover/focus state uses `shadow-card-lift` (PORT-021). Dark values are pure black at higher opacity rather than the light rgba inverted, per the design note below — they are a judgment call, unmeasured against the prototype, and worth a real eyeball pass once it's found. The primary button and the avatar are recorded here as designed shadow users but neither has shipped with one: `Button` (PORT-020) has no shadow class, and the avatar isn't built yet.

### Motion

| Property | Value |
|---|---|
| Standard | `transition: .18s` on color/border |
| Card hover | `--shadow-card-lift` (border-color to `fern` alongside it). The `translateY(-3px)` lift in the original spec was dropped in PORT-021 — no existing token represents 3px and Tailwind's spacing scale doesn't land on it, so adding one for a single micro-interaction not covered by any acceptance criterion was scope the ticket didn't need. Revisit if the prototype (once found) turns out to lean on it. |
| Status dot | 2.4s `ping` scale-and-fade |
| Hero underline | 0.9s `stroke-dashoffset` draw, 0.5s delay, once |
| Mobile sheet | 0.26s `cubic-bezier(.32,.72,0,1)` slide — `animate-sheet-in` |
| Mobile scrim | 0.26s `ease-out` opacity fade — `animate-scrim-in` |

The two sheet animations are **tokens**, not arbitrary values: `--animate-sheet-in` / `--animate-scrim-in` in the static `@theme` block, with their `@keyframes` **inside the same block**. Tailwind will happily emit an `--animate-*` variable whose keyframes were declared outside `@theme` and the animation silently does nothing — check the compiled CSS for both halves, not just the variable.

The sheet slides `translateY(-100%) → 0` and is clipped by an `overflow-hidden` wrapper starting at the header's bottom edge, so it reads as coming out from under the header rather than fading in place.

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
│   Section (rhythm + Container)         │
│   Section (rhythm + Container)         │
├────────────────────────────────────────┤
│ Footer — socials, copyright            │
└────────────────────────────────────────┘
```

Three layout components own all spacing. **Individual pages set no page-level padding or max-width** — if a page is writing `max-w-` or `px-`, that is a bug.

| Component | Responsibility |
|---|---|
| `Container` | `mx-auto w-full max-w-shell px-gut` — 1120px, 24px gutter (18px below `md`) |
| `Section` | Vertical rhythm `py-section`, wraps its children in a `Container`, optional heading slot |
| `Prose` | Long-form text width and child element styling (`/about`, project narrative) |

### Breakpoints

**The design's scale replaces Tailwind's defaults outright.** `globals.css` clears
the built-in scale with `--breakpoint-*: initial` and redefines three steps, so
`sm:` / `md:` / `lg:` mean the design's numbers everywhere. Keeping both scales
would leave `md:` at 768px sitting eight pixels from the real 760px gate — near
enough that the wrong one gets typed from habit and nobody sees it.

| Variant | Width | What changes |
|---|---|---|
| — | **1440** | Full layout, max container width reached |
| `lg:` | **1000** | **Nav collapses to the mobile menu**; project grid 3 → 2 columns |
| `md:` | **760** | Grids → 1 column; resume timeline stacks; page gutter 24px → 18px |
| `sm:` | **460** | Last step before the narrowest layout |
| — | **375** | Single column throughout; nothing overflows horizontally |

There is no `xl:` or `2xl:` — the design specifies nothing above 1000, so those
variants are cleared rather than left pointing at an undesigned width.

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
- **A portal breaks document order.** Anything rendered through `createPortal` appears in one place and lives somewhere else in the DOM, so tab sequence, focus wrapping and plain-DOM event bubbling no longer follow what the eye sees. Drive those explicitly rather than deferring to the browser — a focus trap that only intercepts the two ends of its cycle passes the checks people actually perform and leaks in between (found in PORT-007, both themes).

---

## 6. Component styling reference

Filled in as components are built. Keep in lockstep with [ui-registry.md](ui-registry.md) — this describes *how it looks*, the registry records *where it lives*.

| Component | Base classes | Notes |
|---|---|---|
| `Container` | `mx-auto w-full max-w-shell px-gut` | Built. The only owner of page width and gutter. |
| `Section` | `py-section`, or `py-section-tight` with `spacing="tight"` | Built. Wraps children in a `Container` unless `bleed`. Heading slot is `text-h-md text-ink mb-6`. |
| `Prose` | `max-w-measure text-base text-muted break-words` | Built. Styles its descendants; see the registry for the full descendant rule list. |
| `Header` | `bg-ground/80 border-border sticky top-0 z-40 border-b backdrop-blur-md` | Built. Inner `Container` is `flex h-16 items-center justify-between gap-4`. Nav is `hidden lg:block`. |
| `NavLinks` | `block rounded-full transition-colors` + per-orientation sizing | Built. `horizontal` (default) `px-3 py-1.5 text-sm`; `vertical` `px-4 py-3 text-base` for the sheet's tap targets. List is `flex items-center gap-1` / `flex flex-col items-stretch gap-1`. Active: `bg-fern-wash text-fern font-medium`. Idle: `text-muted hover:text-ink hover:bg-surface-2`. |
| `MobileMenu` | burger `inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border`; sheet `bg-surface border-border animate-sheet-in max-h-full overflow-y-auto overscroll-contain border-b`; scrim `bg-ground/60 animate-scrim-in flex-1 backdrop-blur-sm` | Built (PORT-007). Burger deliberately matches `ThemeToggle`'s shape so the pair reads as one control group. **This previously said PORT-020 would lift both into a shared icon button; it does not.** PORT-020's acceptance criteria fix the size scale at `sm|md` (36/40px, `rounded-md`), and an icon button is a different shape (`size-9 rounded-full`) carrying its own unanswered questions — the icon-only accessible name, and whether it takes the same variants. Deferred by decision 2026-08-22; the duplication stands until a ticket exists for it. Portal wrapper is `fixed inset-x-0 top-16 bottom-0 z-50 flex flex-col overflow-hidden`; `top-16` is coupled to the header's `h-16`. |
| `Footer` | `border-border mt-auto border-t` | Built. `mt-auto` requires `<body>` to be `flex min-h-full flex-col`. |
| `SkipLink` | `sr-only` → `focus:not-sr-only focus:fixed focus:bg-fern focus:text-fern-on focus:rounded-md` | Built. Targets `#main`. |
| `ThemeToggle` | `inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border` | Built. Renders an empty same-sized `div` until hydrated. |
| `Button` | base `inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap` · `rounded-md text-sm font-medium transition-colors` · `focus-visible:ring-ring focus-visible:ring-offset-ground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none` · `active:brightness-95` · `[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0` · `disabled:pointer-events-none disabled:opacity-50` — variants `primary` `bg-fern text-fern-on hover:bg-fern-hover` / `outline` `border-border text-ink hover:bg-surface-2 border` / `ghost` `text-muted hover:text-ink hover:bg-surface-2` — sizes `sm` `h-9 px-3` / `md` `h-10 px-4` | Built (PORT-020). Renders `next/link` when given `href`, `<button type="button">` otherwise — never a `div`. Icons go in `children`; the base sizes any `<svg>` descendant to 16px. **`cursor-pointer` is not optional** — Tailwind v4 defaults a button's cursor to `default`. The inlined copies in `not-found.tsx` and `error.tsx` are gone. |
| `Card` | `rounded-lg border border-border bg-surface`, `+p-6` when `padded` | Built (PORT-021). Elevation via border, not shadow — genuinely no shadow class, at rest or otherwise. Renders a `<div>`, never a link; a whole-card link is the caller's `Link` wrapping `Card`, not a prop on `Card` itself. |
| `Badge` | `inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-badge font-mono text-muted` | Planned. Stack/tag chips. `ProjectCard` inlines this exact class string today, marked `PORT-022 replaces this`. |
| `Input` / `Textarea` | `w-full rounded-md border border-border-strong bg-ground px-3 py-2 text-base placeholder:text-faint` + focus ring | Planned. `aria-invalid` → `border-coral`. |
| `Field` | `space-y-1.5` | Planned. Wraps label + control + error; owns the `id`/`htmlFor`/`aria-describedby` wiring. |
| `ProjectCard` | Outer `Link`: `group block rounded-lg` + the standard focus ring, `aria-label={project.title}`. Inner `Card`: `overflow-hidden p-0 transition-all duration-200 group-hover:border-fern group-hover:shadow-card-lift group-focus-visible:border-fern group-focus-visible:shadow-card-lift`. Thumbnail: `aspect-thumbnail relative w-full` wrapping a `next/image fill` with `object-cover`. | Built (PORT-021). The `aria-label` pins the link's accessible name to the title regardless of what the card visually contains — deliberate, not the browser default. `group-focus-visible:`, not just `group-hover:`, so keyboard focus gets the same border/shadow feedback a mouse does. |
| Route stub | `text-eyebrow text-faint font-mono uppercase` eyebrow + `text-h-lg text-ink` heading + `Prose` | Built (PORT-006). Six of them. The eyebrow names the ticket that replaces the page. Home uses `text-h-xl` — it is the only heading that is a hero. |
| *(add rows as built)* | | |

**The press state**, everywhere: `active:brightness-95`. The palette has no `-active` step for any colour, and adding one per variant would mean three new tokens for a state that lasts as long as a mouse-down. A filter is theme-agnostic — it darkens the light-mode fern and the dark-mode fern alike — and it is visibly distinct from `hover:`, which moves the *colour*. Settled in PORT-020; if the prototype turns out to specify real press colours, add the tokens to §3 first and replace this everywhere at once.

**A flex item's `display` is blockified.** A `Button` inside a `flex` wrapper computes to `display: flex`, not the `inline-flex` its class says — normal CSS, identical rendering, but it will fail a naive computed-style assertion. Found while verifying PORT-020.

**The focus ring**, everywhere: `focus-visible:ring-ring focus-visible:ring-offset-ground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none`. Note the offset is painted in `ground`, so a button sitting on a `surface` card will show a hairline of the wrong colour — **still unresolved.** PORT-021 did not trigger it: `ProjectCard`'s own focus ring sits on the outer whole-card `Link`, whose surrounding pixels are `ground` (correct), and there is no inner `Button` on the card for the mismatch to reach. First real trigger is whichever ticket puts a `Button` inside a `Card` — a `Cta` panel or `ContactMethods` card are the likely candidates. `SkipLink` uses the `focus:` variant instead, because it must appear for any focus, not only keyboard focus.

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
