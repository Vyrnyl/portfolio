# Architecture

A single Next.js application. No separate backend, no database, no service layer. Scope and constraints come from [project-overview.md](project-overview.md).

---

## 1. The shape of the system

```
┌─────────────────────────────────────────────────────────────┐
│  BUILD TIME                                                  │
│                                                              │
│  src/content/*.ts  ──►  lib/content.ts  ──►  Server          │
│  (typed literals)       (accessors)          Components      │
│                                                   │          │
│                                                   ▼          │
│                                          Pre-rendered HTML   │
└─────────────────────────────────────────────────────────────┘
                                                   │
                                                   ▼
┌─────────────────────────────────────────────────────────────┐
│  RUNTIME (the only dynamic path)                             │
│                                                              │
│  Contact form (Client)                                       │
│    └─► zod parse (client, UX)                                │
│         └─► Server Action                                    │
│              └─► zod parse (server, AUTHORITATIVE)            │
│                   └─► spam guard + rate limit                │
│                        └─► Resend API                        │
│                             └─► typed ActionResult ──► UI    │
└─────────────────────────────────────────────────────────────┘
```

Everything above the divider is static HTML generated at build time. Everything below is one form submission. That asymmetry is the whole architecture — treat any proposal that adds a second runtime path as a scope change.

## 2. Architectural decisions

Each of these is settled. The *why* is recorded so it does not get re-argued.

| # | Decision | Why | Rejected alternative |
|---|---|---|---|
| A1 | **Static generation by default.** No page opts into dynamic rendering. | A portfolio's content changes on commit, not on request. Static means it cannot break at runtime. | SSR — adds a failure mode for zero benefit. |
| A2 | **Server Components by default.** `"use client"` is an exception requiring a reason. | Keeps JS off the wire. Only 3 components need interactivity. | Client-first — ships a framework to render static text. |
| A3 | **Content as typed TS literals**, validated by `satisfies` at compile time. | Authored-by-me content needs *compile-time* safety, not *runtime* validation. Zero bundle cost, zero parse step, and a typo fails the build instead of the page. | Zod-parsed content — pays runtime cost to re-check what `tsc` already proved. MDX — a parsing layer for content with no long-form prose. |
| A4 | **Zod for the contact form only.** | Form input is the only untrusted data in the system. That is exactly where runtime validation belongs. | Validating everything — ceremony without threat model. |
| A5 | **Server Action, not a Route Handler**, for the contact form. | Progressive enhancement, typed end to end, no fetch/JSON/error-shape plumbing to hand-write. | `app/api/contact/route.ts` — more code, less type safety. |
| A6 | **No global state manager.** | Theme = `next-themes`. Form = `useActionState`. Filter = `useState` + URL param. Nothing is shared across routes. | Zustand/Redux — a store with nothing to store. |
| A7 | **Three layers, not seven.** `content → lib → components`. | The controller/service/repository split exists to isolate a database. There is no database. Adding those layers would mean writing a `ProjectRepository` that returns an array literal. | Enterprise module pattern — pure overhead here. |

## 3. Directory structure

```text
portfolio/
├── .github/workflows/ci.yml
├── ai-context/context/            # planning docs (this folder)
├── public/
│   ├── images/projects/
│   └── resume.pdf
└── src/
    ├── app/
    │   ├── layout.tsx             # root: fonts, theme provider, header, footer
    │   ├── page.tsx               # /
    │   ├── globals.css            # Tailwind import + @theme tokens
    │   ├── not-found.tsx
    │   ├── error.tsx
    │   ├── opengraph-image.tsx
    │   ├── sitemap.ts
    │   ├── robots.ts
    │   ├── projects/
    │   │   ├── page.tsx
    │   │   └── [slug]/
    │   │       ├── page.tsx
    │   │       └── not-found.tsx
    │   ├── about/page.tsx
    │   ├── resume/page.tsx
    │   ├── uses/page.tsx
    │   └── contact/page.tsx
    │
    ├── components/
    │   ├── ui/                    # generic primitives — know nothing about the domain
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── badge.tsx
    │   │   ├── input.tsx
    │   │   ├── textarea.tsx
    │   │   ├── field.tsx
    │   │   └── prose.tsx
    │   ├── layout/                # site chrome — appears on every page
    │   │   ├── header.tsx
    │   │   ├── footer.tsx
    │   │   ├── nav-links.tsx
    │   │   ├── container.tsx
    │   │   ├── section.tsx
    │   │   ├── skip-link.tsx
    │   │   └── theme-toggle.tsx   # "use client"
    │   └── sections/              # domain-aware composites — know about Project, Job…
    │       ├── hero.tsx
    │       ├── project-card.tsx
    │       ├── project-grid.tsx
    │       ├── project-filter.tsx # "use client"
    │       ├── skill-list.tsx
    │       ├── timeline.tsx
    │       ├── contact-form.tsx   # "use client"
    │       └── cta.tsx
    │
    ├── content/                   # THE CONTENT LAYER — edit these to publish
    │   ├── types.ts               # Project, Job, Skill, SiteConfig…
    │   ├── site.ts
    │   ├── projects.ts
    │   ├── experience.ts
    │   ├── skills.ts
    │   └── uses.ts
    │
    └── lib/
        ├── content.ts             # accessors: getAllProjects, getProjectBySlug…
        ├── actions/
        │   └── contact.ts         # "use server"
        ├── validation/
        │   └── contact.ts         # zod schema, shared by client + server
        ├── rate-limit.ts
        ├── email.ts               # Resend client
        ├── env.ts                 # typed, fail-fast env access
        ├── seo.ts                 # metadata builders
        └── utils.ts               # cn()
```

### The one rule that keeps this structure honest

**`components/ui/` must not import from `content/` or `lib/content.ts`.**

A `Button` that knows what a `Project` is has stopped being a primitive. Domain knowledge lives in `components/sections/`. This is the only structural boundary in the codebase, so it is worth enforcing — an ESLint `no-restricted-imports` rule covers it.

## 4. Layer responsibilities

| Layer | Owns | Never does |
|---|---|---|
| `app/**/page.tsx` | Route composition, `metadata`, `generateStaticParams`. Should read like a table of contents. | Business logic, styling beyond layout, direct array manipulation |
| `lib/content.ts` | Reading, filtering, sorting, and shaping content for pages | Rendering, fetching, mutating |
| `content/*.ts` | The actual data, typed via `satisfies` | Logic of any kind — these are literals |
| `components/sections/` | Presenting a domain concept (a project, a job, a skill set) | Knowing which route it is on |
| `components/ui/` | One generic, reusable visual primitive | Knowing anything about the domain |
| `lib/actions/` | The single server-side mutation | Rendering, or being called from a Server Component |

## 5. The content layer

Content is a typed module, not a data source. The pattern for every content file:

```ts
// src/content/projects.ts
import type { Project } from "./types";

export const projects = [
  {
    slug: "inventory-system",
    title: "Inventory Management System",
    // …
  },
] satisfies Project[];
```

`satisfies` rather than `: Project[]` is deliberate — it type-checks the literal **and** preserves the narrow literal types, so `getProjectBySlug` can be typed precisely and `slug` autocompletes.

Pages never import `content/` directly. They go through `lib/content.ts`, so that sorting rules and "featured" logic live in one place:

```ts
// src/lib/content.ts
export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => b.year - a.year);
}
export function getFeaturedProjects(limit = 3): Project[] { … }
export function getProjectBySlug(slug: string): Project | undefined { … }
export function getAllTags(): string[] { … }
```

Full schema in [content-model.md](content-model.md).

## 6. The one write path

```
contact-form.tsx  ("use client", useActionState)
   │  FormData
   ▼
lib/actions/contact.ts  ("use server")
   │  1. zod safeParse         → field errors on failure
   │  2. honeypot check        → silent success (do not tell a bot it failed)
   │  3. rate limit by IP      → 429-style message
   │  4. lib/email.ts sendContactEmail()
   ▼
ActionResult  { ok: true } | { ok: false; message: string; fieldErrors?: … }
   │
   ▼
form re-renders with the result — success panel or inline field errors
```

Rules for this path:

- The **server** parse is authoritative. The client parse exists only to avoid a round trip on obvious mistakes. Never trust client validation.
- The action returns a **typed discriminated union**, never throws to the client. Unexpected errors are caught, logged server-side, and returned as a generic message — never as a stack trace.
- `RESEND_API_KEY` is read through `lib/env.ts`, which throws at module load if it is missing. Fail at boot, not on a visitor's submission.
- The form must work with the submit button disabled by pending state, and must announce its result to screen readers (`aria-live`).

## 7. Rendering strategy per route

| Route | Strategy | Notes |
|---|---|---|
| `/`, `/about`, `/resume`, `/uses` | Static | Fully pre-rendered, zero client JS beyond the theme toggle |
| `/projects` | Static | Filter is client-side over pre-rendered cards; tag reflected in the URL via `?tag=` |
| `/projects/[slug]` | Static per slug | `generateStaticParams` from `getAllProjects()`; `generateMetadata` per project; unknown slug → `notFound()` |
| `/contact` | Static shell | Only the `<form>` subtree is a Client Component |

## 8. SEO & metadata

- Root `layout.tsx` sets `metadataBase`, title template, description, and default OpenGraph.
- Every page exports `metadata`; `/projects/[slug]` uses `generateMetadata`.
- `lib/seo.ts` holds builders so no page hand-assembles an OG object.
- `opengraph-image.tsx` generates social cards at build time via `next/og`.
- `sitemap.ts` and `robots.ts` are generated from the content layer — a new project appears in the sitemap automatically.
- JSON-LD `Person` schema in the root layout; `CreativeWork` on project detail pages.

## 9. Error handling

| Failure | Handling |
|---|---|
| Unknown project slug | `notFound()` → `projects/[slug]/not-found.tsx` |
| Unknown route | `app/not-found.tsx` |
| Render error | `app/error.tsx` — a real designed page, not a white screen |
| Contact form invalid input | Inline field errors, form state preserved |
| Email provider down | Generic apology **plus** a visible `mailto:` fallback so the visitor is never dead-ended |
| Missing env var | Throws at module load, fails the build/boot |

## 10. Security

Small surface, but it is not zero:

- **Server Action input** — zod-parsed with `.max()` bounds on every string field before anything touches the email body.
- **Rate limiting** — per-IP, in-memory. Adequate for a portfolio's traffic; documented as such so nobody mistakes it for distributed protection.
- **Spam** — honeypot field plus a minimum time-to-submit. No CAPTCHA unless spam actually materializes.
- **Email injection** — visitor input goes only in the body, never in headers, subject, or the `to` field.
- **Secrets** — `.env.local` only, never committed. `.env.example` documents the names with no values.
- **No `dangerouslySetInnerHTML`** anywhere. Content is authored, but the habit is what protects you later.
