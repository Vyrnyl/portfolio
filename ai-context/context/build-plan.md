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

**Total: ~57h of focused work**, 40 tickets. Sprints 0–2 feel slow and produce little visible progress; Sprint 3 then goes fast *because* of them. That trade is the point — resist the urge to jump to Sprint 3.

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
- [ ] `.env.example` lists `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `NEXT_PUBLIC_SITE_URL` with empty values
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
- [ ] `"use server"`; returns the typed `ActionResult` union
- [ ] Server-side zod parse is authoritative — verified by submitting with JS disabled or via a crafted request
- [ ] Field errors map back to the correct inputs
- [ ] Pending state disables the submit button and shows a spinner
- [ ] The action **never throws to the client**; unexpected errors are caught, logged server-side, returned as a generic message
- [ ] Result announced in an `aria-live="polite"` region
- [ ] Successful submission clears the form

---

### PORT-042 · Email delivery `M`
**Depends on:** 041

Resend integration plus `lib/env.ts`.

**Acceptance criteria**
- [ ] `lib/env.ts` throws at module load on a missing required var — **test by removing one**
- [ ] `lib/email.ts` wraps the Resend client; the action never calls Resend directly
- [ ] Email includes name, email, message, and a timestamp; the visitor's email is set as `replyTo`
- [ ] Visitor input appears **only in the body** — never in the subject, headers, or `to` field
- [ ] Provider failure returns the friendly error state, and the error is logged server-side with context
- [ ] **A real message arrives in your real inbox**
- [ ] `RESEND_API_KEY` is in `.env.local`, absent from git, and documented in `.env.example`

---

### PORT-043 · Spam and rate limiting `M`
**Depends on:** 042

**Acceptance criteria**
- [ ] Honeypot filled → returns **success** to the client, sends nothing. Never tell a bot it was caught.
- [ ] Minimum time-to-submit (~3s) rejects instant machine submissions
- [ ] Per-IP rate limit (e.g. 3 per 10 minutes) with a clear message when hit
- [ ] Rate limit tested by submitting repeatedly
- [ ] `lib/rate-limit.ts` documents in a comment that it is in-memory and per-instance — adequate here, **not** distributed protection

---

### PORT-044 · Contact UX polish `S`
**Depends on:** 043

**Acceptance criteria**
- [ ] Success state is reassuring and states an expected response time
- [ ] The failure state shows a **`mailto:` fallback** — a visitor is never dead-ended by your email provider
- [ ] Field errors appear inline and preserve entered values
- [ ] Form is fully usable by keyboard from first field to submitted result
- [ ] Screen reader announces both success and failure

**Sprint 4 exit:** a message sent from the deployed form arrives in your inbox, and the failure paths are all survivable.

---

## 8. EPIC F — Production `Sprint 5`

---

### PORT-050 · Metadata and OG images `M`
**Depends on:** 032

**Acceptance criteria**
- [ ] Root layout sets `metadataBase`, title template, and default OG/Twitter tags
- [ ] Every page exports real `metadata`; descriptions are unique and under 160 chars
- [ ] `opengraph-image.tsx` generates a default card via `next/og`
- [ ] Project pages generate per-project OG images
- [ ] `lib/seo.ts` holds the builders — no page hand-assembles an OG object
- [ ] Cards verified in a link preview debugger, not just by reading the HTML

---

### PORT-051 · Sitemap, robots, structured data `S`
**Depends on:** 050

**Acceptance criteria**
- [ ] `sitemap.ts` generated from the content layer — a new project appears automatically
- [ ] `/gallery` excluded from the sitemap
- [ ] `robots.ts` allows crawling and points to the sitemap
- [ ] JSON-LD `Person` in the root layout, `CreativeWork` on project pages
- [ ] Structured data passes a validator with no errors

---

### PORT-052 · Accessibility audit `M`
**Depends on:** all pages

**Acceptance criteria**
- [ ] axe DevTools: **zero violations** on all seven routes
- [ ] Full keyboard walkthrough of every page and the form — no traps, focus always visible
- [ ] Tested with a screen reader (NVDA or Narrator on Windows) on home, project detail, and contact
- [ ] One `<h1>` per page; no skipped heading levels
- [ ] Contrast measured in both themes
- [ ] `prefers-reduced-motion` honored — verify by enabling it in the OS
- [ ] Lighthouse Accessibility = 100 on every route

---

### PORT-053 · Performance audit `M`
**Depends on:** 052

**Acceptance criteria**
- [ ] Lighthouse mobile: Performance ≥ 95, Best Practices ≥ 95, SEO 100
- [ ] LCP < 1.8s, CLS < 0.05
- [ ] All images WebP/AVIF, correctly sized, with `priority` **only** on the LCP image
- [ ] Fonts self-hosted via `next/font`, `display: swap`, no layout shift
- [ ] `next build` confirms every page is static; client JS limited to the theme toggle, filter, and form
- [ ] No render-blocking third-party resources

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
- [ ] Connected to Vercel; `main` auto-deploys; PRs get preview deploys
- [ ] Production env vars set in Vercel (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `NEXT_PUBLIC_SITE_URL`)
- [ ] Custom domain live with HTTPS and a `www` → apex redirect
- [ ] **Contact form tested on the production URL** — a preview deploy passing is not proof
- [ ] `site.url` matches the real domain so OG images resolve absolutely

---

### PORT-056 · Launch checklist `S`
**Depends on:** 055

**Acceptance criteria**
- [ ] Every route loads on production, on a real phone as well as a desktop
- [ ] All external links resolve; resume PDF downloads
- [ ] OG cards render correctly when the URL is pasted into Slack/LinkedIn/X
- [ ] Analytics recording page views
- [ ] 404 and error pages verified live
- [ ] Content proofread — typos on a portfolio cost more than they do anywhere else
- [ ] [progress.md](progress.md) marked complete; [ui-registry.md](ui-registry.md) fully populated

---

### PORT-057 · Replace placeholder project content `M`
**Depends on:** 012

Added 2026-08-22. PORT-012 shipped with **placeholder copy and placeholder images**, because the projects to be featured were still being built and the details were not to hand. This ticket pays that back. It is not optional polish — a portfolio whose cards all read "Placeholder summary" is worse than one showing two projects done properly.

**The shape is already correct**, so this is a fill-in job, not a rewrite: field coverage, string lengths and status spread were chosen in PORT-012 to exercise every branch. Keep that spread when replacing the values — if the real projects happen not to exercise some optional field, leave one entry that does, or the fallback branch stops being tested.

**Narrowed 2026-08-25.** This ticket briefly covered `experience.ts` too (the three OpalusPH bullets, added to its scope 2026-08-22). That part is **done** — it was pulled forward ahead of PORT-034, because `/resume` renders those bullets and shipping the page would have put literal "Placeholder" text on a live page for the first time. `experience.ts` now returns zero gate hits. **What remains is `projects.ts` and the images, nothing else.**

One caveat on the first criterion: the grep also catches **one hit in `src/content/site.ts`** — `photo.alt` — which belongs to **PORT-058**, not this ticket. Neither ticket can close while the grep is non-empty, so whichever lands second gets a clean run; do not "fix" the other's hit to make the check pass here.

**Acceptance criteria**
- [ ] `Select-String -Pattern "Placeholder|TBC" src/content/` returns **nothing** (the `site.ts` hit is PORT-058's to clear)
- [ ] Every `.webp` in `public/images/projects/` is a real capture — zero placeholders remain
- [ ] `year`, `status`, `tags`, `stack`, `role`, `duration` replaced with verified values
- [ ] Every `liveUrl`/`repoUrl` is a real URL that resolves — no `https://example.com` survives
- [ ] `problem`/`approach`/`outcome` are real prose with no invented metrics
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

**Acceptance criteria**
- [ ] `public/images/profile-placeholder.webp` deleted, replaced by a real photo under `public/images/`
- [ ] `site.photo.alt` describes the actual photo — the "Placeholder graphic standing in for…" string does not survive
- [ ] `site.photo.width`/`height` match the new file's real intrinsic size
- [ ] WebP, ≤ 200KB
- [ ] `/about` checked at all four breakpoints in both themes — a different aspect ratio must not break the intro grid
- [ ] Decide at the same time whether `/about` now earns an `og:image`; PORT-033 deliberately ships none while the portrait is a placeholder

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

**Acceptance criteria**
- [ ] `public/resume.pdf` contains the OpalusPH internship with the same dates and title as `jobs[0]`
- [ ] Every email address in the PDF matches `site.email` exactly
- [ ] "Langauges" typo corrected
- [ ] The PDF's projects and `projects.ts` tell a consistent story — same projects, or a deliberate documented subset
- [ ] `pdftotext -layout public/resume.pdf -` diffed by eye against `/resume` — no fact appears in one and contradicts the other
- [ ] The download still opens in a new tab and the file is not corrupted after replacement

**Watch for:** the file is replaced in place at `public/resume.pdf`, so `site.resumePdf` needs no edit — and *because* it needs no edit, nothing in the codebase changes when this ticket lands. `npm run verify` will pass identically before and after. The only proof is reading the new PDF.

**Blocks:** PORT-056.

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
