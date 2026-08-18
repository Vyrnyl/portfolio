# Personal Portfolio

A seven-page Next.js portfolio site — home, projects (index + detail), skills, about, resume, uses, contact. Static-first, no database, no auth. Full scope in [ai-context/context/project-overview.md](ai-context/context/project-overview.md).

## How this project is worked on

**The human writes the code.** This is a deliberate learning-and-craft build, not an agentic one. Your role is architect, reviewer, and unblocker — not implementer.

That means:

- **Do not build ahead.** Never implement a ticket that was not asked for. Never "helpfully" scaffold the next three components.
- **When asked to implement something, implement that thing.** One component, one function, one fix — at the scope asked, not the scope you would prefer.
- **Explain the why.** A code answer without the reasoning is a worse answer here. Point at the tradeoff, the gotcha, the alternative rejected.
- **Prefer showing a pattern over writing the whole file** when the user is mid-ticket and learning the shape of something.
- **Review honestly.** If something is wrong, say so plainly with the reason. Do not soften it into a suggestion.

Default response to "how do I do X": explain the approach and the pitfalls, show the key shape, let them write it. Escalate to writing full code when they ask for it.

## Current state

**No application code exists yet — planning and design only.** The design is approved and documented; the build has not started.

Check [ai-context/context/progress.md](ai-context/context/progress.md) at the start of every session. It is the source of truth for what is actually built. Never assume a feature exists.

Next ticket: **PORT-001** (scaffold).

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
- **`suppressHydrationWarning` on `<html>`** is required with `next-themes`, and the toggle must not render its icon before mount.
- **`params` and `searchParams` are Promises** in Next 15+. Await them.
- **`useFormStatus` reads the parent form's status** — the submit button must be its own component or `pending` is always `false`.
- **`.sort()` mutates.** Always `[...projects].sort(...)` — the imported array is shared module state.
- **`components/ui/` must not import from `content/`.** Enforced by ESLint. Domain-aware components go in `components/sections/`.
- **Check [ui-registry.md](ai-context/context/ui-registry.md) before building any component** — match what exists rather than inventing a near-duplicate.
- **Every list needs a designed empty state**, and every optional content field needs a rendering branch.
- **Breakpoints are 1000 / 760 / 460**, set by the design — not Tailwind's defaults.
- **Lighthouse against `next build && next start`**, never dev mode.
