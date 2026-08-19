# Portfolio — Vernel Aquino

Personal portfolio site: home, projects (index + detail), skills, about, resume, uses, and contact.
Statically generated, no database, no CMS.

Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS v4 · deployed on Vercel.

## Getting started

Requires **Node 22** (see [.nvmrc](.nvmrc)).

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Scripts

| Script              | What it does                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------- |
| `npm run dev`       | Dev server with hot reload.                                                                 |
| `npm run build`     | Production build.                                                                           |
| `npm start`         | Serves the production build. **Use this for Lighthouse** — dev-mode scores are meaningless. |
| `npm run lint`      | ESLint, including the `components/ui/` import-boundary rule below.                          |
| `npm run typecheck` | `next typegen && tsc --noEmit`.                                                             |
| `npm run verify`    | typecheck → lint → build. Run before every push.                                            |

`typecheck` runs `next typegen` first on purpose. Next 16 generates route types (`PageProps`, `LayoutProps`)
into `.next/types`, which is gitignored — so on a fresh clone those types do not exist yet and `tsc` fails
before `build` ever gets a chance to create them.

## Where things live

```
src/content/      ← edit this to change what the site says
src/components/
  ui/             generic primitives (button, card, input) — know nothing about the content
  layout/         site chrome (header, footer, nav) — on every page
  sections/       domain-aware composites (project card, timeline, contact form)
src/lib/          content accessors, server actions, validation, utils
src/app/          routes
public/           static assets, project images, resume PDF
```

**To change site content, edit `src/content/`.** It is plain TypeScript validated at compile time —
there is no admin panel and nothing to log into.

One rule is enforced by ESLint rather than trust: **`components/ui/` may not import from `content/`.**
Primitives stay reusable; anything that knows about a `Project` belongs in `components/sections/`.

## Environment

Copy `.env.example` to `.env.local` and fill in the values. Only the contact form needs them —
the rest of the site runs without any configuration.

## Documentation

Planning docs live in [ai-context/context/](ai-context/context/):

- **[progress.md](ai-context/context/progress.md)** — what is actually built. The source of truth; start here.
- [project-overview.md](ai-context/context/project-overview.md) — scope, and what is deliberately out of scope.
- [architecture.md](ai-context/context/architecture.md) — structure and the reasoning behind it.
- [build-plan.md](ai-context/context/build-plan.md) — the ticket board.
