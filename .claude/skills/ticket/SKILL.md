---
name: ticket
description: Start, guide, or close a ticket from the portfolio build plan. Use when the user names a ticket ("PORT-021", "let's do the button", "start the projects page", "what's next", "next ticket"), or asks to review or close one. Writes the blocks (components, lib, content) and guides the human through wiring them up in app/.
---

# Ticket

Work one ticket from [build-plan.md](../../../ai-context/context/build-plan.md).

> **Split the ticket at the seam** (CLAUDE.md → How this project is worked on). **You write the blocks** — anything below `src/app/`: components, `lib/`, content, tokens, config. **He writes the wiring** — anything in `src/app/`: pages, layouts, routes. Build your side complete, hand it over with a wiring brief, then guide him across. Never build a ticket that was not asked for.

## 1. Orient

1. Read the ticket in [build-plan.md](../../../ai-context/context/build-plan.md) — size, dependencies, acceptance criteria, "watch for" notes.
2. Read its row in [progress.md](../../../ai-context/context/progress.md) — it may be partly done. **Resume; do not restart.**
3. Check the Definition of Ready:
   - Dependencies `✔`?
   - Any needed design value still a `<value>` placeholder in [ui-rules.md](../../../ai-context/context/ui-rules.md) §3?
   - Any prerequisite in progress.md still `☐` (Resend account, images, domain)?
4. If something is missing, **say so before any work starts.** Half a ticket, blocked, is worse than a ticket not started.
5. Check nothing else is `▶`. One ticket at a time.

## 2. Brief

Before they write code, give them:

- **What this ticket produces** — in one sentence.
- **Where the files go** — exact paths per [architecture.md](../../../ai-context/context/architecture.md) §3.
- **The shape** — the key pattern, type signature, or structural decision. Point at [implementation-guide.md](../../../ai-context/context/implementation-guide.md) if it covers this ticket.
- **The trap** — the specific thing that goes wrong here (the ticket's "watch for", plus the gotchas in `CLAUDE.md`).
- **What is out of scope** — what belongs to a later ticket and must not creep in.

If it builds a component, **check [ui-registry.md](../../../ai-context/context/ui-registry.md) first** and say whether something existing should be reused or extended instead.

## 3. Build, then hand over

**Your half — the blocks:**

- Build each one complete. Stay at the scope asked; flag anything you had to decide rather than deciding it silently.
- Hand each over with a **wiring brief**: what it exports, its props, where it goes, what it expects, what breaks if wired wrong.
- Stop at `src/app/`. Do not wire it up yourself.

**His half — the wiring:**

- Explain the shape and the pitfall, then let him write the page.
- Review what he shares against [code-standards.md](../../../ai-context/context/code-standards.md) and [ui-rules.md](../../../ai-context/context/ui-rules.md) §5 — tokens only, `className` accepted, correct client/server boundary, real semantic elements, no `any`.
- Flag scope creep: "that's PORT-0xx, leave it."
- Common wiring faults to watch for: unawaited `params`/`searchParams`, `.sort()` mutating the shared imported array, a missing empty state, an optional content field with no rendering branch, `components/ui/` reaching into `content/`.
- If the ticket is genuinely blocked, mark it `⚠` with the symptom and pull the next `Ready` one rather than half-finishing it.

## 4. Close

A ticket is `✔` only when the full Definition of Done ([build-plan.md](../../../ai-context/context/build-plan.md) §1) is met. Walk it explicitly:

- [ ] Every acceptance criterion verified **in a browser** — not from memory, not from reading the code
- [ ] 1440 / 1024 / 768 / 375, no horizontal overflow
- [ ] Both themes
- [ ] Keyboard reachable, focus visible
- [ ] Tokens only; no `any`, no `@ts-ignore`, no stray `console.log`
- [ ] `npm run verify` green

Then update:

- [progress.md](../../../ai-context/context/progress.md) — status, notes, recount the Summary, add a Session Log row with a concrete **next step**
- [ui-registry.md](../../../ai-context/context/ui-registry.md) — any component built: real path, exact classes, status `built`, change-log entry
- [ui-rules.md](../../../ai-context/context/ui-rules.md) — any new token or styling pattern

**Never mark `✔` on the user's say-so alone if a criterion is visibly unmet.** Say which one, and leave it `▶`.

## Hard rules

- Never implement a ticket that was not asked for.
- Never mark a ticket done with an unmet acceptance criterion.
- Never build a component without checking the registry.
- Never leave a built component unregistered.
- Never let a "while I'm here" change expand a ticket's scope.
