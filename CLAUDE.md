# Personal Portfolio

A six-page Next.js portfolio site — home, projects (index + detail), skills, about, resume, contact. Static-first, no database, no auth. Full scope in [ai-context/context/project-overview.md](ai-context/context/project-overview.md).

## How this project is worked on

**You author the code. He places it.** This is a deliberate learning build, and the thing being learned is *assembly* — how a project is planned, sequenced, layered and connected — not how to type a `className`. Every file comes from you, complete; every file lands on disk by his hand.

### The seam

| | Who | What |
|---|---|---|
| **Authoring** | **You** | The complete contents of every file — components, `lib/`, content, tokens, config, and the `src/app/` wiring. Delivered in the reply as a full paste-ready file with its path. Never a skeleton with holes. |
| **Placing** | **He does this** | Creating the file and pasting it in. **You do not write to disk** — not in `src/app/`, not in `components/`, not anywhere under `src/`. Reading is unrestricted. |
| **Git** | **He runs this** | Branching, staging, committing, pushing. You may read history freely (`git log`, `git status`, `git diff`) and you hand over the exact commands — you never run one that writes. |

You **may** write directly to the `ai-context/` docs, `CLAUDE.md` and `.claude/` — those are the record, not the build. You **may** run read-only and verification commands yourself: `npm run verify`, `lint`, `typecheck`, `build`, and any file reading or searching.

### How to hand over a file

Every handover is the same four parts, in this order:

1. **The command that creates the file**, ready to run. Never ask him to type a path by hand or click through New File — a mistyped path is a wasted debugging session, and the shell cannot misspell it.

   ```powershell
   New-Item -ItemType File src/components/layout/header.tsx; code src/components/layout/header.tsx
   ```

   Prefix a `New-Item -ItemType Directory -Force <dir>` when the folder does not exist yet. Use plain `New-Item -ItemType File` with **no `-Force`** — without it the command refuses to touch an existing file, which is exactly the safety you want. For a file that already exists, hand over `code <path>` on its own.

   **Never** create a file by redirecting content into it (`>`, `Out-File`, or `Set-Content` without `-Encoding utf8`). PowerShell writes UTF-16 with a BOM and the file will not parse. The shell makes the file empty; the editor puts the content in.

   When a step creates several files at once, give one command that creates them all, then the blocks in dependency order.

2. **The path**, named in the prose so he knows which file he is looking at.
3. **The code** — the complete file, always. See below.
4. **What it does, or what changed** — **one or two plain sentences.** See below.

### Always the whole file

**Every file is delivered whole — new or existing.** No skeleton, no holes, no `// ...rest unchanged`, no REMOVE/ADD fragments. If one line changes in a 200-line component, he gets the 200-line component back.

This is more to paste, deliberately. A fragment has to be *located* before it can be applied, and locating it is the step that goes wrong:

- Format-on-save reflows the file, so a line number can be stale between writing the handover and pasting it.
- A near-duplicate block further down the file accepts the paste silently, and the result still compiles.
- A multi-hunk edit that is half-applied leaves the file in a state neither of you has seen, and the next error message describes a file you are not looking at.

Replacing the whole file has one failure mode — select all, paste — and it is one he can see happen. Showing what changed is `git diff`'s job, not his to reconstruct from instructions.

So: hand over `code <path>`, name the file, give the complete contents, and say in the prose what actually changed and why, so he knows what he is looking for when he reads the diff back.

### Explaining a component — one or two sentences

**Set 2026-08-25.** Every file's explanation is **one or two plain sentences**, whether it is new ("what it does") or existing ("what changed"). Not a bulleted anatomy, not a prop-by-prop tour.

Say what the piece is for and, for an edit, what moved and why. Nothing else — the props are readable in the file he is holding, and the detail lives in [ui-registry.md](ai-context/context/ui-registry.md).

> `AboutIntro` is the page header for `/about` and owns its single `<h1>`; it takes no content props and reads `site` directly, the same way `Hero` does.

> One class changed: the intro grid is now centred at `lg`, because the portrait is four times the height of the text beside it and top-aligned it left a visible hole.

Two things survive the trim, and only when they genuinely apply:

- **A real trap** — a hydration rule, an ordering requirement, a dependency on something else existing. One sentence, and only if it would actually bite.
- **The reasoning behind a judgment call**, which belongs in the ticket brief or the close-out, not appended to each file. "Explain the why" still holds; it just does not live here.

Do **not** narrate the styling — no class-name tours, no token mappings, no explaining that `mt-auto` pins something to the bottom. That is what [ui-rules.md](ai-context/context/ui-rules.md) and [ui-registry.md](ai-context/context/ui-registry.md) are for, and both are written at close anyway. Name a class only when it is the gotcha itself.

The test: if it runs past two sentences without naming a trap, it is a registry entry wearing a handover's clothes.

### Explaining wiring

Wiring gets **numbered steps**, not prose. He is new to the professional workflow, so:

- Number every step. One action per step.
- Name the exact file to create or open, and the exact command to run.
- Write the click path where there is one — which DevTools panel, which tab, which button.
- Give the command that cannot go wrong. A one-line Console snippet beats hunting for a UI control. PowerShell is the shell here, so `Select-String`, not `grep`.
- End with **what he should see** — the concrete observable result that means the step worked.
- Never assume a step is trivial. If it needs naming, name it.

### Reviewing what he pastes back

Review it honestly against [code-standards.md](ai-context/context/code-standards.md) and [ui-rules.md](ai-context/context/ui-rules.md) §5 — wrong layer, missing empty state, unawaited `params`, `.sort()` mutating shared module state, `components/ui/` reaching into `content/`, a `dark:` variant used for colour. Say it plainly, with the reason. Flag scope creep: "that's PORT-0xx, leave it."

### When a ticket closes

- Run `npm run verify` **and the browser checks** yourself. Drive the real page with Playwright at the four breakpoints in both themes and report what you *observed*, never what the code implies. A criterion nothing has actually confirmed keeps the ticket `▶`.
- Hand him only the checks a script genuinely cannot make: a real phone or touch device, a judgment call on whether something *looks* right against the prototype, or a major flow he wants to feel for himself. Ask for those explicitly and wait — do not accept "done" as evidence for them.
- Update [progress.md](ai-context/context/progress.md), [ui-registry.md](ai-context/context/ui-registry.md) and [ui-rules.md](ai-context/context/ui-rules.md) yourself — those are the record, and they are yours to write.
- Hand him the git commands. Do not run them.

### Always

- **Do not build ahead.** Never write a file for a ticket that was not asked for. Never scaffold the next three components.
- **Explain the why.** The tradeoff, the gotcha, the alternative rejected. A file delivered without its reasoning is half-delivered.
- **Surface every judgment call**, with what it forecloses. Anything that changes the meaning of future work is an open question for him, not a silent default in your code.
- **Review the docs too.** If the plan or a settled value is wrong, say so and fix it in the same pass.
- **Verify, do not assert.** `npm run verify` plus a real browser check at the four breakpoints in both themes before anything is called done.

## Current state

**Sprint 0 — Foundation, complete (7 / 7). Sprint 1 — Content layer, functionally complete (4 / 5; PORT-012 stays open on placeholder copy). Sprint 2 — UI primitives, complete (6 / 6). Sprint 3 — Pages, complete (7 / 7). Sprint 4 — Contact wiring, 2 / 5.** The Next.js app is scaffolded and deployed (<https://vernel-portfolio.vercel.app>, auto-deploys on push to `main`), the design tokens are live in `src/app/globals.css` (colour, font, radius, container, gutter, type scale, section rhythm, breakpoint override), the layout primitives are built — `cn()` in `src/lib/utils.ts`, `Container` and `Section` in `components/layout/`, `Prose` in `components/ui/` — the app shell is wired (`Header`, `NavLinks`, `Footer`, `SkipLink`, `ThemeToggle` around a `<main id="main">` in `src/app/layout.tsx`), all six routes exist as stubs (`/`, `/projects`, `/skills`, `/about`, `/resume`, `/contact`) alongside a designed `not-found.tsx` and a Client Component `error.tsx`, and the mobile menu is built — a burger below `lg:` opening a portaled sheet with a real focus trap. The site is navigable end to end at every breakpoint in both themes. `/projects/[slug]` landed in PORT-032; **one gap is still carried deliberately — `global-error.tsx`, which means a root-layout failure is uncaught.**

Check [ai-context/context/progress.md](ai-context/context/progress.md) at the start of every session. It is the source of truth for what is actually built. Never assume a feature exists.

The content layer has started. `src/content/types.ts` (PORT-010) holds 12 types validated by `satisfies`, not Zod — note what `satisfies` actually does: it narrows fields *declared* as unions, and widens `slug`/`tags` to `string`, so slug uniqueness and tag casing are by-eye checks, not compile errors. `src/content/site.ts` (PORT-011) now feeds the header nav, the footer socials and the name; `Header` and `Footer` import it directly, which content-model §4 carves out explicitly.

`src/content/projects.ts` (PORT-012) and `experience.ts` + `skills.ts` (PORT-013) are placed. PORT-013 is closed; **PORT-012 is parked at `⚠`, not `▶`** (it is not in progress — it waits on an external unblock) — the two OpalusPH sites, all four images and the per-project `year`/`status`/`stack`/URL values are still marked `Placeholder`/`TBC`, and **PORT-057** is the ticket that closes that gap. Screenshots were deferred by decision: four real 1600×1000 WebP stand-ins sit at `public/images/projects/`, so intrinsic dimensions are honest and no layout shift is introduced.

`src/lib/content.ts` (PORT-015) closes the layer: **nine** accessors, not content-model §4's original seven — `getEducation()` and `getSkillGroups()` were added because §4's snippet imported `education` without using it and gave no accessor for `skillGroups` despite naming it as content only this module may import. §4 has been rewritten to match the built file. Pages import projects, jobs, education and skills from here, never from `src/content/` directly; `site` is the one carve-out.

**PORT-020 (Button) and PORT-021 (Card + ProjectCard) are closed.** `src/components/ui/button.tsx` — variants `primary`/`outline`/`ghost`, sizes `sm`/`md`, polymorphic on `href` via a discriminated union (no `asChild`, no Slot). `src/components/ui/card.tsx` is a plain bordered box, never a link itself; `src/components/sections/project-card.tsx` — the first file in `sections/` — wraps a `next/link` around it, proven whole-card-is-one-link by the ESLint boundary rule rather than convention. Two token gaps closed alongside it: `--shadow-card`/`--shadow-card-lift` (dark values are a judgment call, unmeasured against a prototype that isn't in the repo) and `--aspect-thumbnail: 16/10`, so `next/image fill` absorbs a future off-ratio real screenshot without shifting layout. Tags render as inline chips marked `PORT-022 replaces this`.

**PORT-022 (Badge) is closed.** `src/components/ui/badge.tsx` — a styled `<span>`, the exact chip class string ui-rules §6 already recorded. `ProjectCard`'s tag chips now render `<Badge>` instead of the inline classes. **Ships neutral tone only** — the registry recorded a prototype-derived `tone: neutral|fern|coral`, but nothing built needs `fern`/`coral` yet and `coral` walks straight into the still-unanswered contrast question, so it was raised with Vernel directly rather than defaulted; he chose neutral-only, deferring the other tones to whichever ticket first needs them.

**PORT-023 (Field/Input/Textarea) is closed.** Open question 7 was settled first, since it gated the ticket: a new token `--coral-text` (not a darkened `--coral`) covers the two places coral is genuine text — `Field`'s error message and required-mark asterisk. `Field` derives its `id` from a required `name` prop rather than `useId()`, keeping it a Server Component.

**PORT-024 (Icons) and PORT-025 (Component gallery) are closed — Sprint 2 complete.** `src/lib/icons.ts` holds `ICONS: Record<IconName, LucideIcon>`, 12 names each tied to a content type already built (`Practice`, `Job`/`Education`, `SiteConfig.email`/`.location`) — nothing invented ahead of `practices` content, which is still PORT-037's job. `IconName` lives in `content/types.ts`, not `lib/`, keeping `content → lib` the one correct dependency direction. `src/components/ui/icon.tsx` wraps the map with ui-rules §3's default size/stroke. Bundle impact was verified by grepping real production chunks, not assumed: none of the 12 names reach client JS, since `Icon` and everything using it are Server Components. `/gallery` (`src/app/gallery/page.tsx`) renders every built `ui/` primitive plus `ProjectCard`, gated to 404 in production, confirmed with `next build && next start`. One AC bullet is honestly unmet and said so on the page itself: no built component has a designed empty state yet.

**PORT-030 (Home), PORT-031 (Projects index), PORT-032 (Project detail) and PORT-033 (About) are closed — Sprint 3 is 4 / 7.** `/projects/[slug]` closed the site's oldest carried gap: it prerenders one static page per project, answers an unknown slug with a real 404 from its own segment `not-found.tsx`, and its arrival removed the three-per-load prefetch console 404s that both earlier page tickets had to sign off as expected. Four new `sections/` components (`ProjectHeader`, `CaseStudy`, `ProjectGallery`, `ProjectNav`) and one new accessor, `getAdjacentProjects()` — `lib/content.ts` is now **ten** exports, not nine. One look-right call is open with Vernel: a project with no `cover` falls back to its 16:10 thumbnail and gets a 50% taller page header than a project with a real 12:5 cover.

**PORT-033 (About) closed 2026-08-25.** `/about` is the first page whose copy is written prose rather than assembled content — every claim in the bio is traceable to `education`, `jobs`, the two real projects or the `learning` tier, and nothing is claimed about what the OpalusPH role achieved, since those bullets are still placeholder. One new component (`AboutIntro`, which takes no content props and reads `site` directly, the `Hero` precedent) and one new **required** content field, `SiteConfig.photo`. **The profile photo prerequisite was settled by Vernel, not defaulted:** he has no photo yet and chose a self-labelling placeholder (`PHOTO PENDING`, 1000×1250, 4:5) over a no-photo branch, so **PORT-058** now tracks the swap — the board is 39 tickets, not 38. `photo` is required rather than optional on purpose: an optional field means a fallback branch nothing exercises. Two things deliberately not built: `SkillTier` (that is PORT-037; About renders the compact tier treatment instead) and any content file for the bio (it is JSX in `Prose`, because it carries an inline `<Link>` and markup in typed content means MDX by another name). `/about` ships **no `og:image`** while the portrait is a placeholder — revisited in PORT-058's AC.

**PORT-034 (Resume) closed 2026-09-02 at `⚠`, not `✔`.** `/resume` is built and browser-verified, but the AC bullet "the PDF actually exists in `public/` and is current" is genuinely unmet and stays unchecked: `public/resume.pdf` **predates the OpalusPH internship entirely** and carries a different email address (`aquinovern0@` vs `site.email`), a `Langauges` typo, and two academic projects absent from `projects.ts`. The PDF was read with `pdftotext` rather than assumed. Vernel chose to ship the download live and track the swap as **PORT-059** — the board is 40 tickets — the same unblock-and-track call as PORT-012 and PORT-058, **with one difference worth remembering: those placeholders say what they are on their own face and a stale PDF cannot.** Three files: `src/components/sections/timeline.tsx` (takes a neutral `TimelineEntry`, deliberately not `Job`/`Education`, so one component serves both lists), `src/lib/dates.ts` (**constructs no `Date` at all** — `new Date("2026-02")` is midnight UTC and renders as January in any timezone behind UTC, a bug that passes locally and ships broken), and a global `@media print` block in `globals.css` keyed on `body > header` / `body > footer` / `a[href="#main"]`, because the shell is rendered by the root layout where no page can reach it. **The lesson worth carrying: `flex-wrap` measured perfectly and still looked broken** — zero overflow at all five widths, yet one list rendered in two layouts below `md` because each item wrapped by its own title length. Caught by reading screenshots after the numbers came back clean. Now `md:flex`.

**PORT-036 (Contact page UI) closed 2026-09-02.** `/contact` is the site's first interactive page and the first route shipping client JS on purpose — the route is still `○` static. Two new `sections/` components: `ContactMethods` (server, reads `site` directly, filters `email` out of the socials because the address already has its own labelled row) and `ContactForm`, the one Client Component. **The UI-before-wiring split held strictly** — no Server Action, no Zod, no `lib/validation/`; submitting does nothing, which is the ticket working as specified. `ContactForm`'s `FormState` is deliberately shaped like the `ActionResult` union code-standards §6 specifies, so **PORT-041 replaces one function body rather than converting a component**; the throwaway `mockValidate` is pointedly *not* a client-side Zod schema, because the real schema belongs in `lib/validation/` shared with the server. Three a11y points worth carrying: **`noValidate` is load-bearing** (without it the browser bubble hides the designed validation state and would later preempt the authoritative server parse), pending announces in an `aria-live` paragraph as well as changing the button label, and success **replaces** the form rather than sitting above it. **And for the second ticket running, a layout fault survived clean numbers and was caught only by reading a screenshot:** 454/454 assertions passed with zero overflow while a **128px void** sat between the intro and the first field at 1440 — two `spacing="tight"` sections stacking their padding, scaling with the breakpoint because the token is fluid. Fixed by collapsing to one `Section` with the intro inside the form's grid column.

**PORT-037 (Skills) closed 2026-09-02 — Sprint 3 is complete (7 / 7) and every page renders real content.** Its content-writing step was done, not stubbed: `practices` is four cards of original prose, each traceable to a job bullet, a project narrative or a rule this repo already follows, with the sources named in the file's header. `getPractices()` is the **eleventh** accessor and the only one that does not sort — four habits have no rank, so the file's order is the intended order. Two components: `SkillTier` (the full treatment `/about` deliberately did not grow into) and `PracticeCard`.

**The AC could not be built as written, and the amendment is the thing to carry.** "Tier is encoded by dot weight and swatch saturation" fails WCAG 1.4.11: the wash tokens measured 1.02–1.23:1 against the page ground and rendered as three empty rings in both themes, and `fern` at 70%/45% opacity still came out at 2.79:1 and 1.86:1 in light — because `--fern` is only 4.78:1 to begin with, so there is no headroom to dim into. Depth is now **filled count plus dot size** at full-strength fern. Put to Vernel as three options rather than defaulted; build-plan §6 carries the measurement table. Three new rules landed in ui-rules §5: a wash token is never a foreground mark, dimming one colour to encode a scale usually fails on headroom, and **check the measurement itself** — two of this ticket's own contrast assertions were wrong while the component was fine, one passing on a 1.02:1 difference and one reading `lab()` components as RGB.

**Sprint 3's lesson, three tickets running: clean numbers are not a clean page.** PORT-034 found a two-layout list behind zero overflow, PORT-036 a 128px void behind 454 passing assertions, PORT-037 an invisible dot meter behind an assertion that was itself broken. Reading screenshots caught all three. A fourth trap appeared here and cost a full run: **a stale `next start` kept serving the previous build**, so the numbers described code that no longer existed — kill the port and confirm a new string is in the served HTML before believing a re-run.

**PORT-040 and PORT-041 are closed — Sprint 4 is 2 / 5 and the contact form really submits.** `src/lib/validation/contact.ts` is the one Zod schema (server parse authoritative) and `src/lib/actions/contact.ts` is the endpoint that enforces it. **It does not yet deliver:** a valid submission returns `{ ok: true }` and is written to the server log, so nothing is lost, but no email is sent and the success panel's "it reached my inbox" is not true until PORT-042 wires Resend.

**PORT-041's lessons are about the gap between reading code and running it.** PORT-036 promised the wiring would swap `useState` → `useActionState` without touching markup; that held for the swap, and three structural additions were still forced, each found only by driving the page. **"Send another" as a `<Link href="/contact">` was dead** — the visitor is already on `/contact`, so same-route navigation never unmounts the component, `useActionState` (which has no reset) keeps its result, and the form became one-shot per page load; the fix is remounting on a `formKey`. `SubmitButton` had to split out, meeting the `useFormStatus` gotcha this file already records. A `Spinner` had to be written, inline rather than in `lib/icons.ts`, because `IconName` is scoped to content-backed icons.

**The bug worth carrying: the honeypot must be read off raw `FormData` BEFORE `safeParse`.** Checking `parsed.data.honeypot` — which the plan, the guide and progress.md all originally prescribed — is unreachable, because the schema's own `.max(0)` rejects a filled honeypot first. That comes back as `fieldErrors: { honeypot }`, no visible `Field` renders that key, and the form silently refuses to submit **showing no reason at all** — telling the bot it was caught and handing a real person tripped by autofill a dead form. Caught by a tamper suite, not by reading. **And a fourth trap for the screenshot habit: this time reading them raised a false alarm** — a duplicated sticky header at 375 that was a `fullPage` stitching artifact, disproved with a viewport-only shot. Verify the anomaly before fixing it.

Next ticket: **PORT-042** (email delivery). It is the first ticket here that **cannot start on code alone** — it needs a Resend account and a verified sending domain. Still carried and visible on all seven pages: root `layout.tsx` has hardcoded metadata (`“— Developer”`, not `site.role`) and **no `metadataBase`**, flagged since PORT-030; and `global-error.tsx` still does not exist.

## Documentation map

| File | Purpose |
|---|---|
| [project-overview.md](ai-context/context/project-overview.md) | Scope, pages, what is explicitly **out** of scope, non-functional targets |
| [architecture.md](ai-context/context/architecture.md) | Structure, layer boundaries, settled architectural decisions and their rationale |
| [content-model.md](ai-context/context/content-model.md) | The typed content layer — schema, accessors, integrity rules |
| [ui-rules.md](ai-context/context/ui-rules.md) | Design tokens, Tailwind v4 token strategy, component contract, a11y floor |
| [ui-registry.md](ai-context/context/ui-registry.md) | Every component, where it lives, its exact classes. **Check before building any component** |
| [code-standards.md](ai-context/context/code-standards.md) | Naming, TypeScript, React/Next rules, git conventions |
| [build-plan.md](ai-context/context/build-plan.md) | **The ticket board** — 40 tickets, 6 sprints, acceptance criteria |
| [implementation-guide.md](ai-context/context/implementation-guide.md) | Step-by-step how-to with commands and code shapes |
| [progress.md](ai-context/context/progress.md) | **What is done.** Update every session |

## Stack

Next.js (App Router) · TypeScript strict · Tailwind v4 with CSS-variable tokens · content as typed TS in `src/content/` · Zod (contact form only) · Server Action + Resend · `lucide-react` · Vercel.

Design: **settled.** An approved interactive prototype covers all 9 pages in both themes — it is the visual contract. Tokens are recorded in [ui-rules.md](ai-context/context/ui-rules.md) §2–3 and every component is catalogued as `designed` in [ui-registry.md](ai-context/context/ui-registry.md). Build to match it; do not redesign in React.

Direction: **"workbench"** — warm off-white/charcoal ground with a green bias, fern green primary, coral as the single accent, generous radii (10/14/22/28/999), monospace used only for annotation. Originally a Google Stitch export, reframed away from its brutalist-terminal look.

## Settled decisions — do not re-litigate

Full list with rationale in [build-plan.md](ai-context/context/build-plan.md) §9.

- No database, no ORM, no CMS, no auth, no RBAC. Nothing persists.
- No blog, no MDX.
- No global state manager.
- Content is typed TS literals validated by `satisfies` at compile time — **not** Zod. Zod is for the contact form only, because that is the only untrusted input.
- Three layers: `content → lib → components`. No controller/service/repository — there is no database to isolate.
- Static generation by default. Server Components by default; `"use client"` requires a reason.

## Conventions

- Files/folders kebab-case · components PascalCase · vars camelCase · constants UPPER_SNAKE_CASE
- `@/` alias for cross-directory imports; `import type` for type-only imports
- Tokens only in styles — no hex, no `text-gray-*`, no arbitrary values, no `dark:` variants for color
- Every component accepts `className`, merged with `cn()`
- Server Actions return a typed result union; they never throw to the client
- `process.env` accessed only through `lib/env.ts`
- Branch per ticket: `feat/PORT-021-project-card`

## Gotchas

These are the ones that have actually cost people hours:

- **`@theme inline`, not `@theme`**, when a token's value is a `var()`. Plain `@theme` bakes the light value in and dark mode silently does nothing.
- **next/font variables must not share a name with the theme token they feed.** `Inter({ variable: "--font-inter" })` → `--font-sans: var(--font-inter)`. Naming both `--font-sans` is self-referential, resolves to nothing, and falls back to the system font with no error.
- **`suppressHydrationWarning` on `<html>`** is required with `next-themes`, and the toggle must not render its icon before mount.
- **`params` and `searchParams` are Promises** in Next 15+. Await them.
- **`useFormStatus` reads the parent form's status** — the submit button must be its own component or `pending` is always `false`.
- **`.sort()` mutates.** Always `[...projects].sort(...)` — the imported array is shared module state.
- **To prove an ESLint rule fires, use `--stdin`, not a temporary file.** `printf '...' | npx eslint --stdin --stdin-filename src/components/ui/__probe.tsx` lints a path that never exists on disk — no file to create, none to forget to delete, and nothing written under `src/`.
- **No TypeScript runner is installed** (no `tsx`, `ts-node` or `esbuild`). To execute repo TS outside Next, compile it with `tsc -p` against a scratchpad config, rewrite the `@/` imports to relative, and run the JS under node.
- **`components/ui/` must not import from `content/`.** Enforced by ESLint. Domain-aware components go in `components/sections/`.
- **Check [ui-registry.md](ai-context/context/ui-registry.md) before building any component** — match what exists rather than inventing a near-duplicate.
- **Every list needs a designed empty state**, and every optional content field needs a rendering branch.
- **Breakpoints are 1000 / 760 / 460**, set by the design — not Tailwind's defaults.
- **Lighthouse against `next build && next start`**, never dev mode.
