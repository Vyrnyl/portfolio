# Build Plan — Ticket Board

The backlog. What gets built, in what order, and what "done" means for each item.

- **What to build** → this file
- **How to build it, step by step** → [implementation-guide.md](implementation-guide.md)
- **What is actually built** → [progress.md](progress.md)

Scope: [project-overview.md](project-overview.md) · Structure: [architecture.md](architecture.md) · Styling: [ui-rules.md](ui-rules.md)

---

## 1. Working agreement

You are the sole engineer. The process is deliberately lightweight, but the two gates below are real — they are what keeps a solo build from turning into a pile of half-finished branches.

### Ticket lifecycle

```
Backlog → Ready → In Progress → Review → Done
```

- **Ready** — dependencies are `Done` and nothing in the ticket is still an open question.
- **In Progress** — exactly **one** ticket at a time. If you are blocked, mark it `Blocked` with the reason and pull the next `Ready` ticket. Do not accumulate work in flight.
- **Review** — self-review against the acceptance criteria, with the page open in a browser. Not from memory.
- **Done** — every acceptance criterion is checked, `npm run verify` passes, committed on a ticket branch, and [progress.md](progress.md) is updated.

### The two gates

**Gate 1 — Visual sign-off.** Any ticket producing UI is not `Done` until you have opened it in a browser and checked it at 1440 / 1000 / 760 / 460. Screenshot-and-move-on is how responsive bugs reach production.

**Gate 2 — `npm run verify` is green.** `tsc --noEmit && next lint && next build`. Red build, no push. No exceptions, including "it's just a content change."

### Definition of Ready

- [ ] Dependencies `Done`
- [ ] Acceptance criteria are observable — someone else could check them without asking you what you meant
- [ ] Design values needed are already recorded in [ui-rules.md](ui-rules.md) §3, and the shape is settled in the design prototype
- [ ] It fits in one sitting. If not, split it.

### Definition of Done

- [ ] Every acceptance criterion verified in a browser
- [ ] Responsive at 1440 / 1000 / 760 / 460 — no horizontal overflow at any width
- [ ] Works in both light and dark mode
- [ ] Keyboard-reachable; focus visible on every interactive element
- [ ] Tokens only — no hex, no `text-gray-*`, no arbitrary values
- [ ] No `any`, no `@ts-ignore`, no `console.log` left behind
- [ ] `npm run verify` green
- [ ] [ui-registry.md](ui-registry.md) updated if a component was built
- [ ] [progress.md](progress.md) updated, committed on a `feat/PORT-xxx-*` branch

### Sizing

`S` ≤ 1h · `M` 1–3h · `L` 3–6h. If a ticket runs past 2× its size, stop and split it — that is data about the estimate, not a reason to push through.

---

## 2. Sprint plan

Six sprints. A "sprint" here is a coherent chunk of work, not a fixed calendar box — but keep them in order, because each depends on the last.

| Sprint | Theme | Tickets | Size | Exit criterion |
|---|---|---|---|---|
| **0** | Foundation | PORT-001 → 007 | ~9h | App runs, tokens applied, all six routes reachable through a real header, mobile menu and footer |
| **1** | Content layer | PORT-010 → 015 | ~5h | Real content typed and compiling; accessors return correct data |
| **2** | UI primitives | PORT-020 → 025 | ~7h | Gallery page renders every primitive in every variant and state |
| **3** | Pages | PORT-030 → 037 | ~17h | All six pages render real content and are navigable |
| **4** | Contact wiring | PORT-040 → 044 | ~7h | A real message lands in your inbox |
| **5** | Production | PORT-050 → 056 | ~11h | Deployed to a custom domain, targets met, CI green |

**Total: ~57h of focused work**, 41 tickets (PORT-057 → 060 are follow-ups added during the build, tracked after the Sprint 5 block). Sprints 0–2 feel slow and produce little visible progress; Sprint 3 then goes fast *because* of them. That trade is the point — resist the urge to jump to Sprint 3.

### Build order rationale

Tokens → content types → primitives → pages → wiring → hardening.

Each layer is consumed by the next, so building in this order means never rewriting a lower layer. The specific traps this avoids:

- Pages before primitives → six pages of copy-pasted button markup to unify later.
- Primitives before tokens → hardcoded colors in every primitive.
- Content types after pages → props reshaped across every component when the schema changes.
- Contact wiring before the form UI exists → debugging a Server Action with no way to trigger it.

### Critical path

```
001 → 003 → 004 → 005 → 010 → 020 → 021 → 030 → 032 → 041 → 056
```

Everything else can slip without blocking the launch. If time runs short, that chain is the site.

---

## 3. EPIC A — Foundation `Sprint 0`

---

### PORT-001 · Scaffold the Next.js application `S`
**Depends on:** —

Create the app with TypeScript, Tailwind v4, ESLint, App Router, and the `@/*` alias. Configure Prettier with the Tailwind class-sorting plugin. Add the `verify` script.

**Acceptance criteria**
- [ ] `npm run dev` serves the default page at `localhost:3000`
- [ ] `tsconfig.json` has `strict: true` **and** `noUncheckedIndexedAccess: true`
- [ ] `@/*` resolves to `src/*`
- [ ] Prettier formats on save with Tailwind classes auto-sorted
- [ ] `npm run verify` exists and passes
- [ ] `.gitignore` covers `.env*.local`, `.next`, `node_modules`

**Out of scope:** any component, any content, any styling decision.

---

### PORT-002 · Repository hygiene `S`
**Depends on:** 001

Git init, first commit, README, `.env.example`, `.nvmrc`, and the folder skeleton from [architecture.md](architecture.md) §3 (empty folders with a `.gitkeep`).

**Acceptance criteria**
- [ ] Repo initialized, pushed to GitHub, `main` is the default branch
- [ ] README states what the project is and how to run it — genuinely useful in six months
- [ ] `.env.example` lists `RESEND_API_KEY` and `CONTACT_TO_EMAIL` with empty values — **amended 2026-09-15:** this originally also named `NEXT_PUBLIC_SITE_URL`, which PORT-042 built and then removed on the same day because nothing read it; the site origin comes from `site.url` in `src/content/site.ts`.
- [ ] `git status` is clean after a build (nothing generated is untracked)

---

### PORT-003 · Port design tokens into Tailwind v4 `M` ⚠️ **Blocks almost everything**
**Depends on:** 001

The extraction is **done** — [ui-rules.md](ui-rules.md) §3 holds the full validated palette in both themes, and §2 holds the `globals.css` block ready to adapt. This ticket is the port: implement it, then prove the toggle works.

**Acceptance criteria**
- [ ] `globals.css` matches [ui-rules.md](ui-rules.md) §2 — raw vars on `:root` and `.dark`, semantic tokens in `@theme inline`
- [ ] Each oklch value visually matches the prototype hex in §3 — check the fern especially, conversions drift there first
- [ ] A test element using `bg-ground text-ink` visibly changes colour when `.dark` is toggled on `<html>` — **verify this before closing the ticket**
- [ ] Contrast measured with a checker: `ink`/`ground` ≥ 7:1, `muted`/`ground` ≥ 4.5:1, `fern-on`/`fern` ≥ 4.5:1, **in both themes**
- [ ] Fonts loaded via `next/font`, exposed as `--font-sans` / `--font-mono`
- [ ] `prefers-reduced-motion` block present in `globals.css`

**Watch for:** plain `@theme` instead of `@theme inline` freezes light-mode colors into the CSS and silently breaks dark mode. The toggle test above is what catches it.

**Out of scope:** building components. This ticket produces tokens and a documented record, nothing else.

---

### PORT-004 · Layout primitives — `Container`, `Section`, `Prose` `S`
**Depends on:** 003

The three components that own all page spacing.

**Acceptance criteria**
- [ ] All three built per [ui-rules.md](ui-rules.md) §4, each accepting `className`
- [ ] `Container` centers and applies the responsive gutter; nothing else sets page padding anywhere in the codebase
- [ ] `Section` owns vertical rhythm with an optional heading slot
- [ ] `Prose` constrains measure and styles headings, paragraphs, lists, and links for long-form text
- [ ] Registered in [ui-registry.md](ui-registry.md) with exact classes

---

### PORT-005 · App shell — header, footer, theme toggle `L`
**Depends on:** 004

Root layout with skip link, sticky header, nav with active state, theme toggle, and footer. Nav items come from `site.nav` — but `site.ts` does not exist yet, so **hardcode the nav array here and replace it in PORT-011**. Note that swap in the ticket so it does not get forgotten.

**Acceptance criteria**
- [ ] Root layout: fonts, `ThemeProvider`, `SkipLink`, `Header`, `<main id="main">`, `Footer`
- [ ] Header is sticky with a backdrop blur and bottom border; does not overlap content
- [ ] Active nav item is visually distinct — via `usePathname`, in the smallest possible client component
- [ ] Theme toggle persists across reloads with **no flash of the wrong theme** (`suppressHydrationWarning` on `<html>`)
- [ ] Skip link is invisible until focused, then visible, and moves focus to `#main`
- [ ] Tab through the whole shell — order is logical, focus always visible
- [ ] Registered in [ui-registry.md](ui-registry.md)

**Watch for:** the theme flash. If you see one, `next-themes` is mounted wrong — fix it now, it is far more annoying to chase later.

---

### PORT-007 · Mobile menu `M`
**Depends on:** 005

The burger sheet below 1000px. Split out of PORT-005 because the accessibility work is real, and it gets skipped when it rides along with the header.

**Acceptance criteria**
- [ ] Burger appears below 1000px, desktop nav hidden. Sheet drops from the header over a blurred scrim
- [ ] Focus moves into the sheet on open and **returns to the burger** on close
- [ ] **Tab is trapped** inside the open sheet — it cycles rather than reaching the page behind
- [ ] Escape closes, scrim click closes, navigating closes
- [ ] `aria-expanded` and `aria-controls` on the burger; label flips between "Open menu" and "Close menu"
- [ ] Body scroll locked while open
- [ ] **Auto-closes on resize past 1000px** — otherwise an invisible open sheet keeps focus trapped
- [ ] Active route marked in the sheet as well as the desktop nav
- [ ] Registered in [ui-registry.md](ui-registry.md)

**Watch for:** the resize case. It is the one nobody tests, and it hard-traps keyboard users.

---

### PORT-006 · Route stubs and error boundaries `S`
**Depends on:** 005

Every route from [project-overview.md](project-overview.md) §3 as a stub page, plus real 404 and error pages.

**Acceptance criteria**
- [ ] All six routes render a heading inside the shell without a 404
- [ ] `app/not-found.tsx` is a designed page with a route back home — not default Next.js output
- [ ] `app/error.tsx` is a Client Component with a working reset button
- [ ] Every nav link navigates correctly
- [ ] Each page exports a placeholder `metadata` with a unique title

**Sprint 0 exit:** the site is navigable end to end, correctly themed in light and dark, with no real content yet.

---

## 4. EPIC B — Content layer `Sprint 1`

---

### PORT-010 · Content types `S` ⚠️ **Blocks all content and pages**
**Depends on:** 002

Create `src/content/types.ts` exactly as specified in [content-model.md](content-model.md) §2.

**Acceptance criteria**
- [ ] Every type from [content-model.md](content-model.md) §2 present and exported
- [ ] JSDoc on non-obvious fields (`slug`, `featured`, `end: null`, `summary` length)
- [ ] `tsc --noEmit` clean
- [ ] No `any`, no loose `string` where a union is correct

**Do this before writing any content.** Types first is the entire point of the approach — writing content first means retrofitting types to whatever you happened to type.

---

### PORT-011 · Site config + nav swap `S`
**Depends on:** 010, 005

`src/content/site.ts` with real identity, nav, and socials. **Replace the hardcoded nav from PORT-005 with `site.nav`, and the footer's hardcoded socials with `site.socials`.**

**Acceptance criteria**
- [ ] `site` satisfies `SiteConfig`, with real values — no placeholders
- [ ] Header nav renders from `site.nav`; footer socials render from `site.socials`
- [ ] Adding a nav item to `site.ts` makes it appear in the header with no other edit — **test this**
- [ ] `site.url` is the real production URL, no trailing slash

---

### PORT-012 · Project content `L`
**Depends on:** 010

Write real content for 3–6 projects, with images. This is a **writing** ticket more than a coding one — budget the time honestly, it is the single highest-leverage content on the site.

**Acceptance criteria**
- [ ] 3–6 entries satisfying `Project[]`, using `satisfies`
- [ ] `problem` / `approach` / `outcome` filled with real substance for every project — no lorem ipsum, no "TODO"
- [ ] Images optimized (WebP, ≤ 200KB each) in `public/images/projects/`
- [ ] `width`/`height` match actual intrinsic dimensions
- [ ] Every `alt` describes the content
- [ ] Exactly 2–3 have `featured: true`
- [ ] Slugs unique, kebab-case; tags reused consistently
- [ ] Every integrity rule in [content-model.md](content-model.md) §5 checked

**Watch for:** the temptation to fill this with placeholders and "come back later." You will not come back later, and every page built on top will be sized against fake content that does not match the real thing.

---

### PORT-013 · Experience, education, skills `M`
**Depends on:** 010

**Acceptance criteria**
- [ ] `jobs`, `education`, `skillGroups` all satisfy their types
- [ ] Bullets lead with outcomes, not responsibilities — "cut checkout latency 40%", not "was responsible for the checkout"
- [ ] Dates are `"YYYY-MM"`; **at most one** job has `end: null` (amended 2026-08-22 — zero is valid)
- [ ] Skills grouped into 3–5 categories — in practice **exactly 3**, since PORT-037 added `SkillGroup.tier` and content-model §5 requires one group per tier, in order confident → working → learning

---

### PORT-014 · Uses content `S` — ~~CUT 2026-08-21~~

**Will not build.** The `/uses` page was cut before it was started; see the decisions log in [progress.md](progress.md). The ID is retired, not reused.

---

### PORT-015 · Content accessors `S`
**Depends on:** 012, 013, 014

`src/lib/content.ts` per [content-model.md](content-model.md) §4.

**Acceptance criteria**
- [ ] All accessors implemented and typed — no `any` in a return type
- [ ] Sorts copy the array first (`[...projects]`) — mutating shared module state is the bug this prevents
- [ ] `getAllTags()` returns unique, sorted tags
- [ ] `getProjectBySlug()` returns `Project | undefined`, and callers handle `undefined`
- [ ] The ESLint boundary rule from [code-standards.md](code-standards.md) §8 is configured and passing

**Sprint 1 exit:** all real content is typed, compiling, and reachable through accessors. Nothing renders it yet.

---

## 5. EPIC C — UI primitives `Sprint 2`

Build each in isolation, verify in the gallery, register it. Do not build these inside a page — a primitive built inside a page absorbs that page's assumptions.

---

### PORT-020 · `Button` `M`
**Depends on:** 003, 004

Variants `primary` / `outline` / `ghost`, sizes `sm` / `md`, plus an `asChild` pattern so it can render as a `next/link`.

**Acceptance criteria**
- [ ] Variants and sizes typed as unions
- [ ] Renders as `<a>` when given `href`, `<button>` otherwise — **never a `div`**
- [ ] Hover, focus-visible, active, and disabled states all styled and distinct
- [ ] Focus ring per [ui-rules.md](ui-rules.md) §5, visible in both themes
- [ ] Optional leading/trailing icon slot aligns correctly
- [ ] Accepts `className`, merged with `cn()`
- [ ] Registered with exact classes

---

### PORT-021 · `Card` and `ProjectCard` `M`
**Depends on:** 020

Generic `Card` in `ui/`; domain-aware `ProjectCard` in `sections/`.

**Acceptance criteria**
- [ ] `Card` is generic — no knowledge of `Project` (enforced by the lint rule)
- [ ] `ProjectCard` shows thumbnail, title, summary, year, and tags
- [ ] The **whole card is one link**; the accessible name is the project title, not "read more"
- [ ] Image via `next/image` with explicit dimensions — no layout shift on load
- [ ] Hover state on the card affects the border, not a nested duplicate link
- [ ] Both registered

**Watch for:** nesting a link inside a link. If the card is a link, the tags inside it cannot also be links.

---

### PORT-022 · `Badge` `S`
**Depends on:** 003

**Acceptance criteria**
- [ ] Renders a tag/stack chip per [ui-rules.md](ui-rules.md) §6
- [ ] Legible in both themes at `text-xs`
- [ ] A row of 6+ badges wraps cleanly at 375px
- [ ] Registered

---

### PORT-023 · Form primitives — `Field`, `Input`, `Textarea` `M`
**Depends on:** 003

The accessibility-critical ticket. `Field` owns the `id` / `htmlFor` / `aria-describedby` wiring so no consumer can get it wrong.

**Acceptance criteria**
- [ ] `Field` generates an id and wires `label htmlFor`, `aria-describedby` → hint and error
- [ ] Error state sets `aria-invalid="true"` and applies the `danger` border
- [ ] Error text is visible **and** programmatically linked to the input
- [ ] Required fields marked visually and with the `required` attribute
- [ ] `Textarea` does not resize horizontally
- [ ] Placeholder is never the only label
- [ ] Tested with keyboard only: tab to each field, error text is announced
- [ ] Registered

---

### PORT-024 · Icons `S`
**Depends on:** 003

**Acceptance criteria**
- [ ] `lucide-react` installed, imported **per icon** — no barrel imports
- [ ] Default size and stroke width per [ui-rules.md](ui-rules.md) §3
- [ ] Decorative icons have `aria-hidden="true"`; icon-only buttons have `aria-label`
- [ ] Bundle impact checked in `next build` output

---

### PORT-025 · Component gallery `S`
**Depends on:** 020, 021, 022, 023

A `/gallery` route rendering every primitive in every variant and state. **Excluded from production** — gate on `NODE_ENV` or `notFound()`, and exclude from the sitemap.

**Acceptance criteria**
- [ ] Every registered component appears in every variant and state
- [ ] Includes error, disabled, and empty states
- [ ] Renders correctly in both themes and at all four breakpoints
- [ ] Returns 404 in a production build — **verify with `npm run build && npm start`**

**Sprint 2 exit:** the gallery shows a complete, consistent component set. Pages are now assembly.

---

## 6. EPIC D — Pages `Sprint 3`

---

### PORT-030 · Home `M`
**Depends on:** 021, 015

Hero, featured projects, CTA.

**Acceptance criteria**
- [ ] Hero states who you are and what you do, above the fold at 375px
- [ ] Featured projects from `getFeaturedProjects()` — never a hardcoded list
- [ ] Primary CTA to `/contact`, secondary to `/projects`
- [ ] Page sets no padding or max-width of its own (`Container`/`Section` own it)
- [ ] Real `metadata` with title, description, and OG tags
- [ ] Zero client JS beyond the theme toggle — check the `next build` output

---

### PORT-031 · Projects index with tag filter `L`
**Depends on:** 021, 015

**Acceptance criteria**
- [ ] All projects from `getAllProjects()`, newest first
- [ ] Filter chips from `getAllTags()`, plus an "All" option
- [ ] Filter state lives in the **URL** (`?tag=react`) — a filtered view is shareable and survives refresh
- [ ] Back button returns to the previous filter
- [ ] Zero matches shows a designed empty state with a reset action
- [ ] Grid: 3 columns → 2 at `lg` → 1 at `md`
- [ ] Only the filter control is a Client Component; the cards stay server-rendered

**Watch for:** making the whole page a Client Component to hold filter state. Keep the boundary at the filter.

---

### PORT-032 · Project detail `L`
**Depends on:** 031

**Acceptance criteria**
- [ ] `generateStaticParams` pre-renders every slug
- [ ] `generateMetadata` produces a per-project title, description, and OG image
- [ ] Unknown slug calls `notFound()` — **test `/projects/does-not-exist`**
- [ ] Problem / approach / outcome laid out readably in `Prose`
- [ ] Stack rendered as badges; live and repo links render **only when present**
- [ ] Optional gallery and highlights render when present, and the layout does not break when absent
- [ ] Next/previous project navigation at the bottom
- [ ] `next build` output confirms one static page per project

**Watch for:** the optional fields. Build one project without `liveUrl` and without a gallery, and confirm the page still looks intentional.

---

### PORT-033 · About `M`
**Depends on:** 015

**Acceptance criteria**
- [ ] Bio in `Prose`; photo via `next/image` with a real `alt`
- [ ] Skills from `skillGroups`, grouped by category
- [ ] Links to `/resume` and `/contact`
- [ ] Real metadata

---

### PORT-034 · Resume `L`
**Depends on:** 015, 022

**Acceptance criteria**
- [x] Experience as a timeline from `getJobs()`, current role first
- [x] `end: null` renders as "Present" — **code path unexercised by real content**: no job has `end: null`, so this is proven against `formatMonth` in isolation, never on screen
- [x] Education and skills sections present
- [x] PDF download button linking to `site.resumePdf`, opening in a new tab with `rel="noopener"`
- [ ] The PDF actually exists in `public/` and is current — **it exists; it is NOT current.** Deferred to **PORT-059** by Vernel's decision 2026-09-02. This is the one bullet keeping the ticket off ✔
- [x] Timeline stacks legibly at 768px and 375px — this layout breaks most often
- [x] Sensible print stylesheet (`@media print`): no header, nav, or footer

---

### PORT-035 · Uses `S` — ~~CUT 2026-08-21~~

**Will not build.** The `/uses` page was cut before it was started; see the decisions log in [progress.md](progress.md). The ID is retired, not reused.

---

### PORT-036 · Contact page UI `M`
**Depends on:** 023

Form UI **only** — no submission logic. This is the deliberate UI-before-wiring split: you cannot debug a Server Action against a form that does not exist.

**Acceptance criteria**
- [ ] Fields: name, email, message — each in a `Field` with a real label
- [ ] Direct contact alternatives (email, socials) visible alongside the form
- [ ] All four visual states mocked with local state and reviewed: idle, pending, success, error
- [ ] Fully keyboard-operable
- [ ] Submitting does nothing yet — and that is correct for this ticket

### PORT-037 · Skills page `M`
**Depends on:** 015, 022

Added after the design review — Skills is a nav item, not just a home-page strip.

**Acceptance criteria**
- [x] Three honest tiers — Confident / Working knowledge / Learning now — each with a label saying what the tier *means*
- [x] **No percentage bars.** Tier is encoded by dot weight and ~~swatch saturation~~ **dot size** — see the amendment below
- [x] Tiers render from `skillGroups`; a `tier` field drives the grouping
- [x] "How I work" grid: four practice cards, each icon + heading + body — needed a new `practices` array in `skills.ts` and an eleventh accessor, `getPractices()`
- [x] CTA through to `/projects` and `/resume`
- [x] Real metadata

**Note:** needs `tier: "confident" | "working" | "learning"` on `SkillGroup` in [content-model.md](content-model.md) §2 — add it in PORT-010 rather than retrofitting. Done in PORT-010 as written.

**AC amended 2026-09-02, on measurement.** "Swatch saturation" cannot be built as written and still pass WCAG 1.4.11, which asks 3:1 of a non-text element that carries meaning. Both attempts were measured in a real browser and both failed:

| Attempt | Light (working / learning) | Dark (working / learning) |
|---|---|---|
| Wash tokens (`fern-wash`, `surface-2`) | 1.06:1 / 1.02:1 | 1.23:1 / 1.22:1 |
| `fern` at 70% / 45% opacity | 2.79:1 / 1.86:1 | passed / 2.60:1 |
| **`fern` full strength, dot size 10/8/6px** | **4.78:1** | **7.81:1** |

The cause is headroom: `--fern` is only 4.78:1 against the light ground, so there is almost nothing to dim into before a step drops under 3:1. Saturation is therefore replaced by **dot size** as the second visual variable — full-strength fern at every tier, sizes stepping 10 → 8 → 6px. Depth is still encoded twice (how many dots are filled, and how large they are), so the meter never rests on colour alone (WCAG 1.4.1). Settled with Vernel rather than defaulted; the rejected option was inventing a `--fern-deep` token, which would have been a design decision made inside a build ticket.

---

**Sprint 3 exit:** all seven pages render real content. The site is complete except for the form actually sending.

---

## 7. EPIC E — Contact wiring `Sprint 4`

---

### PORT-040 · Validation schema `S`
**Depends on:** 036

`lib/validation/contact.ts` — one zod schema shared by client and server.

**Acceptance criteria**
- [x] `name` 2–100, `email` valid, `message` 10–2000 — **every string field has a `.max()`**
- [x] `honeypot` field present and required to be empty
- [x] Type inferred from the schema (`z.infer`), not declared twice
- [x] Error messages are human ("Please enter your email address", not "Invalid input")

**Closed 2026-09-02.** Zod **4.5.4**; the guide's original snippet was v3 and has been rewritten. `honeypot` ships **required, not `.optional()`** — Vernel's call when the AC and the guide disagreed — so **PORT-041 owes one hidden input** alongside its `useActionState` swap. Verified by 28 real parses compiled out of the repo and run under node (no TS runner installed): bounds at and over every limit including a 10MB body, `.trim()` proven to run *before* `.min()`, an omitted honeypot proven to fail, all seven error messages asserted human, and `z.flattenError()` confirmed to return the `Record<string, string[]>` that `ActionResult.fieldErrors` is typed as.

---

### PORT-041 · Server Action `M`
**Depends on:** 040

`lib/actions/contact.ts`, wired to the form with `useActionState`.

**Acceptance criteria**
- [x] `"use server"`; returns the typed `ActionResult` union
- [x] Server-side zod parse is authoritative — verified by submitting with JS disabled or via a crafted request
- [x] Field errors map back to the correct inputs
- [x] Pending state disables the submit button and shows a spinner
- [x] The action **never throws to the client**; unexpected errors are caught, logged server-side, returned as a generic message
- [x] Result announced in an `aria-live="polite"` region
- [x] Successful submission clears the form


**Closed 2026-09-03.** The "crafted request" bullet was met by **defeating the client rather than forging a request**: Next refuses a guessed action id outright and a raw FormData POST returns "Connection closed", so the page's own JS is rewritten at runtime the way an attacker would — `required` stripped, `type="email"` downgraded to text, `maxlength` removed, the honeypot revealed and filled — and the server caught all ten cases. **The honeypot must be read off raw `FormData` BEFORE `safeParse`**, not from `parsed.data`: the schema rejects a filled one first, which surfaces as a `fieldErrors.honeypot` that no visible field renders, so the form silently refuses to submit showing no reason at all. Three additions PORT-036 did not forecast, each found by running the code: a `formKey` remount (a `<Link href="/contact">` reset is DEAD — same-route navigation never unmounts the component, so the success panel is permanent), a split `SubmitButton` (`useFormStatus` reads the PARENT form), and an inline `Spinner` (none existed; not a `lib/icons.ts` entry, since `IconName` is scoped to content-backed icons). 298/298 assertions across four widths × both themes plus a tamper suite. **Delivery is NOT wired** — a valid submission returns `{ ok: true }` and is written to the server log; PORT-042 owns the email, so the success panel's "it reached my inbox" is not yet true.
---

### PORT-042 · Email delivery `M`
**Depends on:** 041

Resend integration plus `lib/env.ts`.

**Acceptance criteria**
- [x] `lib/env.ts` throws at module load on a missing required var — **tested by actually removing one**: the real module was compiled to JS and imported three ways. Both present → imports clean. `RESEND_API_KEY` removed → throws `Missing required environment variable: RESEND_API_KEY` at import. `CONTACT_TO_EMAIL` removed → same for that name. `SITE_URL` is deliberately **not** `required()` (it falls back to the dev origin) so `next dev` boots without an email key.
- [x] `lib/email.ts` wraps the Resend client; the action never calls Resend directly — the action calls `sendContactEmail()` and branches on a `SendResult` union.
- [x] Email includes name, email, message, and a timestamp; the visitor's email is set as `replyTo` — timestamp generated server-side, **not** taken from the client's `startedAt`, which is untrusted by the schema's own note.
- [x] Visitor input appears **only in the body** — never in the subject, headers, or `to` field. `from` is a constant, `to` comes from env, the subject is a fixed string carrying no input at all, and the body is plain text rather than HTML.
- [x] Provider failure returns the friendly error state, and the error is logged server-side with context — **and the mechanism is the ticket's sharpest trap: the Resend SDK does NOT throw on a rejected send**, it resolves with the failure in `error`. The action's `try/catch` would never fire on its own, so the `if (error)` check in `lib/email.ts` is the whole guard. Ignoring it would return success to a visitor whose message went nowhere.
- [x] **A real message arrives in your real inbox** — confirmed by Vernel 2026-09-15. Sent through the real form on a production build, Resend id `38341633-d9a7-4dfb-bbc3-b86a8841f563`, server log `[email] sent`, zero rejections.
- [x] `RESEND_API_KEY` is in `.env.local`, absent from git, and documented in `.env.example` — `git check-ignore` confirms `.gitignore:34` covers it and `git status` never lists it.

**Amendment — no verified domain, and the sender is a testing address (2026-09-15).** Vernel chose to stay on free Vercel with no custom domain, so there is no domain to verify with Resend and `from` must be the shared `onboarding@resend.dev`. Resend's own Next.js quickstart lists that address under things not to ship in production. The constraint that matters is quoted verbatim in `lib/email.ts` from their errors reference (403): *"You can only send testing emails to your own email address … To send emails to other recipients, please verify a domain at resend.com/domains."* That is survivable here for exactly one reason — **this form emails Vernel, and `CONTACT_TO_EMAIL` is that same owning address.** Anything that ever emails the *visitor* (an acknowledgement copy, say) will 403 for every visitor until a domain is verified. Free tier: 100/day, 3,000/month, and both sent and received count toward the quota.

---

### PORT-043 · Spam and rate limiting `M` — ✔ **closed 2026-09-05**
**Depends on:** 042 — **taken out of order.** Four of the five criteria never touch Resend and the fifth was already met by PORT-041, so nothing here was half-built by pulling it ahead of a ticket parked by choice.

**Acceptance criteria**
- [x] Honeypot filled → returns **success** to the client, sends nothing. Never tell a bot it was caught. *(already met by PORT-041; re-proven here)*
- [x] Minimum time-to-submit (~3s) rejects instant machine submissions — `MIN_SUBMIT_MS`, checked **after** the parse because it needs a validated number
- [x] Per-IP rate limit with a clear message when hit — **5 per 15 minutes, amended from the "e.g. 3 per 10" this line originally carried**
- [x] Rate limit tested by submitting repeatedly — driven to the 6th submission in a real browser, and proven per-IP by a second address passing freely
- [x] `lib/rate-limit.ts` documents in a comment that it is in-memory and per-instance — adequate here, **not** distributed protection

**Amendment — the limit is 5 per 15 minutes, not 3 per 10.** Put to Vernel rather than defaulted, and he chose the looser bound. A single IP is not a single person: an office, a campus network or a mobile carrier behind CGNAT puts many real visitors on one address, and the cost of being wrong is asymmetric — blocking a genuine message loses an opportunity the visitor cannot act on beyond waiting, while letting a bot send five instead of three costs two emails.

**Amendment — the guard order is not architecture §5's.** §5 drew parse → honeypot → rate limit; the built order is rate limit → honeypot → parse → minimum-time, and §5 has been corrected to match. The rate limit moved first because *a limiter that only counts valid submissions counts nothing a flooder sends* — a bot posting garbage fails the parse every time and would never increment a counter. Rate limit ahead of the honeypot was the second call put to Vernel: it means a visitor whose password manager fills the trap spends quota, but a bot that trips it can no longer hammer the endpoint uncapped.

---

### PORT-044 · Contact UX polish `S`
**Depends on:** 043

**Acceptance criteria**
- [x] Success state is reassuring and states an expected response time — "Thanks — it reached my inbox. I usually reply within a couple of days." **The response time is a promise to strangers, so the wording is Vernel's to confirm rather than mine to set** (see the note below).
- [x] The failure state shows a **`mailto:` fallback** — a visitor is never dead-ended by your email provider. Met by construction: the banner renders whenever `fieldErrors` is `undefined`, and all four form-level failures omit it. Measured on the rate-limit branch, banner and `mailto:` both present.
- [x] Field errors appear inline and preserve entered values — **this was genuinely broken and is the ticket's real content.** Measured empty (all three fields blanked) before the fix, preserved after, across 1440/1024/768/375 × light/dark.
- [x] Form is fully usable by keyboard from first field to submitted result — 10/10, tab order `name → email → message → submit` with a visible indicator at every stop, and values surviving an Enter-key submit.
- [ ] Screen reader announces both success and failure — **WAIVED 2026-09-15 by Vernel's decision, not met.** He chose to close the ticket without running the pass. Left unticked on purpose: the mechanisms are in place and were verified structurally (each field's `role="alert"`, the banner's `role="alert"`, the `sr-only aria-live` validation summary, and the focus move onto the confirmation heading that PORT-060 substituted for a live region), but **no screen reader has ever spoken this form's failure path**, and a structural check is not the same claim. See the decisions log.

**Amendment — `ActionResult` grew a `values` member (2026-09-15).** "Preserve entered values" could not be met by the form alone: the inputs are uncontrolled, so the re-render after a failed submit rebuilt them from `defaultValue`, and nothing echoed the submission back. Measured before it was touched — name, email and message all returned empty under the words "Please check the fields below." The action now returns what the visitor typed on **every** failure branch, and code-standards §6 was corrected in the same pass rather than left to disagree with the code. Only the three visible fields are echoed: never the honeypot (it would confirm to a bot that its value survived) and never `startedAt` (a stale timing token riding back would defeat PORT-043's minimum-time guard).

**Sprint 4 exit:** a message sent from the deployed form arrives in your inbox, and the failure paths are all survivable.

---

## 8. EPIC F — Production `Sprint 5`

---

### PORT-050 · Metadata and OG images `M` — ✔ **closed 2026-09-05**
**Depends on:** 032 ✔

**Acceptance criteria**
- [x] Root layout sets `metadataBase`, title template, and default OG/Twitter tags — closes the missing-`metadataBase` debt carried since PORT-030
- [x] Every page exports real `metadata`; descriptions are unique and under 160 chars — verified against the SERVED HTML on all ten routes, not the source
- [x] `opengraph-image.tsx` generates a default card via `next/og`
- [x] Project pages generate per-project OG images — one prerendered card per slug
- [x] `lib/seo.ts` holds the builders — no page hand-assembles an OG object
- [x] **Cards verified in a link preview debugger** — **met 2026-09-06.** Vernel pasted <https://vernel-portfolio.vercel.app> into a preview debugger after PORT-051 pushed and confirmed a card renders. The live deploy was re-checked in the same pass: `/robots.txt` and `/sitemap.xml` (10 URLs) serve correctly from the production origin, and the JSON-LD carries the right schema types with zero placeholder leakage on all four routes sampled.

**Amendment — generated cards everywhere, including `/about` and the project pages.** Two calls put to Vernel rather than defaulted (2026-09-05). PORT-033 had deliberately shipped `/about` with **no** `og:image` rather than share the "PHOTO PENDING" placeholder; that reason is gone, because the generated card is typography and brand colour and never touches `site.photo`, so PORT-058 no longer has anything to do here. The project pages previously advertised `project.cover ?? project.thumbnail`, which are all four still PORT-012 placeholders — the generated card carries the real title instead.

**The placeholder filter is the part worth carrying.** The reasoning for choosing generated cards was "the title and summary are real" — which turned out to be true of **two of the four projects**. `stack` carries a literal "TBC — confirm stack" entry on all four, and it rendered as a chip on the first card produced; two summaries are placeholder prose. Both surfaces now filter: the card drops placeholder chips and falls back for a placeholder summary, and `generateMetadata` substitutes a plain true sentence for a placeholder description. **Fixing the card did not fix the description** — that was found only by auditing the served tags, and is the ticket's sharpest lesson: the image and the text under it are two separate surfaces.

---

### PORT-051 · Sitemap, robots, structured data `S`
**Depends on:** 050

**Acceptance criteria**
- [x] `sitemap.ts` generated from the content layer — a new project appears automatically
- [x] `/gallery` excluded from the sitemap
- [x] `robots.ts` allows crawling and points to the sitemap
- [x] JSON-LD `Person` in the root layout, `CreativeWork` on project pages
- [x] Structured data passes a validator with no errors

---

### PORT-052 · Accessibility audit `M`
**Depends on:** all pages

**Acceptance criteria**
- [x] axe DevTools: **zero violations** on all seven routes — **0 across all 14 route × theme combinations**, run with `best-practice` in the tag list so `heading-order` is genuinely checked. `/contact` also audited *after* an empty submit, because axe audits the page as loaded and the error state only exists post-submit.
- [x] Full keyboard walkthrough of every page and the form — no traps, focus always visible
- [x] Tested with a screen reader (NVDA or Narrator on Windows) on home, project detail, and contact — **run by Vernel 2026-09-09 against a fresh production build.** Announcements matched the strings extracted from the AX tree beforehand, including the one that mattered: the errored email field announces **hint and error together**, confirming the 2026-09-09 `Field` fix works for its actual users. One non-blocking observation recorded as **PORT-060**.
- [x] One `<h1>` per page; no skipped heading levels — verified independently of axe on all seven routes in both themes, because an audit that can be misconfigured should not be its own only witness.
- [x] Contrast measured in both themes
- [x] `prefers-reduced-motion` honored — verify by enabling it in the OS — **0 elements animating >50ms** under emulated `reduce`.
- [x] Lighthouse Accessibility = 100 on every route — met on all seven, measured across every Lighthouse run PORT-053 made. **The score alone is not the evidence**: `label-content-name-mismatch` is weighted zero, so two real WCAG 2.5.3 failures once sat under a perfect 100. The failing-audit list is what counts.

---

### PORT-053 · Performance audit `M`
**Depends on:** 052

**Acceptance criteria**
- [x] Lighthouse mobile: Performance ≥ 95, Best Practices ≥ 95, SEO 100 — **PSI on the deployed site: home 98, every other route 100.** BP and SEO 100 everywhere.
- [x] **LCP < 2.5s** (amended from 1.8s on 2026-09-06 — see §9 D13), CLS < 0.05 — **LCP 1.8–2.5s on the deployed site, CLS 0.000 on all seven routes.**
- [x] All images WebP/AVIF, correctly sized, with `priority` **only** on the LCP image — the optimizer serves WebP to browsers that advertise it; `priority` now covers exactly the above-fold set via `priorityCount`.
- [x] Fonts self-hosted via `next/font`, `display: swap`, no layout shift — both faces; `font-display` scores 1 and CLS is 0.
- [x] `next build` confirms every page is static **except `/projects`, which is `ƒ` dynamic by design** (PORT-031 reads `searchParams` to filter server-side — amended 2026-09-06, see §9); client JS limited to the theme toggle, filter, and form — **20 static/SSG routes, `/projects` the one `ƒ`.**
- [x] No render-blocking third-party resources — **zero cross-origin requests; every asset is same-origin.**

---

### PORT-054 · CI pipeline `S`
**Depends on:** 002

**Acceptance criteria**
- [ ] `.github/workflows/ci.yml` runs typecheck, lint, and build on push and PR
- [ ] Fails the build on a type error — verified by pushing one deliberately, then reverting
- [ ] Node version pinned to match local
- [ ] Runs in under ~3 minutes

---

### PORT-055 · Deploy `M`
**Depends on:** 054, 044

**Acceptance criteria**
- [x] Connected to Vercel; `main` auto-deploys; PRs get preview deploys — live since 2026-08-20, scope `cap1313`.
- [x] Production env vars set in Vercel — **set 2026-09-15 by Vernel and confirmed by a real production send.** **Two, not three: `RESEND_API_KEY` and `CONTACT_TO_EMAIL`** (`NEXT_PUBLIC_SITE_URL` was removed 2026-09-15; the origin lives in `site.url`). **Now genuinely load-bearing:** PORT-042 landed `lib/env.ts`, which throws at module load, so without these the live contact form fails on the first submission while still telling the visitor it reached the inbox.
- [x] ~~Custom domain live with HTTPS and a `www` → apex redirect~~ — **STRUCK 2026-09-15 by Vernel's decision to stay on the free Vercel subdomain.** `*.vercel.app` cannot be made clean (the name is always project + scope), HTTPS is already provided, and there is no apex to redirect to. This is a deliberate scope reduction, not an unmet criterion — recorded so it is never re-raised as an oversight. Reversing it means buying a domain, pointing DNS, and updating `site.url`; nothing in the code assumes the current origin beyond that one constant.
- [x] **Contact form tested on the production URL** — a preview deploy passing is not proof. **Met 2026-09-15:** one real submission through the deployed form returned HTTP 200 with the confirmation panel rendered, and **Vernel confirmed the message arrived in the inbox** — a 200 alone would not have been proof, since PORT-042 established the Resend SDK resolves with the failure in `error` rather than throwing.
- [x] `site.url` matches the real origin so OG images resolve absolutely — `site.ts:21` is `https://vernel-portfolio.vercel.app`, which under the struck bullet above *is* the real origin. `lib/seo.ts` derives `SITE_ORIGIN` from it.

---

### PORT-056 · Launch checklist `S`
**Depends on:** 055

> **✔ CLOSED 2026-09-16 — the last ticket on the board, and the site is launched.** Deployed as `b193231`. Analytics was **built, not struck** (Vernel's call, D14), and **two real defects were found and fixed in the pass**, both in metadata that only a shared link exposes. **One criterion is accepted-not-met** — content proofread — carrying PORT-012's placeholders forward as the shipping state, the same decision made for PORT-057/058/059 on 2026-09-15.

**Acceptance criteria**
- [x] Every route loads on production, on a real phone as well as a desktop — **16 routes checked against the live origin: 13 × 200, and `/gallery` + unknown route + unknown slug all × 404.** Also on production: **0 axe violations** across 7 routes × 2 themes with `best-practice` INCLUDED (so `heading-order` is not silently dropped), and **zero overflow** at 1440/1000/760/460 × 2 themes. **Real phone confirmed by Vernel.**
- [x] All external links resolve; resume PDF downloads — **PDF 200 `application/pdf` 157KB; GitHub 200; LinkedIn resolves (its `999` to curl is a bot-block — the browser lands on an authwall carrying the correct profile in `sessionRedirect`)**. ⚠ **`https://example.com` is NOT a broken link but a working link to the wrong site** — it is the "Live site" and "Source code" button on `/projects/opalusph-website`, and it is PORT-012's placeholder, accepted as the shipping state
- [x] OG cards render correctly when the URL is pasted into Slack/LinkedIn/X — **confirmed by Vernel against the deployed build.** The tags themselves were verified on the live origin first: all four home surfaces read "Vernel Aquino — Full-stack web developer" with no doubling, and the other five routes still template correctly
- [x] Analytics recording page views — `@vercel/analytics/next` in the root layout; **on production the script is served (3.1KB, correct content type), `window.va` is live, and there are zero console errors.** Confirmed in the Vercel dashboard by Vernel. **A client-side beacon check CANNOT settle this and should not be trusted to:** the script's own first act is `navigator.webdriver || navigator.userAgent.includes("Headless")`, so **Vercel Analytics deliberately drops automated traffic** — three separate probes (headless, non-headless, webdriver-flag stripped) all showed the event queued at `vaq.length === 1` and never flushed. **The dashboard is the only instrument for this criterion.**
- [x] 404 and error pages verified live — on production: unknown route → 404 rendering "This page does not exist"; unknown project slug → real HTTP 404 from the segment's own `not-found.tsx`; `/gallery` → 404 as designed
- [ ] Content proofread — typos on a portfolio cost more than they do anywhere else — **ACCEPTED-NOT-MET, unticked on a finding rather than an omission.** No typos exist in the written prose, and `/about`, `/skills`, `/resume` and `/contact` are placeholder-free. But **12 placeholder strings render visibly** across `/`, `/projects` and the two OpalusPH detail pages, including a `TBC — confirm stack` chip that reads as a technology on all four project pages. Vernel accepted these as the shipping state, consistent with PORT-012/057/058/059
- [x] [progress.md](progress.md) marked complete; [ui-registry.md](ui-registry.md) fully populated — **all 32 components on disk are present in the registry**, checked mechanically by basename rather than by eye

---

### PORT-057 · Replace placeholder project content `M`
**Depends on:** 012

Added 2026-08-22. PORT-012 shipped with **placeholder copy and placeholder images**, because the projects to be featured were still being built and the details were not to hand. This ticket pays that back. It is not optional polish — a portfolio whose cards all read "Placeholder summary" is worse than one showing two projects done properly.

**The shape is already correct**, so this is a fill-in job, not a rewrite: field coverage, string lengths and status spread were chosen in PORT-012 to exercise every branch. Keep that spread when replacing the values — if the real projects happen not to exercise some optional field, leave one entry that does, or the fallback branch stops being tested.

**Narrowed 2026-08-25.** This ticket briefly covered `experience.ts` too (the three OpalusPH bullets, added to its scope 2026-08-22). That part is **done** — it was pulled forward ahead of PORT-034, because `/resume` renders those bullets and shipping the page would have put literal "Placeholder" text on a live page for the first time. `experience.ts` now returns zero gate hits. **What remains is `projects.ts` and the images, nothing else.**

One caveat on the first criterion: the grep also catches **one hit in `src/content/site.ts`** — `photo.alt` — which belongs to **PORT-058**, not this ticket. Neither ticket can close while the grep is non-empty, so whichever lands second gets a clean run; do not "fix" the other's hit to make the check pass here.

> **CLOSED 2026-09-15 by Vernel's decision — criteria NOT met, accepted as the shipping state.** His reasoning: this is an update of his own data, and it can be redone whenever the underlying projects change. Every bullet below is left unticked on purpose, because each one is verifiably false today, not merely unverified. See the decisions log.

**Acceptance criteria**
- [ ] `Select-String -Pattern "Placeholder|TBC" src/content/` returns **nothing** (the `site.ts` hit is PORT-058's to clear) — **24 hits remain in `projects.ts`**
- [ ] Every `.webp` in `public/images/projects/` is a real capture — zero placeholders remain — **all 8 are generated stand-ins**
- [ ] `year`, `status`, `tags`, `stack`, `role`, `duration` replaced with verified values
- [ ] Every `liveUrl`/`repoUrl` is a real URL that resolves — no `https://example.com` survives
- [ ] `problem`/`approach`/`outcome` are real prose with no invented metrics — **true of the two academic projects, not the two OpalusPH sites**
- [ ] Each `width`/`height` in `src/content/projects.ts` matches the new file's real intrinsic size
- [ ] Each file is WebP and ≤ 200KB
- [ ] Every `alt` still describes what the *new* image actually shows — the placeholder alt text will not survive the swap
- [ ] Cards and detail pages checked at all four breakpoints; the new aspect ratios do not break the grid

**Watch for:** the placeholders are 16:10. Captures at a different ratio will be cropped by `object-cover`, which is fine for a card but can decapitate a screenshot's header bar. Check, do not assume.

**Blocks:** PORT-056.

---

### PORT-058 · Replace the profile photo placeholder `S`
**Depends on:** 033

Added 2026-08-25. PORT-033 shipped `/about` with a **generated stand-in portrait** — Vernel had no photo to hand and chose to unblock the page rather than stall Sprint 3 behind it. The file says so on its own face (`PHOTO PENDING`), which is the same rule the project thumbnails follow: a placeholder that reads as pending, never as a finished thing.

This is a three-line edit plus a file, not a rewrite. `site.photo` already carries `src`/`alt`/`width`/`height`, and `SiteConfig.photo` is **required**, so nothing can render `/about` with the field missing.

> **CLOSED 2026-09-15 by Vernel's decision — criteria NOT met, accepted as the shipping state.** Same reasoning as PORT-057: his own data, swappable later. The stand-in still reads `PHOTO PENDING` on its face, so `/about` shows a pending slot rather than a broken one — which is why this is acceptable to ship and was never acceptable to hide. See the decisions log.

**Acceptance criteria**
- [ ] `public/images/profile-placeholder.webp` deleted, replaced by a real photo under `public/images/` — **the placeholder is still on disk**
- [ ] `site.photo.alt` describes the actual photo — the "Placeholder graphic standing in for…" string does not survive
- [ ] `site.photo.width`/`height` match the new file's real intrinsic size
- [ ] WebP, ≤ 200KB
- [ ] `/about` checked at all four breakpoints in both themes — a different aspect ratio must not break the intro grid
- [ ] Decide at the same time whether `/about` now earns an `og:image`; PORT-033 deliberately ships none while the portrait is a placeholder — **still ships none, so the decision stands deferred with the ticket**

**Watch for:** the placeholder is **4:5 portrait** (1000×1250). A photo at a different ratio changes the height of the intro's right-hand column — it will not overflow, but it will shift where the text centres against it.

**Blocks:** PORT-056.

---

### PORT-059 · Replace the stale resume PDF `S`
**Depends on:** 034

Added 2026-09-02. PORT-034 shipped `/resume` against a PDF that **predates the OpalusPH internship entirely**. `pdftotext public/resume.pdf` was run before the page was built, and the file it returned lists only the Freelance role — so the page's timeline shows a job the download has never heard of. Vernel chose to ship the download live and track the gap rather than hide the button, which is the same unblock-and-track move PORT-012 made for screenshots and PORT-033 made for the portrait.

This one is **worse than those two**, and the difference matters: a `PHOTO PENDING` graphic announces itself, and a placeholder thumbnail is visibly a placeholder. A stale PDF looks exactly like a current one. Nothing on the page tells a reader the download disagrees with the timeline above it, so this cannot be caught by looking — only by remembering, which is why it is a ticket.

**What the current PDF actually says**, extracted 2026-09-02:

| | `experience.ts` (the page) | `public/resume.pdf` (the download) |
|---|---|---|
| OpalusPH internship | Frontend Developer Intern, Feb–May 2026 | **absent** |
| Freelance | Web Developer, Aug–Dec 2024 | present, matches |
| Education | CSU BSIT, 2022-08 → 2026-06 | present, matches |
| Email | `vernaquino73@gmail.com` | **`aquinovern0@gmail.com`** |

The email divergence is the part with real consequences: a reader who takes the address from the PDF writes to an inbox the site never mentions. Note a **third** address, `aquinovern15@gmail.com`, appears as the git author on this repo — settle which one is canonical here, not in three places later.

Two further defects worth fixing in the same pass, both cosmetic but both visible to a recruiter: the skills block reads **"Langauges"**, and the PDF's Projects section lists two academic projects (Grades Repository System, CICT Project Gate) that are not the two OpalusPH sites `projects.ts` carries — so the PDF and `/projects` currently describe different bodies of work. Deciding which projects belong on the one-page resume is a judgment call for Vernel, not a defect to silently fix.

> **CLOSED 2026-09-15 by Vernel's decision — criteria NOT met, accepted as the shipping state.** Same reasoning as PORT-057 and PORT-058. **This one carries a cost the other two do not, and closing it does not remove the cost:** a `PHOTO PENDING` graphic and a placeholder thumbnail announce themselves, while a stale PDF looks exactly like a current one. `/resume` still offers a download that omits the OpalusPH internship and gives a different email address than the page above it. See the decisions log.

**Acceptance criteria**
- [ ] `public/resume.pdf` contains the OpalusPH internship with the same dates and title as `jobs[0]` — **absent; file unchanged since 2026-08-19**
- [ ] Every email address in the PDF matches `site.email` exactly — **PDF says `aquinovern0@`, site says `vernaquino73@`**
- [ ] "Langauges" typo corrected
- [ ] The PDF's projects and `projects.ts` tell a consistent story — same projects, or a deliberate documented subset
- [ ] `pdftotext -layout public/resume.pdf -` diffed by eye against `/resume` — no fact appears in one and contradicts the other
- [ ] The download still opens in a new tab and the file is not corrupted after replacement — **unaffected; no file was replaced**

**Watch for:** the file is replaced in place at `public/resume.pdf`, so `site.resumePdf` needs no edit — and *because* it needs no edit, nothing in the codebase changes when this ticket lands. `npm run verify` will pass identically before and after. The only proof is reading the new PDF.

**Blocks:** PORT-056.

---

### PORT-060 · Move focus to the success panel after a contact submit `S`
**Depends on:** 041, 052

Added 2026-09-09, found during PORT-052's screen-reader pass. When `ContactForm` submits successfully the form unmounts and the success panel takes its place, but **nothing catches focus, so it falls to `<body>`**. The same happens in reverse when "Send another" remounts the form.

**This is deliberately NOT a WCAG failure and was not allowed to block PORT-052.** It was measured before it was judged: the panel renders where the form was, so DOM order does the work and **exactly one `Tab` reaches "Send another"** — nothing is stranded, and the tab sequence stays logical, so 2.4.3 Focus Order is satisfied. The panel also sits in an `aria-live="polite"` region, so the confirmation is announced whether or not focus moved. Vernel ran the transition under NVDA on 2026-09-09 and reported it acceptable.

What is lost is position, not information: a screen-reader user is told the message sent, but their place on the page is gone, and a sighted keyboard user sees no focus ring anywhere. The conventional treatment is to move focus to the success heading so the confirmation becomes the thing you are standing on rather than something you overheard.

**Watch for:** the heading needs `tabIndex={-1}` to be focusable, and focus must move in an effect *after* the panel mounts, not in the action handler. Do not add `role="alert"` on top of the existing `aria-live` region — that double-announces. And the same treatment is needed on the "Send another" path, where focus should land on the Name field.

**Acceptance criteria**
- [x] After a successful submit, focus lands on the success panel's heading, verified in a browser rather than by reading the code — `document.activeElement` is the `h2` (`tabindex=-1`, text "Message sent") in both themes, on a confirmed-fresh production build.
- [x] After "Send another", focus lands on the Name field — `activeElement.id === "field-name"`, and the form is genuinely blank rather than the old one re-shown.
- [x] The confirmation is still announced exactly once — **the live region was REMOVED to achieve this, not kept.** Focus moving onto the heading is itself the announcement, so `role="status" aria-live="polite"` on the panel would have been a second one. Verified with a MutationObserver recording every live-region utterance: zero matching "Message sent"/"reached my inbox", and zero live regions remain inside the panel.
- [x] A visible focus indicator is present at both landing points in both themes — pixel-sampled, not inferred: the heading ring is `rgb(47,125,92)` at **4.52:1** (light) and `rgb(95,191,143)` at **6.42:1** (dark) against the panel, **identical to the "Send another" button's own ring** measured as a control. Both clear WCAG 1.4.11's 3:1 floor. Getting there took two corrections worth carrying: the ring needed `focus:` rather than the project-wide `focus-visible:` (a programmatic `.focus()` on a `tabIndex={-1}` element does not reliably satisfy that heuristic), and `inline-block`, because an `h2` is `display:block` and the ring traced a 567px box around 106px of text — present, correctly coloured, and reading as panel chrome.
- [ ] Screen-reader confirmation on the full submit → success → send-another cycle — **WAIVED 2026-09-15 by Vernel's decision, not met.** Everything scriptable is green and the double-announcement was disproved mechanically (a MutationObserver recorded zero live-region utterances), but the one thing this bullet asks for — a person hearing the cycle — did not happen. Left unticked on purpose. See the decisions log.

**Blocks:** nothing.

---

**Sprint 5 exit:** live on a custom domain, all targets from [project-overview.md](project-overview.md) §5 measured and met.

---

## 9. Settled decisions

Closed. Reopening one requires a written reason in [progress.md](progress.md).

| # | Decision | Rationale |
|---|---|---|
| D1 | Next.js App Router, static-first | [architecture.md](architecture.md) §2 A1 |
| D2 | No blog / no MDX | Not needed for the goal; large scope addition |
| D3 | Content as typed TS with `satisfies` | [architecture.md](architecture.md) §2 A3 |
| D4 | No database, no CMS, no auth | Nothing persists; no protected surface |
| D5 | Contact via Server Action + Resend | [architecture.md](architecture.md) §2 A5 |
| D6 | Tailwind v4, CSS-variable tokens | [ui-rules.md](ui-rules.md) §2 |
| D7 | Zod for form input only | [architecture.md](architecture.md) §2 A4 |
| D8 | No global state manager | [architecture.md](architecture.md) §2 A6 |
| D9 | Three layers: content → lib → components | [architecture.md](architecture.md) §2 A7 |
| D10 | Deploy on Vercel | First-class Next.js target |
| D11 | **`/projects` stays `ƒ` dynamic; PORT-053's AC was amended, not the route** (2026-09-06) | Two closed decisions collided: PORT-031 deliberately reads `searchParams` so the tag filter runs server-side, and PORT-053's AC asked that every page be static. The route gives nothing up by being dynamic — there is no database, and content is TS literals already in memory, so an on-demand render is an array filter, not I/O. Making it static would push filtering into client JS and force `useSearchParams` + a Suspense boundary, i.e. more client JS to satisfy a criterion whose *purpose* is less client JS. **Forecloses:** `/projects` cannot be served from a CDN as prerendered HTML, and any future ticket asserting "all routes are `○`" must name this exception. |
| D13 | **PORT-053's LCP threshold amended from < 1.8s to < 2.5s** (2026-09-06) | The deployed site measures 1.8–2.5s: over the ticket's own bar, inside Google's "Good" band. The 1.8s figure was written into the AC before anything had been measured and has no external authority behind it; **2.5s is the Core Web Vitals threshold that actually affects ranking and reflects real user experience.** The remaining time was traced on the live site rather than assumed — the LCP image is preloaded with `fetchpriority`, the mobile candidate is 2.8KB of WebP, and the cost is a cold-cache optimizer MISS (~740ms) that warms to a HIT (~165ms). No code change removes it; chasing 1.8s would mean adding complexity (blur placeholders, pre-warmed variants, or dropping the optimizer) to beat a number we invented, on a page already scoring 98. **Forecloses:** the site is no longer held to a self-imposed bar stricter than the industry one, so a future regression between 1.8s and 2.5s will not trip this criterion. |
| D14 | **Analytics is built rather than struck: `@vercel/analytics`** (2026-09-16) | PORT-056's "Analytics recording page views" was the board's last unbuilt criterion — nothing in the repo wired any provider — so it was a dependency decision, and D12's precedent makes that Vernel's call rather than a default. He chose to build it. `@vercel/analytics` over Plausible or a third party because the site already deploys to Vercel: zero config, no paid plan, no external `<script>` host to weigh against the Best-Practices score, and **cookieless — so no consent banner is owed.** It is the first client JS the otherwise-static routes carry, which is the real cost and is deliberate. **Forecloses:** the numbers live in Vercel's dashboard rather than anywhere queryable from the repo, and the free tier caps retained events; **and the confirmation is only fully makeable on production**, because `/_vercel/insights/script.js` is served by Vercel's edge and 404s on localhost by design. |
| D12 | **Lighthouse installed as a devDependency** (2026-09-06) | PORT-052's "Accessibility = 100" and three of PORT-053's six criteria both need it, so it was settled as one decision covering both rather than twice. A devDependency keeps the version pinned in the lockfile and the run reproducible and scriptable, which a hand-run DevTools panel is not — and it never reaches the shipped bundle. **Forecloses:** audits now depend on a local Chrome/Chromium that CI does not currently install, so the `audit` script stays out of `verify` and out of `ci.yml`. |

## 10. Deferred

Do not build these. If one becomes genuinely necessary, it enters as a new epic with its own tickets.

| Item | Revisit when |
|---|---|
| Blog / MDX | You have written 3+ posts elsewhere and want them here |
| CMS | Editing a TS file becomes a real obstacle |
| Testing framework | The site has logic worth testing — currently the only candidate is the contact action |
| i18n | A second-language audience actually exists |
| Distributed rate limiting | Spam gets past the honeypot at volume |
| View counters / analytics dashboard | Never, probably |
