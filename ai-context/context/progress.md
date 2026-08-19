# Progress Tracker

> **Living document. The single source of truth for what is actually built.**
> Update at the end of every session and whenever a ticket changes status.
> The plan lives in [build-plan.md](build-plan.md); this file is the record.

**Last updated:** 2026-08-19 · **Current sprint:** 0 — Foundation · **In progress:** none · **Next ticket:** PORT-002 (Ready)

---

## At a glance

**1 / 39 tickets complete · 3%** — one cell per ticket.

`█░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`

| Sprint | Progress | ✔ Done | ▶ | ⚠ | ☐ Left |
|---|---|---|---|---|---|
| **0 — Foundation** ◄ current | `█░░░░░░` | 1 / 7 | 0 | 0 | 6 |
| 1 — Content layer | `░░░░░░` | 0 / 6 | 0 | 0 | 6 |
| 2 — UI primitives | `░░░░░░` | 0 / 6 | 0 | 0 | 6 |
| 3 — Pages | `░░░░░░░░` | 0 / 8 | 0 | 0 | 8 |
| 4 — Contact wiring | `░░░░░` | 0 / 5 | 0 | 0 | 5 |
| 5 — Production | `░░░░░░░` | 0 / 7 | 0 | 0 | 7 |
| **Total** | | **1 / 39** | **0** | **0** | **38** |

---

## Board

`☐` Backlog · `▶` In Progress · `⚠` Blocked · `✔` Done

**Rule: at most one `▶` at a time.** If a ticket blocks, mark it `⚠` with the symptom and pull the next `Ready` one.

### Sprint 0 — Foundation

| ID | Ticket | Size | Status | Notes |
|---|---|---|---|---|
| PORT-001 | Scaffold Next.js app | S | ✔ | Next 16.3.1 at the repo root. `verify` green. Scaffold `.git` + `CLAUDE.md` discarded on the move; `AGENTS.md` kept deliberately (see decisions). |
| PORT-002 | Repository hygiene | S | ☐ | |
| PORT-003 | Port design tokens into Tailwind v4 | M | ☐ | ⚠️ Blocks nearly everything. Values already in ui-rules.md §2–3 — this is a port, not an extraction. |
| PORT-004 | Layout primitives | S | ☐ | |
| PORT-005 | App shell | L | ☐ | Nav array hardcoded here; swapped in PORT-011. Mobile menu split out to PORT-007. |
| PORT-006 | Route stubs + error boundaries | S | ☐ | Seven routes now — Skills was added. |
| PORT-007 | Mobile menu | M | ☐ | Focus trap + scroll lock + resize close. Design proven in prototype. |

### Sprint 1 — Content layer

| ID | Ticket | Size | Status | Notes |
|---|---|---|---|---|
| PORT-010 | Content types | S | ☐ | ⚠️ Blocks all content and pages. Types before content. |
| PORT-011 | Site config + nav swap | S | ☐ | Completes the PORT-005 hardcode. |
| PORT-012 | Project content | L | ☐ | Writing-heavy. Real copy, no placeholders. |
| PORT-013 | Experience, education, skills | M | ☐ | |
| PORT-014 | Uses content | S | ☐ | |
| PORT-015 | Content accessors | S | ☐ | |

### Sprint 2 — UI primitives

| ID | Ticket | Size | Status | Notes |
|---|---|---|---|---|
| PORT-020 | Button | M | ☐ | |
| PORT-021 | Card + ProjectCard | M | ☐ | |
| PORT-022 | Badge | S | ☐ | |
| PORT-023 | Field / Input / Textarea | M | ☐ | Accessibility-critical. |
| PORT-024 | Icons | S | ☐ | |
| PORT-025 | Component gallery | S | ☐ | Must 404 in production. |

### Sprint 3 — Pages

| ID | Ticket | Size | Status | Notes |
|---|---|---|---|---|
| PORT-030 | Home | M | ☐ | |
| PORT-031 | Projects index + filter | L | ☐ | Filter state in the URL. |
| PORT-032 | Project detail | L | ☐ | Test an unknown slug. |
| PORT-033 | About | M | ☐ | |
| PORT-034 | Resume | L | ☐ | Timeline responsive is the risky part. |
| PORT-035 | Uses | S | ☐ | |
| PORT-036 | Contact page UI | M | ☐ | UI only — no submission logic. |
| PORT-037 | Skills page | M | ☐ | Added after design review. Needs a `tier` field on SkillGroup. |

### Sprint 4 — Contact wiring

| ID | Ticket | Size | Status | Notes |
|---|---|---|---|---|
| PORT-040 | Validation schema | S | ☐ | |
| PORT-041 | Server Action | M | ☐ | |
| PORT-042 | Email delivery | M | ☐ | Needs a Resend account + verified domain. ⚠️ Scaffold `.gitignore` ignores `.env*`, which also catches `.env.example`; add `!.env.example` when creating it (code-standards §7). |
| PORT-043 | Spam + rate limiting | M | ☐ | |
| PORT-044 | Contact UX polish | S | ☐ | |

### Sprint 5 — Production

| ID | Ticket | Size | Status | Notes |
|---|---|---|---|---|
| PORT-050 | Metadata + OG images | M | ☐ | |
| PORT-051 | Sitemap, robots, JSON-LD | S | ☐ | |
| PORT-052 | Accessibility audit | M | ☐ | |
| PORT-053 | Performance audit | M | ☐ | Build output only, never dev mode. |
| PORT-054 | CI pipeline | S | ☐ | Can be done any time after PORT-002. |
| PORT-055 | Deploy | M | ☐ | Needs domain + Vercel account. |
| PORT-056 | Launch checklist | S | ☐ | |

---

## How to update this file

When a ticket's status changes:

1. Update its row's **Status** and add a note if anything is non-obvious.
2. Recount the **At a glance** table at the top — the counts and the bars. It is the only place totals live; there is no second summary to sync.
3. Add a Session Log row at the top.
4. If a component was built → update [ui-registry.md](ui-registry.md) the same session.
5. If a token or styling pattern was added → update [ui-rules.md](ui-rules.md).

**Do not mark a ticket `✔` until every acceptance criterion is verified in a browser and `npm run verify` passes.** Partial work stays `▶` with the gap written in Notes. A tracker that overstates progress is worse than no tracker.

---

## Prerequisites

External things needed before certain tickets can start. Sort these out early — they involve waiting on other parties.

| Item | Needed for | Status |
|---|---|---|
| Design finalized (prototype approved) | PORT-003 | ✔ |
| Project screenshots collected — Grades Repository, Project Gate, 2× OpalusPH sites | PORT-012 | ☐ |
| Resume PDF updated — **add the OpalusPH internship, name the Grades Repository System** | PORT-034 | ☐ |
| Profile photo | PORT-033 | ☐ |
| Resend account + verified sending domain | PORT-042 | ☐ |
| Domain purchased | PORT-055 | ☐ |
| Vercel account linked to GitHub | PORT-055 | ☐ |

---

## Blockers

*None recorded.*

| Date | Ticket | Symptom | Resolved |
|---|---|---|---|
| — | — | — | — |

---

## Decisions log

Settled decisions are in [build-plan.md](build-plan.md) §9. Record here only decisions made **during** the build, or a settled one being reopened with its reason.

| Date | Decision | Reason |
|---|---|---|
| 2026-08-17 | Scope reduced from enterprise-app template to a small Next.js portfolio | The original docs described an Express + Postgres + RBAC app. Wrong shape for a six-page static site. |
| 2026-08-17 | No blog / MDX | Not required for the goal; would roughly double the scope. |
| 2026-08-18 | Design direction: "workbench", fern green + coral | Stitch export was a cold brutalist terminal with an inverted radius scale. Reframed warm and rounded; mono kept as annotation only. |
| 2026-08-18 | Skills promoted to its own page | Requested as a nav item. Added PORT-037. |
| 2026-08-18 | Mobile menu split from the app shell | Focus trap, scroll lock and resize-close are real work that gets skipped when bundled. Added PORT-007. |
| 2026-08-18 | Breakpoints are 1000 / 760 / 460 | Set by the design, replacing the assumed 1024 / 768 / 375. |
| 2026-08-18 | Next.js app lives at the repo root | One repo, docs beside code. Scaffold into a temp dir and move in, so `create-next-app` does not refuse a non-empty directory. |
| 2026-08-19 | Scaffolded on Next.js **16.3.1**, not 15 | `create-next-app@latest` now ships 16. App Router, Server Components and Promise-based `params` are unchanged, so the docs still hold — but two CLI commands differ (next two rows). |
| 2026-08-19 | `lint` script is `eslint`, not `next lint` | `next lint` was removed in Next 16. implementation-guide.md §PORT-001 still shows the old form; the scaffold default is correct. |
| 2026-08-19 | `typecheck` is `next typegen && tsc --noEmit` | Next 16 generates `LayoutProps`/`PageProps` into `.next/types`, which is gitignored. Without `typegen`, `verify` fails on a clean clone because typecheck runs before build. |
| 2026-08-19 | Scaffold `.git` and `CLAUDE.md` deleted, `AGENTS.md` kept | `--no-git` was ignored and created a repo that would have clobbered ours. The scaffold `CLAUDE.md` is a one-line stub that would have replaced the project contract. `next dev` regenerates these: if `AGENTS.md` is absent it writes its rules block into `CLAUDE.md` instead, so keeping `AGENTS.md` is what protects it. |
| 2026-08-19 | `.vscode/settings.json` is committed | Formatter config changes the output every developer produces, so it is shared project config, not personal preference. |

---

## Open questions

| # | Question | Blocks | Answer |
|---|---|---|---|
| 1 | App at repo root or in an `app/` subfolder? | PORT-001 | **Answered 2026-08-18: repo root**, alongside `ai-context/`. All doc paths already assume this. |
| 2 | Which projects make the cut? | PORT-012 | **Answered:** Grades Repository System, CICT Project Gate, Construction Company Website, OpalusPH Company Website. One spare slot. |
| 3 | Sending domain for Resend? | PORT-042 | — |
| 4 | Keep the Uses page? | PORT-035 | Recommended: delete. Nothing real to put on it. |
| 5 | Which case study leads — Grades Repository or Project Gate? | PORT-032 | Both written in the prototype. Project Gate is technically stronger. |

---

## Session log

Newest first. The **next step** field matters most — write it so you could pick this up cold in three weeks.

| Date | Worked on | Outcome | Next step |
|---|---|---|---|
| 2026-08-19 | PORT-001 | Repo initialized and baseline commit `8e58a18` made. Next 16.3.1 scaffolded into a temp dir and moved to the repo root; scaffold `.git` and `CLAUDE.md` discarded first. tsconfig hardened with `noUncheckedIndexedAccess`, `verify` script added, Prettier + Tailwind class sorting configured and proven, format-on-save wired. `npm run verify` green; dev server confirmed in the browser. | **PORT-002** — repository hygiene. First action: the moved-in `README.md` is still the Next.js default, and the ESLint `ui/` import-boundary rule from code-standards §8 is not yet added to `eslint.config.mjs`. |
| 2026-08-18 | Design + content | Design prototype built and approved: 9 pages, both themes, burger nav, 2 full case studies. Real content written from Vernel's resume and background. Tokens recorded in ui-rules.md §2–3; ui-registry.md populated (all `designed`); PORT-007 and PORT-037 added. | Answer open question #1 (app location), then start **PORT-001** — scaffold per [implementation-guide.md](implementation-guide.md) → Sprint 0. |
| 2026-08-17 | Planning | All context docs rewritten for the Next.js portfolio scope. `database-design.md` replaced by `content-model.md`; `implementation-guide.md` added. | — |
