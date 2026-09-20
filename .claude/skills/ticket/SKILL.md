# Ticket

Work one ticket from [build-plan.md](../../../ai-context/context/build-plan.md).

> **You author and place every file. He decides and reviews.** (CLAUDE.md → How this project is worked on, set 2026-09-15.) You write to disk yourself with Write/Edit — components, `lib/`, content, tokens, config and the `src/app/` wiring alike, and the `ai-context/` docs too. **Git stays his**: you hand over the stage/commit/push commands and never run one that writes. `git diff` before committing is now the moment the code gets read, so the close-out has to tell him what to look for.

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

Before handing over any file, give him:

- **What this ticket produces** — in one sentence.
- **The files it takes**, as a short table: path, what each one is, and whether it is a Client Component and why.
- **The trap** — the specific thing that goes wrong here (the ticket's "watch for", plus the gotchas in `CLAUDE.md`).
- **What is out of scope** — what belongs to a later ticket and must not creep in.

If it builds a component, **check [ui-registry.md](../../../ai-context/context/ui-registry.md) first** and say whether something existing should be reused or extended instead.

## 3. Write the files

**Write for a new file, Edit for a change to an existing one.**

**Prefer a targeted `Edit`.** The old rule was always-the-whole-file, because a fragment had to be *located* before it could be applied and locating it was the step that went wrong — stale line numbers after a format-on-save, a near-duplicate block accepting a paste silently, a half-applied multi-hunk edit. That failure mode is gone: you locate and apply the change yourself with a tool that fails loudly on an ambiguous match. A targeted edit also produces a diff he can read — one line changed shows as one line, not as a 200-line rewrite hiding the real change. Reach for `Write` on an existing file only when the change genuinely is most of it.

**A new file is written whole** — no `// ...rest unchanged`, no `{/* fill this in */}`, no holes.

**Never write a file by redirecting into it** (`>`, `Out-File`, `Set-Content`). PowerShell writes UTF-16 with a BOM and the file will not parse — and `-Encoding utf8` does not save you, because `Get-Content` has already misread the file on the way in. That round trip once corrupted 13 em dashes in `layout.tsx` and still compiled green. Write and Edit are UTF-8 and do not round-trip.

Then, for each file you touched, say **what it is for** (new) or **what changed** (edit), in **one or two plain sentences**:

- What job the piece does on the page, or what moved and why.
- A real trap, and only when it would actually bite — a hydration rule, an ordering requirement, a dependency on something else existing.

Do **not** give a prop-by-prop tour, and do **not** narrate class names or token mappings. The props are readable in the file, and the detail belongs in [ui-registry.md](../../../ai-context/context/ui-registry.md) and [ui-rules.md](../../../ai-context/context/ui-rules.md), both of which you update at close. Name a class only when it is the gotcha itself.

> The test: if it runs past two sentences without naming a trap, it is a registry entry wearing a handover's clothes.

## 3b. Review your own work

Nobody is retyping the code any more, so the second pair of eyes has to be yours. Before calling a file done, read it back against [code-standards.md](../../../ai-context/context/code-standards.md) and [ui-rules.md](../../../ai-context/context/ui-rules.md) §5 — wrong layer, missing empty state, unawaited `params`, `.sort()` mutating shared module state, `components/ui/` reaching into `content/`, a `dark:` variant used for colour. **Say plainly what you found, with the reason; a fault you fixed silently is one he cannot learn from.** Flag your own scope creep too: "that's PORT-0xx, leaving it."

## 4. Wire it, and guide only what he does himself

You wire `src/app/` yourself. Numbered steps are for **what he has to do at a keyboard you are not driving** — setting an env var in a dashboard, checking something on a real device, a click path in DevTools. Where that applies, give steps, not prose:

- One action per step.
- Name the exact file to create or open, and the exact command to run.
- Write the click path where there is one — which DevTools panel, which tab, which button.
- Prefer the command that cannot go wrong. A one-line Console snippet beats hunting for a UI control. PowerShell is the shell here, so `Select-String`, not `grep`.
- End each step with **what he should see** — the observable result that means it worked.
- Never assume a step is trivial.

Common wiring faults to check your own work for: unawaited `params`/`searchParams`, `.sort()` mutating the shared imported array, a missing empty state, an optional content field with no rendering branch, `components/ui/` reaching into `content/`, a `dark:` variant used for colour.

If the ticket is genuinely blocked, mark it `⚠` with the symptom and pull the next `Ready` one rather than half-finishing it.

## 5. Close

A ticket is `✔` only when the full Definition of Done ([build-plan.md](../../../ai-context/context/build-plan.md) §1) is met. Walk it explicitly:

- [ ] Every acceptance criterion verified **in a browser** — not from memory, not from reading the code
- [ ] 1440 / 1024 / 768 / 375, no horizontal overflow
- [ ] Both themes
- [ ] Keyboard reachable, focus visible
- [ ] Tokens only; no `any`, no `@ts-ignore`, no stray `console.log`
- [ ] `npm run verify` green

**Run the browser checks yourself.** Playwright is available via `npx playwright` with Chromium already downloaded — drive `next dev`, exercise every acceptance criterion at 1440 / 1024 / 768 / 375 in both themes, and report what you observed. Screenshots go in the scratchpad, not the repo.

Escalate to him only what a script cannot settle: a real phone or touch device, whether something *looks* right against the prototype, or a major flow he asks to feel for himself. Give those as a **numbered list with the expected result on each** and wait for his answers. Do not accept "done" as evidence for them.

Then update, yourself:

- [progress.md](../../../ai-context/context/progress.md) — status, notes, recount the At-a-glance table, add a Session Log row with a concrete **next step**
- [ui-registry.md](../../../ai-context/context/ui-registry.md) — any component built: real path, exact classes, status `built`, change-log entry
- [ui-rules.md](../../../ai-context/context/ui-rules.md) — any new token or styling pattern

Then close out. **Name every path you touched**, so he can find them in the diff, say what each is for or what changed, and **point him at what to review** — the judgment call, the trap, the load-bearing line, not "please review the diff".

Finish with the git commands for him to run. **Do not run them.** He reads `git diff` before committing, and since `main` auto-deploys that is the last checkpoint before the live site.

## Hard rules

- Never run a git command that writes. Hand him the commands.
- Never write a file by shell redirection. Write and Edit only.
- Never implement a ticket that was not asked for.
- Never mark a ticket done with an unmet acceptance criterion.
- Never build a component without checking the registry.
- Never leave a built component unregistered.
- Never let a "while I'm here" change expand a ticket's scope.
