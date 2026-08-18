# UI Registry

> **Living document. Every component is `designed` — proven in the design prototype, none built in React yet.**
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
| `Button` | designed | `ui/button.tsx` | `variant: primary|outline|ghost`, `size: sm|md`, renders `<a>` when given `href` | `.btn` + `.btn--*` |
| `Card` | designed | `ui/card.tsx` | `className`, optional `padded` | `.card`, `.card--pad` |
| `Badge` | designed | `ui/badge.tsx` | `tone: neutral|fern|coral` | `.badge`, `.badge--fern`, `.badge--coral` |
| `Chip` | designed | `ui/chip.tsx` | `pressed: boolean` — a real toggle button | `.chip[aria-pressed]` |
| `Input` | designed | `ui/input.tsx` | native props, `aria-invalid` | `.input` |
| `Textarea` | designed | `ui/textarea.tsx` | native props, vertical resize only | `.textarea` |
| `Field` | designed | `ui/field.tsx` | `label`, `error`, `hint`, `required` — render-prop wiring | `.field` |
| `Note` | designed | `ui/note.tsx` | `tone: neutral|ok|bad` — inline feedback banner | `.note`, `.note--ok`, `.note--bad` |
| `Prose` | designed | `ui/prose.tsx` | `children` | `.narrow`, `.measure` |

---

## 3. `components/layout/` — site chrome

| Component | Status | File | Client? | Prototype class |
|---|---|---|---|---|
| `Container` | designed | `layout/container.tsx` | no | `.container` |
| `Section` | designed | `layout/section.tsx` | no | `.section`, `.section--tight` |
| `SectionHead` | designed | `layout/section-head.tsx` | no | `.sec-head` + `.rule` — eyebrow, heading, gradient rule |
| `Header` | designed | `layout/header.tsx` | no | `.site-head` — sticky, backdrop blur |
| `NavLinks` | designed | `layout/nav-links.tsx` | **yes** — `usePathname` | `.nav a[aria-current]` |
| `MobileMenu` | designed | `layout/mobile-menu.tsx` | **yes** — focus trap, Escape, scroll lock | `.burger`, `.scrim`, `.msheet` |
| `Footer` | designed | `layout/footer.tsx` | no | `.site-foot`, `.foot-links` |
| `SkipLink` | designed | `layout/skip-link.tsx` | no | `.skip` |
| `ThemeToggle` | designed | `layout/theme-toggle.tsx` | **yes** — `next-themes`, no icon before mount | `.icon-btn` |

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
| `UsesList` | designed | `sections/uses-list.tsx` | no | `/uses` — `.uses-row` |
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
| 404 — unknown route | `not-found.tsx` | planned |
| 404 — unknown project slug | `projects/[slug]/not-found.tsx` | planned |
| 500 — render error | `error.tsx` | planned |

---

## Change log

| Date | Component(s) | Change |
|---|---|---|
| 2026-08-18 | All | Populated from the approved design prototype. Every row `designed` — proven visually, not yet built in React. |
| 2026-08-17 | — | Registry rewritten for the Next.js portfolio scope. |
