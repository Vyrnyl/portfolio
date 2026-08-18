# Project Overview

**Personal portfolio website** — a small, static-first marketing site that presents one person's work, background, and contact channel.

This document defines *scope*: what the site is, who reads it, and — just as importantly — what it deliberately is not. [build-plan.md](build-plan.md) operationalizes it into tickets.

---

## 1. What this is

A seven-page portfolio site. Its job is to make a visitor conclude, within about thirty seconds, that the owner is worth contacting. Everything else is subordinate to that.

The site is **content-driven, not data-driven**. There is no database, no login, no user accounts, no admin panel, and no user-generated content. Content is authored as typed TypeScript in the repo, so publishing an update means editing a file and pushing a commit.

There is exactly **one write path** in the entire system: the contact form.

## 2. Who reads it

There are no roles, no permissions, and no authentication. There is one audience with three intents:

| Reader | Arrives from | Wants to know | Leaves via |
|---|---|---|---|
| **Recruiter / hiring manager** | LinkedIn, job application, referral | Is this person real, senior enough, and available? | Resume page, contact form |
| **Engineering peer** | GitHub, a shared link, search | What did they actually build, and how? | Project detail, GitHub link |
| **Prospective client** | Referral, search | Can they solve my problem, and what does working with them look like? | Contact form |

Design consequence: **the resume and the project detail pages carry the weight**, and the contact form must never fail silently. The home page's only job is to route these three readers to the right page fast.

## 3. Pages

Seven routes. This list is the scope boundary — anything not on it needs an explicit decision to add.

| Route | Purpose | Rendering |
|---|---|---|
| `/` | Hero, short positioning statement, 2–3 featured projects, call to action | Static |
| `/projects` | All projects as cards, filterable by tag | Static |
| `/projects/[slug]` | One project: problem, approach, stack, outcome, links, screenshots | Static (pre-rendered per slug) |
| `/skills` | Three honest depth tiers + four "how I work" principles | Static |
| `/about` | Bio, photo, story, strengths and weaknesses | Static |
| `/resume` | Structured experience, education, and a PDF download | Static |
| `/uses` | Hardware, editor, tooling | Static |
| `/contact` | Contact form + direct links | Static shell + Server Action |

Plus `not-found.tsx`, `error.tsx`, `sitemap.ts`, `robots.ts`, and an OG image route.

## 4. Explicitly out of scope

Recorded so these never get quietly reopened mid-build:

- **Blog / MDX pipeline** — decided against. If it comes back it is a new epic, not a ticket.
- **CMS** — content lives in the repo as typed TS.
- **Database, ORM, migrations, seeds** — nothing persists between requests.
- **Authentication, roles, RBAC, audit logs** — no protected surface exists.
- **Comments, likes, view counters, newsletter** — no user-generated content.
- **i18n** — English only.
- **Client-side state manager** (Redux/Zustand) — the only client state is a form and a theme toggle.
- **Separate backend service** — the one server-side operation is a Next.js Server Action.

## 5. Non-functional targets

These are acceptance criteria, not aspirations. They are verified in the production-hardening epic.

| Concern | Target |
|---|---|
| Lighthouse (mobile) | Performance ≥ 95, Accessibility 100, Best Practices ≥ 95, SEO 100 |
| Largest Contentful Paint | < 1.8s on simulated 4G |
| Cumulative Layout Shift | < 0.05 |
| Accessibility | WCAG 2.1 AA — keyboard-complete, visible focus, 4.5:1 text contrast, `prefers-reduced-motion` honored |
| JS shipped to client | Only the contact form, theme toggle, and project filter. Every other page ships zero interactive JS. |
| Breakpoints verified | 1440 / 1000 / 760 / 460 |
| Build | `tsc --noEmit`, `eslint`, and `next build` all clean, enforced in CI |

## 6. Technology

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) | Static generation, file routing, Server Actions, image + font optimization in one tool |
| Language | TypeScript, `strict: true` | Content correctness is compile-time checked |
| Styling | Tailwind CSS v4 with CSS-variable tokens | Tokens live in one file; dark mode is a variable swap |
| Content | Typed `.ts` modules in `src/content/` | No infra, no fetch, no runtime failure mode |
| Runtime validation | Zod — **contact form only** | Untrusted input needs runtime checks; authored content does not |
| Email | Resend | Single API call from a Server Action |
| Icons | `lucide-react` | Tree-shakeable, consistent stroke weight |
| Fonts | `next/font` (self-hosted) | No layout shift, no third-party request |
| Hosting | Vercel | First-class Next.js target; preview deploys per branch |
| CI | GitHub Actions | Typecheck + lint + build on every push |

## 7. Design

**Settled.** An approved interactive prototype covers all seven pages plus a component gallery, in both themes. It is the visual contract — build to match it rather than redesigning in React.

The design began as a Google Stitch export (MCP) but was substantially reworked: Stitch produced a cold brutalist terminal with an inverted radius scale and no light theme. The direction is now **"workbench"** — a warm, green-biased neutral ground, fern green primary, coral as the single accent, generous radii, and monospace demoted to annotation only.

Tokens live in [ui-rules.md](ui-rules.md) §2–3. Components are catalogued in [ui-registry.md](ui-registry.md), all currently `designed`. Do not re-query the design for a value already recorded — that is how two components end up with two different greys.

## 8. Definition of success

The site is done when all of the following are true at the same time:

1. All seven routes render real content — no lorem ipsum, no placeholder projects.
2. A message submitted through the contact form arrives in the owner's inbox.
3. The non-functional targets in §5 are measured and met.
4. It is deployed to a custom domain with automatic deploys from `main`.
5. Adding a new project requires editing exactly one file.
