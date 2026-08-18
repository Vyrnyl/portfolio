---
name: debug
description: Diagnose a bug in the portfolio site. Use when something is broken, erroring, rendering wrong, or behaving unexpectedly — "the page is blank", "dark mode isn't working", "the form does nothing", "hydration error", "styles look wrong", "the build fails", "debug this". Traces through the content → lib → component → render path.
---

# Debug

Find the actual root cause before changing anything. No guess-and-patch.

## 1. Establish the facts

- Exact error text or exact visual symptom. "Doesn't work" is not a starting point.
- Which route, which viewport, which theme, dev or production build?
- Did it ever work? What changed since?
- Is it a **build-time** failure (`tsc`/`next build`) or a **runtime** one? These have entirely different causes here — most of this codebase runs at build time.

## 2. Symptom → first place to look

| Symptom | Start at |
|---|---|
| **Dark mode does nothing** | `globals.css` — `@theme` instead of `@theme inline`. Confirmed by: toggling `.dark` on `<html>` in devtools changes nothing. |
| **Flash of wrong theme on load** | `suppressHydrationWarning` missing on `<html>`, or the toggle rendering before mount |
| **Hydration mismatch** | Something differing between server and client: `Date`, `Math.random`, `window`, or a theme value read before mount |
| **Colors look wrong / grey is off** | A hardcoded value instead of a token. Grep for `#`, `text-gray-`, `[--` in the component. |
| **Page blank, no error** | A Server Component returned nothing, or a `.map()` over an empty array with no empty state |
| **404 on a project page** | Slug mismatch between the URL and `content/projects.ts`, or `generateStaticParams` not returning it |
| **Type error on `params`/`searchParams`** | They are Promises in Next 15+. Missing `await`. |
| **Form submits but nothing happens** | Server Action returning early — check the zod parse result and whether the honeypot is being tripped |
| **Form always shows "not pending"** | `useFormStatus` called inside the same component as the `<form>`. It reads the **parent** form. Split the submit button out. |
| **Email never arrives** | `lib/env.ts` values, Resend domain verification, or an exception swallowed in the action's catch |
| **Layout shift on load** | Missing image `width`/`height`, or a font without `next/font` |
| **Content order changed unexpectedly** | `.sort()` called on the imported array instead of a copy — it mutated shared module state |
| **Overflow at 375px** | A fixed width, a long unbroken string, or a grid that never collapses |
| **Lint error about restricted imports** | A `components/ui/` file importing domain content. Move the component to `sections/`. |

## 3. Trace the path

The data path is short — walk it in order and confirm the value at each hop:

```
content/*.ts  →  lib/content.ts  →  page.tsx  →  section component  →  ui primitive
```

For the one runtime path:

```
form → zod (client) → Server Action → zod (server) → guards → email
```

`console.log` in a Server Component prints to the **terminal**, not the browser. Knowing which side you are on is usually half the diagnosis.

Narrow to a single layer before forming a hypothesis.

## 4. Fix

- Fix the **root cause**. If it is a workaround, say so explicitly and note what the real fix would be.
- Respect the boundary: no domain knowledge in `components/ui/`.
- Never swallow an error to make a symptom vanish. An empty `catch {}` is a bug, not a fix.
- Do not widen scope. A bug fix is not the moment to refactor the surrounding component.
- Match the surrounding style; do not reformat unrelated lines.

## 5. Verify

- Reproduce the original failing case — confirm it passes now.
- Check the happy path still works.
- Check both themes and all four breakpoints if the fix touched markup or styles.
- `npm run verify`.
- If the bug was in a ticket already marked `✔`, re-confirm its acceptance criteria still hold.

## 6. Record

- If it revealed unfinished work or an external blocker, add it to Blockers in [progress.md](../../../ai-context/context/progress.md).
- If a component's classes changed, update [ui-registry.md](../../../ai-context/context/ui-registry.md).
- If the cause was a recurring trap, add it to the Gotchas list in `CLAUDE.md` so it is only debugged once.
- Report: **root cause → fix → how it was verified.** State plainly if anything is still unresolved.
