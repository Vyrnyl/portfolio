# Ticket

Work one ticket from [build-plan.md](../../../ai-context/context/build-plan.md).

> **You author every file. He places every one of them.** (CLAUDE.md → How this project is worked on.) Nothing you write in this skill goes to disk under `src/` — components, `lib/`, content and the `src/app/` wiring alike are handed over as complete paste-ready files. The `ai-context/` docs are the exception: those are the record, and you write them yourself.

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

## 3. Hand over the files

One file at a time, each as **create command → path → complete fenced block → what it does**.

Always give the PowerShell command that creates the file. He never types a path by hand:

```powershell
New-Item -ItemType File src/components/ui/button.tsx; code src/components/ui/button.tsx
```

Prefix `New-Item -ItemType Directory -Force <dir>` when the folder is new. No `-Force` on the file — it must refuse to overwrite. For an existing file, `code <path>` alone. Never redirect content into a file with `>` / `Out-File` / bare `Set-Content`: PowerShell writes UTF-16 + BOM and it will not parse. One command for a batch, then the blocks in dependency order.

**Complete** means complete. No `// ...rest unchanged`, no `{/* fill this in */}`, no diffs. He copies the block whole.

**What it does** describes the piece's role, not its stylesheet:

- What it is and what job it does on the page.
- What it exports, its props, and what each prop is *for*.
- Where it belongs and what it expects to be given.
- What visibly breaks if it is wired wrong or left out.
- Any real trap — a hydration rule, an ordering requirement, a dependency on something else existing.

Do **not** narrate class names or token mappings. That is what [ui-rules.md](../../../ai-context/context/ui-rules.md) and [ui-registry.md](../../../ai-context/context/ui-registry.md) are for, and you update both at close. Mention a class only when it is a genuine gotcha.

> The altitude test: if the explanation would still be useful to someone who never opens the CSS, it is right.

## 4. Guide the wiring

Anything in `src/app/` gets **numbered steps**, not prose:

- One action per step.
- Name the exact file to create or open, and the exact command to run.
- Write the click path where there is one — which DevTools panel, which tab, which button.
- Prefer the command that cannot go wrong. A one-line Console snippet beats hunting for a UI control. PowerShell is the shell here, so `Select-String`, not `grep`.
- End each step with **what he should see** — the observable result that means it worked.
- Never assume a step is trivial.

Then review what he reports back against [code-standards.md](../../../ai-context/context/code-standards.md) and [ui-rules.md](../../../ai-context/context/ui-rules.md) §5 — tokens only, `className` accepted, correct client/server boundary, real semantic elements, no `any`.

Common wiring faults: unawaited `params`/`searchParams`, `.sort()` mutating the shared imported array, a missing empty state, an optional content field with no rendering branch, `components/ui/` reaching into `content/`, a `dark:` variant used for colour.

Flag scope creep: "that's PORT-0xx, leave it."

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

Finish with the git commands for him to run. Do not run them.

## Hard rules

- Never write a file to disk under `src/`. Hand it over.
- Never implement a ticket that was not asked for.
- Never mark a ticket done with an unmet acceptance criterion.
- Never build a component without checking the registry.
- Never leave a built component unregistered.
- Never let a "while I'm here" change expand a ticket's scope.
