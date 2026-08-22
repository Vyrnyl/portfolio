# UI Registry

> **Living document.** `designed` = proven in the design prototype, not yet built in React. `built` = shipped, and its classes below are the real ones.
> Read before building any component. Flip a row to `built` the moment it lands, in the same session.

Catalogs every component, where it lives, and the classes it uses. The styling contract and tokens live in [ui-rules.md](ui-rules.md).

---

## How to use

**Before building:**

1. Look for a component that already does this.
2. **Exists** → reuse it. Match its classes exactly. Do not create a near-duplicate under a new name.
3. **Close but not exact** → add a variant or a prop to the existing one. Prefer a variant over a new component.
4. **Nothing fits** → build it per [ui-rules.md](ui-rules.md) §5, then add a row here.

**After building:** add the row (real path, exact classes, `built`) and a change-log entry the same session. An unregistered component gets duplicated by the next one.

**Placement** ([architecture.md](architecture.md) §3–4):

| It is… | It goes in |
|---|---|
| Generic, knows nothing about projects/jobs/skills | `components/ui/` |
| Site chrome present on every page | `components/layout/` |
| Presents a domain concept | `components/sections/` |

`components/ui/` importing from `content/` is a lint error, not a style preference.

**Status:** `planned` (named only) · `designed` (exists and verified in the design prototype) · `built` (implemented in React, in the repo)

**The prototype is the visual contract.** Every `designed` row has working markup, both themes, and all its states already proven. When building, match it — do not redesign in React.

---

## 1. Foundations

| Item | Source |
|---|---|
| Color, type, spacing, radius, motion tokens | [ui-rules.md](ui-rules.md) §3 |
| `cn()` class merger | `src/lib/utils.ts` |
| Breakpoints (1000 / 760 / 460) | [ui-rules.md](ui-rules.md) §4 |
| Design prototype (the visual contract) | published Artifact — all 9 pages, both themes |

---

## 2. `components/ui/` — primitives

All `designed` — they exist and are proven in the design prototype, not yet built in React.

| Component | Status | File | Props / variants | Prototype class |
|---|---|---|---|---|
| `Button` | **built** | `src/components/ui/button.tsx` | `variant: primary|outline|ghost` (default `primary`), `size: sm|md` (default `md`), `className`; a discriminated union on `href` — with it, every `next/link` prop; without it, every `<button>` prop | base `inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap` · `rounded-md text-sm font-medium transition-colors` · `focus-visible:ring-ring focus-visible:ring-offset-ground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none` · `active:brightness-95` · `[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0` · `disabled:pointer-events-none disabled:opacity-50` — variants `primary` `bg-fern text-fern-on hover:bg-fern-hover` / `outline` `border-border text-ink hover:bg-surface-2 border` / `ghost` `text-muted hover:text-ink hover:bg-surface-2` — sizes `sm` `h-9 px-3` / `md` `h-10 px-4` |
| `Card` | designed | `ui/card.tsx` | `className`, optional `padded` | `.card`, `.card--pad` |
| `Badge` | designed | `ui/badge.tsx` | `tone: neutral|fern|coral` | `.badge`, `.badge--fern`, `.badge--coral` |
| `Chip` | designed | `ui/chip.tsx` | `pressed: boolean` — a real toggle button | `.chip[aria-pressed]` |
| `Input` | designed | `ui/input.tsx` | native props, `aria-invalid` | `.input` |
| `Textarea` | designed | `ui/textarea.tsx` | native props, vertical resize only | `.textarea` |
| `Field` | designed | `ui/field.tsx` | `label`, `error`, `hint`, `required` — render-prop wiring | `.field` |
| `Note` | designed | `ui/note.tsx` | `tone: neutral|ok|bad` — inline feedback banner | `.note`, `.note--ok`, `.note--bad` |
| `Prose` | **built** | `src/components/ui/prose.tsx` | `children`, `className` | `max-w-measure text-base text-muted break-words` + descendant rules: `[&>*+*]:mt-5` · `[&_h2]:text-h-md [&_h2]:text-ink [&_h2]:mt-12` · `[&_h3]:text-h-sm [&_h3]:text-ink [&_h3]:mt-8` · `[&>h2:first-child]:mt-0 [&>h3:first-child]:mt-0` · `[&_strong]:text-ink [&_strong]:font-semibold` · `[&_em]:italic` · `[&_a]:text-fern [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors [&_a:hover]:text-fern-hover` · `[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5` · `[&_li]:mt-2 [&_li]:marker:text-faint` · `[&_code]:bg-surface-2 [&_code]:text-ink [&_code]:rounded-sm [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm` · `[&_blockquote]:border-border-strong [&_blockquote]:border-l-2 [&_blockquote]:pl-4` · `[&_hr]:border-border [&_hr]:my-10` |

---

## 3. `components/layout/` — site chrome

| Component | Status | File | Client? | Prototype class |
|---|---|---|---|---|
| `Container` | **built** | `src/components/layout/container.tsx` | no | `mx-auto w-full max-w-shell px-gut` |
| `Section` | **built** | `src/components/layout/section.tsx` | no | `py-section` / `py-section-tight`; heading is `text-h-md text-ink mb-6`. Props: `heading?`, `id?`, `spacing?: "default" | "tight"`, `bleed?`, `className?`. Wraps children in `Container` unless `bleed`. |
| `SectionHead` | designed | `layout/section-head.tsx` | no | `.sec-head` + `.rule` — eyebrow, heading, gradient rule |
| `Header` | **built** | `src/components/layout/header.tsx` | no | `bg-ground/80 border-border sticky top-0 z-40 border-b backdrop-blur-md`; inner `Container` is `flex h-16 items-center justify-between gap-4`; wordmark `text-h-sm text-ink -mx-2 rounded-md px-2 py-1 transition-colors hover:text-fern` + focus ring. Nav wrapper `hidden lg:block`. Props: `className?`. Holds the hardcoded `NAV` array until PORT-011. |
| `NavLinks` | **built** | `src/components/layout/nav-links.tsx` | **yes** — `usePathname` | `ul` is `flex items-center gap-1` (horizontal) or `flex flex-col items-stretch gap-1` (vertical); link `block rounded-full transition-colors` + `px-3 py-1.5 text-sm` / `px-4 py-3 text-base` + focus ring; active `bg-fern-wash text-fern font-medium`, idle `text-muted hover:text-ink hover:bg-surface-2`. Props: `items: readonly NavItem[]`, `orientation?: "horizontal" \| "vertical"` (default horizontal), `onNavigate?: () => void`, `className?`. Exports the `NavItem` type. |
| `MobileMenu` | **built** | `src/components/layout/mobile-menu.tsx` | **yes** — focus trap, Escape, scroll lock | Burger: `inline-flex size-9 shrink-0 items-center justify-center rounded-full` + `border-border text-muted cursor-pointer border transition-colors hover:bg-surface-2 hover:text-ink` + focus ring. Portal wrapper: `fixed inset-x-0 top-16 bottom-0 z-50 flex flex-col overflow-hidden`. Sheet: `bg-surface border-border animate-sheet-in max-h-full overflow-y-auto overscroll-contain border-b`, inner `nav` is `px-gut py-4`. Scrim: `bg-ground/60 animate-scrim-in flex-1 backdrop-blur-sm`. Props: `items: readonly NavItem[]`, `className?` (lands on the burger). |
| `Footer` | **built** | `src/components/layout/footer.tsx` | no | `border-border mt-auto border-t`; inner `Container` is `flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between`; copyright `text-faint text-badge font-mono`; links `text-muted hover:text-fern inline-flex items-center gap-1 rounded-md text-sm transition-colors` + focus ring, each with an `ArrowUpRight` at 14. Props: `className?`. Needs `<body>` to be `flex min-h-full flex-col` for `mt-auto`. |
| `SkipLink` | **built** | `src/components/layout/skip-link.tsx` | no | `sr-only` + `focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50` + `focus:bg-fern focus:text-fern-on focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-medium` + `focus:ring-*`. Props: `className?`. Targets `#main`; must be the first child of `<body>`. |
| `ThemeToggle` | **built** | `src/components/layout/theme-toggle.tsx` | **yes** — `next-themes`, nothing rendered before hydration | `inline-flex size-9 shrink-0 items-center justify-center rounded-full` + `border-border text-muted cursor-pointer border transition-colors hover:bg-surface-2 hover:text-ink` + focus ring. Props: `className?`. Pre-hydration it renders the same-sized empty `div`, gated by `useSyncExternalStore`, **not** `useState`+`useEffect` — React Compiler lint rejects setState in an effect. |

---

## 4. `components/sections/` — domain composites

| Component | Status | File | Client? | Used on |
|---|---|---|---|---|
| `Hero` | designed | `sections/hero.tsx` | no | `/` |
| `StatusPill` | designed | `sections/status-pill.tsx` | no | `/` — `.status` + animated `.dot` |
| `StatRow` | designed | `sections/stat-row.tsx` | no | `/` — `.stat-row` |
| `ProjectCard` | designed | `sections/project-card.tsx` | no | `/`, `/projects` — `.pcard` |
| `ProjectGrid` | designed | `sections/project-grid.tsx` | no | `/`, `/projects` |
| `ProjectFilter` | designed | `sections/project-filter.tsx` | **yes** — URL `?tag=` | `/projects` |
| `SkillTier` | designed | `sections/skill-tier.tsx` | no | `/skills` — `.tier`, `.tier-dot` |
| `StackStrip` | designed | `sections/stack-strip.tsx` | no | `/`, `/skills` — `.stack-item` |
| `PracticeCard` | designed | `sections/practice-card.tsx` | no | `/skills` — icon + heading + body |
| `Timeline` | designed | `sections/timeline.tsx` | no | `/resume` — `.tl`, `.tl-item--now` |
| `ContactForm` | designed | `sections/contact-form.tsx` | **yes** — `useActionState` | `/contact` |
| `ContactMethods` | designed | `sections/contact-methods.tsx` | no | `/contact` |
| `Cta` | designed | `sections/cta.tsx` | no | `/`, `/skills`, `/about` — `.cta-panel` |
| `CaseStudy` | designed | `sections/case-study.tsx` | no | `/projects/[slug]` — eyebrow-led prose blocks |

---

## 5. States

Every one of these must exist somewhere visible before the site ships. Tracked here because they are the things most often skipped and then discovered in production.

| State | Where it appears | Status |
|---|---|---|
| Empty — filter matches no projects | `/projects` | designed |
| Empty — a project has no `liveUrl`/`repoUrl` | `/projects/[slug]` | planned |
| Pending — contact form submitting | `/contact` | designed |
| Success — message sent | `/contact` | designed |
| Error — field validation | `/contact` | designed |
| Error — email provider failed, with `mailto:` fallback | `/contact` | designed |
| 404 — unknown route | `src/app/not-found.tsx` | **built** (PORT-006) |
| 404 — unknown project slug | `projects/[slug]/not-found.tsx` | planned |
| 500 — render error | `src/app/error.tsx` | **built** (PORT-006) |

---

## Change log

| Date | Component(s) | Change |
|---|---|---|
| 2026-08-22 | `Button` | Built (PORT-020), first primitive of Sprint 2, and the three inlined copies of its classes in `not-found.tsx` (one) and `error.tsx` (two) were swept in the same ticket. **Polymorphism is a discriminated union on `href`, not `asChild`**: `href?: undefined` on the button branch versus `href: string` on the link branch, which narrows cleanly and forwards every native prop of whichever element it becomes — no Slot, no `cloneElement`, no extra dependency. **TypeScript's excess-property check on a union does not do what you would hope**: it accepts a prop present on *any* member, so `<Button href="/" disabled>` compiled and would have shipped a link that looks dead and still navigates. Blocked with `type?: never; disabled?: never` on the link branch, proven with `@ts-expect-error` probes. The mirror case is deliberately left open — `<Button prefetch={false}>` with no `href` still compiles and React warns at runtime — because closing it means listing every `next/link` prop as `never` and re-listing it whenever Next adds one. **`type="button"` is defaulted before the prop spread**, so a caller can override it with `type="submit"` (PORT-041 will) while a bare `<Button>` inside a `<form>` never submits it by accident. **Icons are children, not props** — `gap-2` plus `[&_svg]:size-4` in the base handles leading and trailing alignment with no extra API; measured at exactly 16×16 and vertically centred. `cursor-pointer` is in the base because **Tailwind v4 changed the default button cursor to `default`** — without it every `<button>` loses its pointer. Three values were settled here that no doc specified: `ghost` is `text-muted` at rest (matching `NavLinks` idle, keeping three genuinely distinct tiers, and measuring 5.35:1 light / 6.97:1 dark), the press state is a uniform `active:brightness-95` (there is no `-active` colour token and inventing three was worse than one filter), and `sm` is 36px to match the height `ThemeToggle` and the burger already use. |
| 2026-08-22 | `Header`, `Footer` | Rewired to `src/content/site.ts` (PORT-011). No class changed — this is a data-source swap. `Header` lost its `NAV` array and the name from its markup; `Footer` lost `SOCIALS` and gained LinkedIn. Both import `@/content/site` **directly** rather than through `lib/`, because `site` is a config singleton with nothing to query (rationale in progress.md decisions, carve-out written into content-model §4). **`Footer` now splits accessible name from visible text**: `site.socials[].label` goes on `aria-label` ("GitHub profile") while the visible word comes from a `PLATFORM_TEXT: Record<SocialLink["platform"], string>` map in the component — so adding a platform to the union in `types.ts` fails the build here instead of rendering `undefined`. That split carries a rule: **WCAG 2.5.3 Label in Name** — the accessible name must contain the visible text, or voice control stops matching "click GitHub". Presentation words stay in the component, not in content. `NavLinks` and `MobileMenu` were not touched; taking links as a prop is what made the swap free. |
| 2026-08-21 | `MobileMenu`, `NavLinks` | `MobileMenu` built (PORT-007) — **Sprint 0 complete.** Sheet and scrim are **portaled to `<body>`**, not rendered in the header: the header carries `backdrop-blur-md`, and an element with a backdrop-filter becomes the containing block for its `position: fixed` descendants, so a `fixed inset-0` scrim inside it sizes to the 64px header box. That portal then broke the focus trap — the sheet sits after the footer in the DOM while appearing under the burger, so a trap that only intercepted the two ends of its cycle let forward-Tab walk the burger into the footer. Every Tab is now `preventDefault`ed and stepped by modulo. **No `role="dialog"`/`aria-modal`**: it would hide the burger — the labelled close control — from assistive tech; the ticket specifies a disclosure, so it is one. Background content is therefore still reachable by a virtual cursor; `inert` on `main`/`footer` is the fix, raised for PORT-052. Sheet is **not** `lg:hidden` — CSS-hiding an open sheet leaves an invisible element holding the scroll lock; `matchMedia` closing it is the single mechanism. `NavLinks` gained `orientation` and `onNavigate` rather than a second link list being written; `onNavigate` is a click callback, not a pathname effect, because tapping the current page's link never changes the pathname. |
| 2026-08-21 | `not-found`, `error` (route-level pages) | Built (PORT-006), together with six route stubs. Neither is a registry component — they are pages — but both own UI, so their states are now `built` above. **Both inline the designed `Button` classes** rather than importing one: `Button` is PORT-020 and building it early would be building ahead. Each inlined spot carries a `PORT-020 replaces this` comment; that ticket must sweep them. `error.tsx` is a Client Component (Next requires it — `reset` is a callback) and therefore **cannot export `metadata`**; `not-found.tsx` can and does. `error.digest` is rendered only when present, because it exists in production builds and not in dev. Route stubs carry a mono eyebrow naming the ticket that fills them, so an unfinished page is obvious on sight. |
| 2026-08-20 | `Header`, `NavLinks`, `Footer`, `SkipLink`, `ThemeToggle` | Built (PORT-005). Nav array and footer socials are hardcoded in `Header`/`Footer` until PORT-011. **Nav collapses at `lg:` (1000), not `md:` (760)** — seven items measure ~720px against a 760px header, inside the margin of error, and ui-rules §4 reserves an unbuilt header CTA slot; §4 corrected. `ThemeToggle` uses `useSyncExternalStore` for the hydration gate because Next 16 lint rejects the `useState`+`useEffect` pattern the impl-guide prescribes. Footer socials are text links, not brand icons — `lucide-react` v1 removed `Github`/`Linkedin` entirely. `MobileMenu` stays `designed` (PORT-007). |
| 2026-08-19 | `Container`, `Section`, `Prose` | Built (PORT-004). Prototype classes replaced with the real token utilities. **`Section` now wraps its children in a `Container`** — the impl-guide page example (`<Section heading="Selected work">` with no wrapper) already assumed this; ui-rules §4's diagram did not, and was corrected. `SectionHead` stays `designed` — Section's plain heading slot covers the common case, and the eyebrow + gradient rule treatment lands when a page needs it. |
| 2026-08-18 | All | Populated from the approved design prototype. Every row `designed` — proven visually, not yet built in React. |
| 2026-08-17 | — | Registry rewritten for the Next.js portfolio scope. |
