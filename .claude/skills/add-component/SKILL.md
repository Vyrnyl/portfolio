---
name: add-component
description: Guide building a new UI component for the portfolio without duplicating an existing one. Use when creating any button, card, badge, form field, section, or other reusable piece (e.g. "how do I build the project card", "add a badge component", "I need a timeline"). Enforces registry-first lookup, token-only styling, correct placement, and registry update.
---

# Add Component

Enforces the discipline that keeps a component set coherent: **check first, tokens only, register after.**

> **You author it and you place it; he decides and reviews.** (CLAUDE.md → How this project is worked on, set 2026-09-15.) Brief the decisions first — registry hit or miss, which layer it belongs in, which tokens it uses — then write the file yourself: `Write` for a new component, a targeted `Edit` to change an existing one, never a shell redirect. Say what it *does* in one or two plain sentences (its job on the page, or what changed and why), name its path so he can find it in the diff, and point him at anything worth his eye. Do not give a prop-by-prop tour and do not narrate class names — that detail belongs in ui-rules.md and ui-registry.md, which you update yourself.

## 1. Check the registry — always first

Read [ui-registry.md](../../../ai-context/context/ui-registry.md) before anything else.

- **Exists** → reuse it. Match its exact classes. A near-duplicate under a new name is how a design system rots.
- **Close** → add a variant or prop to the existing one. Prefer a variant over a new component.
- **`designed` but not `built`** → build that one; do not design from scratch.
- **Nothing fits** → continue below.

## 2. Decide where it goes

[architecture.md](../../../ai-context/context/architecture.md) §3–4:

| It is… | Location |
|---|---|
| Generic; knows nothing about projects/jobs/skills | `src/components/ui/` |
| Site chrome on every page | `src/components/layout/` |
| Presents a domain concept | `src/components/sections/` |

**`components/ui/` importing from `@/content` or `@/lib/content` is a lint error.** If the component needs to know what a `Project` is, it belongs in `sections/`. This is the codebase's only structural boundary — do not blur it.

## 3. The shape

- **Server by default.** `"use client"` requires state, an effect, or a browser event handler — and goes on the smallest possible subtree.
- **Typed props**, variants as union types, not loose strings. `Record<Variant, string>` for the class maps so adding a variant forces styling it.
- **Accepts `className`**, merged last with `cn()` so callers can adjust layout without a new variant.
- **Tokens only** ([ui-rules.md](../../../ai-context/context/ui-rules.md) §3). No hex, no `text-gray-*`, no arbitrary `[...]`, no `dark:` for color. If a value is needed and no token covers it, **add the token to ui-rules.md §3 first.**
- **Real elements.** `<button>`, `<a>`, `<nav>`, `<ul>` — never a `<div onClick>`.
- **Focus visible**: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg`. Removing an outline without replacing it is a defect.
- **Images** via `next/image`, explicit dimensions, meaningful `alt`.
- **Every state the component can reach** is styled: hover, focus, active, disabled, error, empty, loading.

## 4. Verify

Render it in the gallery (`/gallery`, PORT-025) in **every variant and state**, then check:

- 1440 / 1024 / 768 / 375 — no overflow at any width
- Both light and dark
- Tab to it, operate it by keyboard only
- Contrast holds in both themes

A component verified only inside the one page that uses it is not verified.

## 5. Register — required, same session

Add a row to the right section of [ui-registry.md](../../../ai-context/context/ui-registry.md):

| Field | Value |
|---|---|
| Component | Its name |
| Status | `built` |
| File | Real path |
| Props / variants | The union values |
| Exact classes | Every class including variant and state modifiers |

Add a Change Log entry with today's date. If it introduced a new token or pattern, update [ui-rules.md](../../../ai-context/context/ui-rules.md) §3 or §6 too.

## Hard rules

- Never build without checking the registry.
- Never leave a built component unregistered — the next session will duplicate it.
- Never hardcode a value a token covers.
- Never put domain knowledge in `components/ui/`.
- Never ship a component whose only verification was "it looked fine on the page I built it for."
