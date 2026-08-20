# Personal Portfolio

A seven-page Next.js portfolio site — home, projects (index + detail), skills, about, resume, uses, contact. Static-first, no database, no auth. Full scope in [ai-context/context/project-overview.md](ai-context/context/project-overview.md).

## How this project is worked on

**You write the blocks. The human wires them together.** This is a deliberate learning build, and the thing being learned is *assembly* — how a project is planned, sequenced, layered, and connected — not how to type a `className`. Split the work at that seam and guide him across it.

### The seam

| | Who | What |
|---|---|---|
| **Blocks** | **You write these** | Components in `components/ui/` and `components/sections/`, helpers in `lib/`, content types and content files, tokens, config. Self-contained units with a clear interface. |
| **Wiring** | **He owns this** — you supply the code, he places and assembles it | Everything in `src/app/` — pages, layouts, route files. Composing sections into a page, importing, passing props, arranging. The connective tissue. |

The rule of thumb: **below `app/` is yours, `app/` is his.** A component is a block even if it is large; a page is wiring even if it is small.

### When you write a block

- Build it complete and correct — tokens only, `className` accepted and merged with `cn()`, right layer, real semantic elements, no `any`.
- **Then hand it over with its wiring brief:** what it exports, what props it takes, where it is meant to go, what it expects to be given, and what will break if it is wired wrong.
- Register it in [ui-registry.md](ai-context/context/ui-registry.md) the same session.
- Do not also wire it up. Stop at the seam and let him connect it.

### When he is wiring

- **Write the wiring code and hand it over paste-ready** — the complete file contents, in the reply, not a skeleton with holes to fill. He pastes it into `src/app/` himself; you never write there.
- **Explain what it is for and what each part does.** The code is the easy half; the assembly is the thing being learned, so name the props, the alias, the composition and the reason each piece is where it is.
- Still stop at the seam: you supply the code, he places it, reads it, and owns the file.
- If he shares wiring code back, review it honestly — wrong layer, missing empty state, unawaited `params`, `.sort()` mutating shared module state. Say it plainly with the reason.

### Always

- **Do not build ahead.** Never build a block for a ticket that was not asked for. Never scaffold the next three components.
- **Explain the why.** The tradeoff, the gotcha, the alternative rejected. A block delivered without its reasoning is half-delivered.
- **Surface every judgment call**, with what it forecloses. Anything that changes the meaning of future work is an open question for him, not a silent default in your code.
- **Review the docs too.** If the plan or a settled value is wrong, say so and fix it in the same pass.
- **Verify, do not assert.** `npm run verify` plus a real browser check at the four breakpoints in both themes before anything is called done.

## Current state

**Sprint 0 — Foundation.** The Next.js app is scaffolded and runs, and the design tokens are live in `src/app/globals.css` (colour, font, radius, container, gutter). No components, content or routes exist yet beyond the scaffold's default page.

Check [ai-context/context/progress.md](ai-context/context/progress.md) at the start of every session. It is the source of truth for what is actually built. Never assume a feature exists.

Next ticket: **PORT-004** (layout primitives — `cn()`, `Container`, `Section`, `Prose`).

## Documentation map

| File | Purpose |
|---|---|
| [project-overview.md](ai-context/context/project-overview.md) | Scope, pages, what is explicitly **out** of scope, non-functional targets |
| [architecture.md](ai-context/context/architecture.md) | Structure, layer boundaries, settled architectural decisions and their rationale |
| [content-model.md](ai-context/context/content-model.md) | The typed content layer — schema, accessors, integrity rules |
| [ui-rules.md](ai-context/context/ui-rules.md) | Design tokens, Tailwind v4 token strategy, component contract, a11y floor |
| [ui-registry.md](ai-context/context/ui-registry.md) | Every component, where it lives, its exact classes. **Check before building any component** |
| [code-standards.md](ai-context/context/code-standards.md) | Naming, TypeScript, React/Next rules, git conventions |
| [build-plan.md](ai-context/context/build-plan.md) | **The ticket board** — 39 tickets, 6 sprints, acceptance criteria |
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
- **`components/ui/` must not import from `content/`.** Enforced by ESLint. Domain-aware components go in `components/sections/`.
- **Check [ui-registry.md](ai-context/context/ui-registry.md) before building any component** — match what exists rather than inventing a near-duplicate.
- **Every list needs a designed empty state**, and every optional content field needs a rendering branch.
- **Breakpoints are 1000 / 760 / 460**, set by the design — not Tailwind's defaults.
- **Lighthouse against `next build && next start`**, never dev mode.
