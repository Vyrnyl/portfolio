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
4. **What it does** — see below.

### Always the whole file

**Every file is delivered whole — new or existing.** No skeleton, no holes, no `// ...rest unchanged`, no REMOVE/ADD fragments. If one line changes in a 200-line component, he gets the 200-line component back.

This is more to paste, deliberately. A fragment has to be *located* before it can be applied, and locating it is the step that goes wrong:

- Format-on-save reflows the file, so a line number can be stale between writing the handover and pasting it.
- A near-duplicate block further down the file accepts the paste silently, and the result still compiles.
- A multi-hunk edit that is half-applied leaves the file in a state neither of you has seen, and the next error message describes a file you are not looking at.

Replacing the whole file has one failure mode — select all, paste — and it is one he can see happen. Showing what changed is `git diff`'s job, not his to reconstruct from instructions.

So: hand over `code <path>`, name the file, give the complete contents, and say in the prose what actually changed and why, so he knows what he is looking for when he reads the diff back.

### Explaining a component

Explain the **role**, not the stylesheet. He needs to know what the piece is for and how it behaves, so that when he assembles pages he knows what he is reaching for.

Say:

- What it is and what job it does on the page.
- What it exports, what props it takes, and what each prop is *for*.
- Where it belongs and what it expects to be given.
- What visibly breaks if it is wired wrong, or left out.
- Any real trap — a hydration rule, an ordering requirement, a dependency on something else being present.

Do **not** narrate the styling. No walking through class names, no listing which token maps to which colour, no explaining that `mt-auto` pins something to the bottom. That detail belongs in [ui-rules.md](ai-context/context/ui-rules.md) and [ui-registry.md](ai-context/context/ui-registry.md), which is exactly what those files are for. Mention a class only when it is a genuine gotcha he would otherwise trip on.

The test: if the explanation would still be useful to someone who never opens the CSS, it is at the right altitude.

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

**Sprint 0 — Foundation, complete (7 / 7). Sprint 1 — Content layer, functionally complete (4 / 5; PORT-012 stays open on placeholder copy). Sprint 2 — UI primitives, in progress (3 / 6 — PORT-020, PORT-021, PORT-022 done).** The Next.js app is scaffolded and deployed (<https://vernel-portfolio.vercel.app>, auto-deploys on push to `main`), the design tokens are live in `src/app/globals.css` (colour, font, radius, container, gutter, type scale, section rhythm, breakpoint override), the layout primitives are built — `cn()` in `src/lib/utils.ts`, `Container` and `Section` in `components/layout/`, `Prose` in `components/ui/` — the app shell is wired (`Header`, `NavLinks`, `Footer`, `SkipLink`, `ThemeToggle` around a `<main id="main">` in `src/app/layout.tsx`), all six routes exist as stubs (`/`, `/projects`, `/skills`, `/about`, `/resume`, `/contact`) alongside a designed `not-found.tsx` and a Client Component `error.tsx`, and the mobile menu is built — a burger below `lg:` opening a portaled sheet with a real focus trap. The site is navigable end to end at every breakpoint in both themes. Nothing renders content yet, and two gaps are carried deliberately: `/projects/[slug]` (PORT-032) and `global-error.tsx`, which means a root-layout failure is uncaught.

Check [ai-context/context/progress.md](ai-context/context/progress.md) at the start of every session. It is the source of truth for what is actually built. Never assume a feature exists.

The content layer has started. `src/content/types.ts` (PORT-010) holds 12 types validated by `satisfies`, not Zod — note what `satisfies` actually does: it narrows fields *declared* as unions, and widens `slug`/`tags` to `string`, so slug uniqueness and tag casing are by-eye checks, not compile errors. `src/content/site.ts` (PORT-011) now feeds the header nav, the footer socials and the name; `Header` and `Footer` import it directly, which content-model §4 carves out explicitly.

`src/content/projects.ts` (PORT-012) and `experience.ts` + `skills.ts` (PORT-013) are placed. PORT-013 is closed; **PORT-012 is parked at `⚠`, not `▶`** (it is not in progress — it waits on an external unblock) — the two OpalusPH sites, all four images and the per-project `year`/`status`/`stack`/URL values are still marked `Placeholder`/`TBC`, and **PORT-057** is the ticket that closes that gap. Screenshots were deferred by decision: four real 1600×1000 WebP stand-ins sit at `public/images/projects/`, so intrinsic dimensions are honest and no layout shift is introduced.

`src/lib/content.ts` (PORT-015) closes the layer: **nine** accessors, not content-model §4's original seven — `getEducation()` and `getSkillGroups()` were added because §4's snippet imported `education` without using it and gave no accessor for `skillGroups` despite naming it as content only this module may import. §4 has been rewritten to match the built file. Pages import projects, jobs, education and skills from here, never from `src/content/` directly; `site` is the one carve-out.

**PORT-020 (Button) and PORT-021 (Card + ProjectCard) are closed.** `src/components/ui/button.tsx` — variants `primary`/`outline`/`ghost`, sizes `sm`/`md`, polymorphic on `href` via a discriminated union (no `asChild`, no Slot). `src/components/ui/card.tsx` is a plain bordered box, never a link itself; `src/components/sections/project-card.tsx` — the first file in `sections/` — wraps a `next/link` around it, proven whole-card-is-one-link by the ESLint boundary rule rather than convention. Two token gaps closed alongside it: `--shadow-card`/`--shadow-card-lift` (dark values are a judgment call, unmeasured against a prototype that isn't in the repo) and `--aspect-thumbnail: 16/10`, so `next/image fill` absorbs a future off-ratio real screenshot without shifting layout. Tags render as inline chips marked `PORT-022 replaces this`.

**PORT-022 (Badge) is closed.** `src/components/ui/badge.tsx` — a styled `<span>`, the exact chip class string ui-rules §6 already recorded. `ProjectCard`'s tag chips now render `<Badge>` instead of the inline classes. **Ships neutral tone only** — the registry recorded a prototype-derived `tone: neutral|fern|coral`, but nothing built needs `fern`/`coral` yet and `coral` walks straight into the still-unanswered contrast question, so it was raised with Vernel directly rather than defaulted; he chose neutral-only, deferring the other tones to whichever ticket first needs them.

Next ticket: **PORT-023** (Field/Input/Textarea, the accessibility-critical one). Open question 7 (`coral` on `ground` measures 3.97:1 in light mode, below AA) directly gates this one — `Input`/`Textarea`'s planned spec routes `aria-invalid` through `border-coral`, so settle the question before writing the component, not during.

## Documentation map

| File | Purpose |
|---|---|
| [project-overview.md](ai-context/context/project-overview.md) | Scope, pages, what is explicitly **out** of scope, non-functional targets |
| [architecture.md](ai-context/context/architecture.md) | Structure, layer boundaries, settled architectural decisions and their rationale |
| [content-model.md](ai-context/context/content-model.md) | The typed content layer — schema, accessors, integrity rules |
| [ui-rules.md](ai-context/context/ui-rules.md) | Design tokens, Tailwind v4 token strategy, component contract, a11y floor |
| [ui-registry.md](ai-context/context/ui-registry.md) | Every component, where it lives, its exact classes. **Check before building any component** |
| [code-standards.md](ai-context/context/code-standards.md) | Naming, TypeScript, React/Next rules, git conventions |
| [build-plan.md](ai-context/context/build-plan.md) | **The ticket board** — 37 tickets, 6 sprints, acceptance criteria |
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
