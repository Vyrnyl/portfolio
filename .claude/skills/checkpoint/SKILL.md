---
name: checkpoint
description: Save or resume where the portfolio build left off. Use when the user says "save progress", "checkpoint", "update the tracker", "where did we stop", "what's next", "catch me up", or when wrapping up or starting a work session. Writes state into ai-context/context/progress.md (SAVE) or reads it back to resume (RESUME).
---

# Checkpoint

All state lives in [progress.md](../../../ai-context/context/progress.md). This skill keeps it honest.

Pick the mode from what was asked:

- **SAVE** — "save progress", "update the tracker", end of session.
- **RESUME** — "where did we stop", "what's next", "catch me up", start of session.

Ambiguous → RESUME first, then ask whether to continue that work.

---

## SAVE

### 1. Verify against the repo, not memory

- Check which files were actually created or modified this session.
- For each touched ticket, determine its **true** status against the acceptance criteria in [build-plan.md](../../../ai-context/context/build-plan.md).
- **Do not mark `✔` unless every criterion is genuinely met** — including the browser check at all four breakpoints and `npm run verify`. Partial work stays `▶` with the gap named in Notes.
- If the user says a ticket is done but a criterion is visibly unmet, say which one and leave it `▶`.

### 2. Update progress.md

- Header: `Last updated`, `Current sprint`, `In progress`, `Next ticket`
- The ticket rows: status symbol and notes
- **Blockers** table — the specific symptom, enough to act on cold
- **Open questions** — record any that got answered
- **Prerequisites** — tick anything now sorted
- **Summary** — recount every row
- **Session log** — new row at the top

The **next step** field matters most. Name the ticket ID and the first concrete action, so it can be picked up with zero context.

### 3. Update siblings

- Components built → [ui-registry.md](../../../ai-context/context/ui-registry.md): status `built`, real path, exact classes, change-log entry.
- New tokens or styling patterns → [ui-rules.md](../../../ai-context/context/ui-rules.md).

### 4. Report

Briefly: what was recorded, each touched ticket's new status, and the written next step.

---

## RESUME

### 1. Read

[progress.md](../../../ai-context/context/progress.md) — header, newest session-log row, any `▶`/`⚠` tickets, Blockers, Open questions, Prerequisites.

### 2. Verify the record matches reality

Trackers drift. Spot-check that files named in recent entries exist and are in the state described. **If the record and the code disagree, trust the code and correct progress.md.**

### 3. Brief

- **Where we are** — sprint, ticket, completion count
- **Last done** — from the newest session-log row
- **Next** — the recorded next step
- **In the way** — open blockers, unanswered questions, or unmet prerequisites gating that ticket

### 4. Continue

Pick up at the recorded next step via the `ticket` skill. If a prerequisite or open question gates it, raise that before starting rather than guessing an answer.
