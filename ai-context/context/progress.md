# Progress Tracker

> **Living document. The single source of truth for what is actually built.**
> Update at the end of every session and whenever a ticket changes status.
> The plan lives in [build-plan.md](build-plan.md); this file is the record.

**Last updated:** 2026-08-21 · **Current sprint:** 0 — Foundation · **In progress:** none · **Next ticket:** PORT-007 (Ready)

**Live (preview):** <https://vernel-portfolio.vercel.app> — auto-deploys on every push to `main`. Not the production domain; PORT-055 replaces it. This is the value PORT-011 needs for `site.url`.

---

## At a glance

**6 / 37 tickets complete · 16%** — one cell per ticket.

`██████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`

| Sprint | Progress | ✔ Done | ▶ | ⚠ | ☐ Left |
|---|---|---|---|---|---|
| **0 — Foundation** ◄ current | `██████░` | 6 / 7 | 0 | 0 | 1 |
| 1 — Content layer | `░░░░░` | 0 / 5 | 0 | 0 | 5 |
| 2 — UI primitives | `░░░░░░` | 0 / 6 | 0 | 0 | 6 |
| 3 — Pages | `░░░░░░░` | 0 / 7 | 0 | 0 | 7 |
| 4 — Contact wiring | `░░░░░` | 0 / 5 | 0 | 0 | 5 |
| 5 — Production | `░░░░░░░` | 0 / 7 | 0 | 0 | 7 |
| **Total** | | **6 / 37** | **0** | **0** | **31** |

---

## Board

`☐` Backlog · `▶` In Progress · `⚠` Blocked · `✔` Done

**Rule: at most one `▶` at a time.** If a ticket blocks, mark it `⚠` with the symptom and pull the next `Ready` one.

### Sprint 0 — Foundation

| ID | Ticket | Size | Status | Notes |
|---|---|---|---|---|
| PORT-001 | Scaffold Next.js app | S | ✔ | Next 16.3.1 at the repo root. `verify` green. Scaffold `.git` + `CLAUDE.md` discarded on the move; `AGENTS.md` kept deliberately (see decisions). |
| PORT-002 | Repository hygiene | S | ✔ | ESLint ui/ boundary rule added and proven firing. !.env.example negation added — .gitignore's .env* swallows it otherwise. |
| PORT-003 | Port design tokens into Tailwind v4 | M | ✔ | Colour, font, radius, container and gutter tokens shipped. §2 oklch was **wrong** as documented — re-derived from the §3 hexes, all 28 now round-trip exactly. Type scale deferred to PORT-004, shadows to PORT-021 (no dark values recorded). |
| PORT-004 | Layout primitives | S | ✔ | `cn()`, `Container`, `Section`, `Prose`. Type scale, section rhythm and the breakpoint override ported alongside. `Section` wraps its own `Container` — see decisions. Two values are provisional, never recorded in ui-rules §3: `--spacing-section-tight` and the heading line-heights. |
| PORT-005 | App shell | L | ✔ | `Header`, `NavLinks`, `Footer`, `SkipLink`, `ThemeToggle` + root layout wiring. Nav array and footer socials hardcoded here; swapped in PORT-011. **Nav collapses at `lg:` 1000**, not 760 — see decisions. Active-pill logic verified for Home only, because `/` is still the sole route; the `/projects/foo → Projects` case gets its real test in PORT-006. |
| PORT-006 | Route stubs + error boundaries | S | ✔ | Six routes + `not-found.tsx` + `error.tsx`. Scaffold `page.tsx` replaced — it had been shipping dead `bg-foreground`/`text-background` classes to the live preview. `Button` classes inlined twice pending PORT-020. Nested active-pill (`/projects/foo` → Projects) verified for the first time. |
| PORT-007 | Mobile menu | M | ☐ | Focus trap + scroll lock + resize close. Design proven in prototype. |

### Sprint 1 — Content layer

| ID | Ticket | Size | Status | Notes |
|---|---|---|---|---|
| PORT-010 | Content types | S | ☐ | ⚠️ Blocks all content and pages. Types before content. |
| PORT-011 | Site config + nav swap | S | ☐ | Completes the PORT-005 hardcode. |
| PORT-012 | Project content | L | ☐ | Writing-heavy. Real copy, no placeholders. |
| PORT-013 | Experience, education, skills | M | ☐ | |
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
| PORT-036 | Contact page UI | M | ☐ | UI only — no submission logic. |
| PORT-037 | Skills page | M | ☐ | Added after design review. Needs a `tier` field on SkillGroup. |

### Sprint 4 — Contact wiring

| ID | Ticket | Size | Status | Notes |
|---|---|---|---|---|
| PORT-040 | Validation schema | S | ☐ | |
| PORT-041 | Server Action | M | ☐ | |
| PORT-042 | Email delivery | M | ☐ | Needs a Resend account + verified domain. `.env.example` and its `!.env.example` negation in `.gitignore` already exist (PORT-002) — only `.env.local` needs creating here. |
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
| PORT-055 | Deploy | M | ☐ | Vercel account and auto-deploy already live (see Prerequisites). What is left is the **custom domain** and the production cutover — `*.vercel.app` cannot be made clean, the name is always built from project + scope. |
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
| Vercel account linked to GitHub | PORT-055 | ✔ — linked 2026-08-20. Live at <https://vernel-portfolio.vercel.app>, auto-deploys on push to `main`. Scope `cap1313`. |

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
| 2026-08-19 | Prototype **hex** is canonical; the oklch in ui-rules §2 is derived | §2 had been hand-converted and drifted — dark `fern` by L+0.037, light `coral` by L+0.047 and C+0.020, both visible on a large fill. Two sources of truth for one colour means the wrong one eventually wins. Hex is what was approved, so hex is the record and oklch is regenerated from it. |
| 2026-08-19 | Container tokens named `--container-shell` / `--container-measure`, not `max` / `prose` | `max-w-max` and `max-w-prose` are both Tailwind built-ins. Reusing those names silently shadows them and produces a bug that looks like a typo. |
| 2026-08-19 | Breakpoints **replace** Tailwind's scale rather than sitting beside it | Two scales means `md:` is 768px and the design's gate is 760px — eight pixels apart, indistinguishable in a browser, and the wrong one gets typed from habit. `xl`/`2xl` cleared too, so no variant points at a width the design never specified. |
| 2026-08-19 | `Section` wraps its children in a `Container`, with a `bleed` opt-out | Two sources disagreed: ui-rules §4's diagram nested them by hand, but implementation-guide's canonical page example (`<Section heading="Selected work">` with no wrapper) and build-plan's "optional heading slot" both assume Section owns the container — a heading slot outside the container would be misaligned against its own content. Followed the two that agree; corrected §4. |
| 2026-08-19 | Type scale tokens carry line-height, weight and tracking together | `--text-h-lg` plus its `--line-height`/`--font-weight`/`--letter-spacing` modifiers makes `text-h-lg` the whole heading style. The alternative — size only — means every heading re-types three more classes and they drift. |
| 2026-08-19 | `Prose` hand-rolled, not `@tailwindcss/typography` | The plugin ships its own grey ramp and would need re-tokenising rule by rule to respect the theme. That is more work than the dozen descendant selectors it replaces, and it adds a dependency that can override tokens silently. |
| 2026-08-20 | Nav collapses at **1000** (`lg:`), not 760 | ui-rules §4 said 760, build-plan PORT-007 said 1000. Seven nav items plus the name and toggle measure ~720px against a 760px header — roughly 40px of slack, inside the margin of error on text metrics. §4's own layout diagram also reserves an unbuilt header CTA slot, and PORT-011 makes adding a nav item a one-line change with no warning. Collapsing early is free; collapsing late breaks on a real device. ui-rules §4 corrected. |
| 2026-08-21 | **`/uses` page cut** before it was built | The page only works when each entry carries a real reason for the choice; without that it is a list of defaults that advertises having no opinions. Nothing was written yet, so the cheapest moment to cut is now. Drops the nav to six items, which also eases the 1000px collapse point. PORT-014 and PORT-035 retired — IDs not reused. |
| 2026-08-19 | next/font variables (`--font-inter`, `--font-jetbrains`) named separately from the theme tokens (`--font-sans`, `--font-mono`) | implementation-guide.md had them sharing a name, which makes `--font-sans: var(--font-sans)` — self-referential, resolves to nothing, and falls back to the system font with no error. Guide corrected. |

---

## Open questions

| # | Question | Blocks | Answer |
|---|---|---|---|
| 1 | App at repo root or in an `app/` subfolder? | PORT-001 | **Answered 2026-08-18: repo root**, alongside `ai-context/`. All doc paths already assume this. |
| 2 | Which projects make the cut? | PORT-012 | **Answered:** Grades Repository System, CICT Project Gate, Construction Company Website, OpalusPH Company Website. One spare slot. |
| 3 | Sending domain for Resend? | PORT-042 | — |
| 4 | Keep the Uses page? | PORT-035 | **Answered 2026-08-21: cut.** Vernel has no strong tooling opinions to write up, and PORT-014's "a note explaining *why*" bar makes a thin version worse than no page. PORT-014 and PORT-035 retired; `/uses` out of the nav, §3, the registry and the content model. Re-adding later is one content file, one page, one nav line. |
| 5 | Which case study leads — Grades Repository or Project Gate? | PORT-032 | Both written in the prototype. Project Gate is technically stronger. |
| 6 | Custom breakpoints (1000 / 760 / 460) as `@theme --breakpoint-*` overrides, or named additions alongside Tailwind defaults? | PORT-004 | **Answered 2026-08-19: outright override.** `--breakpoint-*: initial` clears Tailwind's scale, then `sm: 460 / md: 760 / lg: 1000`. `xl`/`2xl` stay cleared. Verified in the compiled CSS. |
| 7 | `coral` on `ground` measures **3.97:1** in light mode — below AA for the error text it is specified for. Darken coral, or restrict it to icons/borders with a separate error-text colour? | PORT-023, PORT-052 | Dark mode passes at 6.99:1. `faint` is also below AA (2.94 light / 4.23 dark) but is metadata-only. |

---

## Session log

Newest first. The **next step** field matters most — write it so you could pick this up cold in three weeks.

| Date | Worked on | Outcome | Next step |
|---|---|---|---|
| 2026-08-21 | PORT-006 · closed | Six route stubs (`/`, `/projects`, `/skills`, `/about`, `/resume`, `/contact`), each with a unique `metadata.title` and a mono eyebrow naming the ticket that fills it, plus `not-found.tsx` and a Client Component `error.tsx` with a working `reset`. **Sprint 0's exit criterion is met** — the site is navigable end to end in both themes with no real content. `npm run verify` green; the build prerenders all six routes plus `/_not-found` as static, matching architecture.md §7. Browser-verified by Vernel at 1440/1024/768/375 in both themes: no horizontal overflow, focus rings visible on the 404 buttons in both themes, the **nested active pill holds** (`/projects/anything` keeps Projects highlighted — the `startsWith` branch PORT-005 closed without being able to test), and the error page renders correctly under the dismissed dev overlay. The scaffold `page.tsx` is gone; grep confirms zero `bg-foreground`/`text-background`/`text-zinc-*` left in `src/`, and zero test throws. Two things deliberately not built: `/projects/[slug]` (PORT-032) and `global-error.tsx`, which is the real gap — `error.tsx` does not catch a root-layout failure. | **PORT-007** — mobile menu, the last Sprint 0 ticket. Below `lg:` (1000) the nav is currently just absent, so on a phone the site has no navigation at all beyond the footer. Needs a focus trap, scroll lock, and close-on-resize; the design is already proven in the prototype. Watch: the trigger button belongs in `Header` beside `ThemeToggle`, and the menu is a Client Component while `Header` stays a Server Component. Two known debts to carry, not fix here: the `Button` classes inlined in `not-found.tsx`/`error.tsx` (PORT-020 sweeps them, grep `PORT-020 replaces this`), and `global-error.tsx` still missing. |
| 2026-08-21 | Session catch-up · scope cut | Tracker verified against the repo and found accurate for PORT-001→005; `src/app/` confirmed to hold **no route folders**, so six of the seven nav links 404 on the live preview right now. Two stale docs corrected: CLAUDE.md's "Current state" was a full session behind (said 4/7, next PORT-005), and architecture.md §3's app tree was missing `skills/page.tsx` entirely — Skills has had its own page since 2026-08-18. **Open question 4 answered: the `/uses` page is cut.** Removed from project-overview §3, architecture (tree + rendering table), content-model (`UsesGroup`/`UsesItem` interfaces and the `uses.ts` row), ui-registry (`UsesList`), and the CLAUDE.md intro. PORT-014 and PORT-035 marked CUT in build-plan; totals recut 39 → 37 tickets, ~58h → ~56h. Also confirmed the live bug: `src/app/page.tsx` is still the untouched scaffold and references `bg-foreground`/`text-background`, neither of which exists in `globals.css` — grepped and confirmed zero hits. | **PORT-006** — route stubs and error boundaries. One `src/` change is outstanding before it starts: remove the `{ href: "/uses", label: "Uses" }` line from the `NAV` array in `src/components/layout/header.tsx:18`, which still points at the cut page. Then create the six route folders under `src/app/` (`projects`, `projects/[slug]`, `skills`, `about`, `resume`, `contact`), replace the scaffold `page.tsx`, and add `not-found.tsx` (designed, route home) plus `error.tsx` (Client Component, working reset). Each page needs placeholder `metadata` with a unique title. Push a branch and check the Vercel preview on the phone before merging. |
| 2026-08-20 | Preview deploy + working agreement | **Site is live** at <https://vernel-portfolio.vercel.app>, imported from GitHub with zero config changes; every push to `main` now redeploys automatically, and a pushed branch gets its own preview URL. Verified independently from the served HTML: title, header, `#main`, footer socials and all seven nav links present. Confirmed on a real phone — sticky blurred header holds, nav correctly absent below 1000, theme follows the OS and a manual override sticks, no horizontal drift. **A clean `*.vercel.app` name is not obtainable** — Vercel builds it from project + scope, so a presentable URL means the custom domain in PORT-055. Two working-agreement changes recorded in CLAUDE.md and the `ticket` / `add-component` skills: (1) **Claude writes nothing to disk under `src/`** — every file is handed over paste-ready and Vernel places it, with explanations describing a component's role rather than its class names, and wiring given as numbered steps; (2) **every handover opens with the `New-Item` + `code` command** that creates the file, so no path is ever typed by hand. | **PORT-006** — route stubs and error boundaries. First action: create the six missing route folders under `src/app/` and replace the scaffold `page.tsx`, which still references `bg-foreground`/`text-background` — classes PORT-003 deleted, so the home page renders unstyled in production right now. Then `not-found.tsx` (designed, with a route home) and `error.tsx` (Client Component, working reset). Push a branch first and check the Vercel preview URL on the phone before merging. |
| 2026-08-20 | PORT-005 · closed | App shell shipped: `Header`, `NavLinks`, `Footer`, `SkipLink`, `ThemeToggle` in `components/layout/`, wired into `src/app/layout.tsx` with `ThemeProvider`, `suppressHydrationWarning` and `<main id="main" tabIndex={-1}>`. Browser-checked in both themes at 1440/1024/768/375 and confirmed: no theme flash on hard reload, choice survives a reload, skip link appears on first Tab and moves focus into the page, sticky blurred header does not overlap, no horizontal scrollbar. `npm run verify` green. Three things resolved along the way: the **nav collapse breakpoint** was contradicted across two docs and is now settled at `lg:` 1000 with ui-rules §4 corrected; `ThemeToggle` had to use `useSyncExternalStore` because Next 16's React Compiler lint rejects the `useState`+`useEffect` mount gate the impl-guide prescribes; and **`lucide-react` v1 has no brand icons**, so footer socials are text links. ui-rules §6 rewritten — it still listed pre-token names (`rounded-btn`, `bg-bg`, `bg-brand`, `border-danger`) that do not exist in `globals.css`. Working agreement changed again mid-session: **Claude now writes nothing to disk under `src/`** — every file is handed over paste-ready and Vernel places it; explanations describe a component's role, not its class names; wiring gets numbered steps. Recorded in CLAUDE.md and the `ticket` / `add-component` skills. | **PORT-006** — route stubs and error boundaries. Create the seven routes from project-overview.md §3 as stub pages, plus a designed `app/not-found.tsx` and a Client Component `app/error.tsx` with a working reset button. Each page needs a placeholder `metadata` with a unique title. First real chance to verify the nav active-pill on a non-root route and that all seven links navigate. `src/app/page.tsx` is still the Next.js scaffold default and is full of non-token classes — PORT-030 replaces it, but PORT-006 may want a stub in the meantime. |
| 2026-08-20 | PORT-004 · closed | Browser-checked at 1440/1024/768/375 in both themes and passed: no horizontal scrollbar at 375 (the long URL wraps — `break-words` was added to `Prose` for exactly that), gutter visibly steps 24px → 18px across 761/759, the `dark` class flips ground, text and link together, and the focus ring on a `Prose` link is visible in both themes. `npm run verify` green. Working agreement amended mid-ticket and recorded in CLAUDE.md: **wiring is now handed over as complete paste-ready files with an explanation**, not a skeleton to fill in — he places and assembles it, Claude still never writes into `src/app/`. | **PORT-005** — app shell. Header (sticky, backdrop-blur, bottom border), Footer, SkipLink, ThemeToggle, and the `<main id="main">` wrapper in `src/app/layout.tsx`. Needs `next-themes` and `lucide-react` installed. Nav array is hardcoded here and swapped for site config in PORT-011. The mobile menu is **not** in this ticket — that is PORT-007. Watch `suppressHydrationWarning` on `<html>` and the toggle rendering no icon before mount. |
| 2026-08-19 | PORT-004 | `cn()` in `src/lib/utils.ts` (`clsx` + `tailwind-merge` installed), `Container` and `Section` in `components/layout/`, `Prose` in `components/ui/`. Three token groups ported alongside them in a plain `@theme` block (no var() indirection, so `inline` is not needed): the **type scale** with line-height/weight/tracking bundled per step, **`--spacing-section`** rhythm, and the **breakpoint override**. Open question 6 answered — Tailwind's scale is cleared outright and replaced with 460/760/1000; proven in the compiled CSS via a throwaway probe file (`@media (min-width:760px)` for `md:`, `xl:` emitting nothing), probe deleted. Utilities confirmed emitting: `.max-w-shell{max-width:1120px}`, `.px-gut{padding-inline:var(--gut)}`, `.py-section`, `.text-h-md`. Docs corrected in the same pass: ui-rules §4 still specified `max-w-5xl px-4 sm:px-6 lg:px-8` and "Tailwind defaults" for breakpoints, both pre-token leftovers contradicting §3; implementation-guide's Container snippet had the same stale classes. `npm run verify` green. **Not yet browser-checked** — nothing renders these components until a page does. | **Wire a throwaway page** into `src/app/page.tsx`: a `Section` with a heading, a `Prose` block with h2/p/ul/a/code inside it, and a second `Section spacing="tight"`. Check 1440/1024/768/375 in both themes — gutter must step 24px → 18px as you cross 760, and nothing may scroll horizontally. Then PORT-004 closes and **PORT-005** (app shell) starts. Provisional values to eyeball against the prototype while you are there: `--spacing-section-tight` (`clamp(36px, 5.5vw, 64px)`) and the heading line-heights, neither of which was recorded in ui-rules §3. |
| 2026-08-19 | PORT-003 | Tokens shipped in `src/app/globals.css` + `next/font` wiring in `layout.tsx` (Inter → `--font-inter`, JetBrains Mono → `--font-jetbrains`). **The oklch in ui-rules §2 was wrong** — hand-converted and drifting up to L±0.047 on dark `fern` and light `coral`; re-derived from the §3 hexes and verified by round-tripping the compiled CSS hex fallbacks (28/28 exact). `@theme inline` proven in the build output (`.bg-ground{background-color:var(--ground)}`, not a baked literal). Browser-checked in Chrome at 1440/1024/768/375 in both themes: colours flip, no horizontal overflow, gutter 24px→18px below 760, both fonts loading. Contrast measured — the three AC pairs pass; `coral`/`ground` and `faint`/`ground` do not (logged as open question 7). ui-rules §1–3 updated; implementation-guide font example fixed (it told you to self-reference `--font-sans`). `npm run verify` green. | **PORT-004** — layout primitives. First action: `npm i clsx tailwind-merge`, then `src/lib/utils.ts` with `cn()`. `Container` uses `max-w-shell px-gut` and `Prose` uses `max-w-measure` — those tokens already exist, do not re-invent them. Answer open question 6 (breakpoints) before writing the first responsive class. |
| 2026-08-19 | PORT-002 | README rewritten for the real project. `.env.example` added with a `!.env.example` negation in `.gitignore` — the scaffold's `.env*` glob swallows it otherwise. `.nvmrc` pinned to 22. Folder skeleton from architecture.md §3 created with `.gitkeep`. ESLint `components/ui/` import-boundary rule added **and proven firing** against a throwaway import. Resume moved to `public/resume.pdf` via `git mv`. Pushed to github.com/Vyrnyl/portfolio (public, `main` default). `npm run verify` green. | **PORT-003** — design tokens. Port the `globals.css` block from [ui-rules.md](ui-rules.md) §2: raw vars on `:root`/`.dark`, semantic tokens in **`@theme inline`** (plain `@theme` bakes in the light values and dark mode silently dies). Prove it by toggling `.dark` on `<html>` and watching a `bg-ground text-ink` element change before closing. |
| 2026-08-19 | PORT-001 | Repo initialized and baseline commit `8e58a18` made. Next 16.3.1 scaffolded into a temp dir and moved to the repo root; scaffold `.git` and `CLAUDE.md` discarded first. tsconfig hardened with `noUncheckedIndexedAccess`, `verify` script added, Prettier + Tailwind class sorting configured and proven, format-on-save wired. `npm run verify` green; dev server confirmed in the browser. | **PORT-002** — repository hygiene. First action: the moved-in `README.md` is still the Next.js default, and the ESLint `ui/` import-boundary rule from code-standards §8 is not yet added to `eslint.config.mjs`. |
| 2026-08-18 | Design + content | Design prototype built and approved: 9 pages, both themes, burger nav, 2 full case studies. Real content written from Vernel's resume and background. Tokens recorded in ui-rules.md §2–3; ui-registry.md populated (all `designed`); PORT-007 and PORT-037 added. | Answer open question #1 (app location), then start **PORT-001** — scaffold per [implementation-guide.md](implementation-guide.md) → Sprint 0. |
| 2026-08-17 | Planning | All context docs rewritten for the Next.js portfolio scope. `database-design.md` replaced by `content-model.md`; `implementation-guide.md` added. | — |
