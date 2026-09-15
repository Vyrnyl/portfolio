# Code Standards

Conventions for this codebase. Pairs with [architecture.md](architecture.md) (structure) and [ui-rules.md](ui-rules.md) (styling).

---

## 1. Naming

| Kind | Convention | Example |
|---|---|---|
| Files & folders | kebab-case | `project-card.tsx`, `lib/actions/contact.ts` |
| React components | PascalCase | `ProjectCard`, `ThemeToggle` |
| Variables & functions | camelCase | `getFeaturedProjects` |
| Types & interfaces | PascalCase, no `I` prefix | `Project`, `ActionResult` |
| Constants | UPPER_SNAKE_CASE | `MAX_MESSAGE_LENGTH` |
| Env vars | UPPER_SNAKE_CASE | `RESEND_API_KEY` |
| Booleans | `is` / `has` / `should` prefix | `isPending`, `hasGallery` |
| Event handlers | `handle` prefix | `handleSubmit` |

One component per file; the file name is the kebab-case of the component name.

## 2. TypeScript

- `strict: true`. Also enable `noUncheckedIndexedAccess` — it catches the `array[0]` bug that otherwise ships.
- **No `any`.** Use `unknown` and narrow. If a third-party type forces it, `// eslint-disable-next-line` with a reason on the same line.
- Content files use `satisfies`, never a type annotation ([content-model.md](content-model.md) §1).
- Prefer `type` for unions and props; `interface` for object shapes that model a domain entity.
- Union types over string enums — `type ProjectStatus = "live" | "archived"` is simpler than an `enum` and erases at compile time.
- Do not export a type nobody else imports. Types live next to what they describe.
- No non-null assertion (`!`) except where a preceding check makes it provable, with a comment saying why.

## 3. React & Next.js

- **Server Components by default.** `"use client"` requires state, an effect, or a browser event handler. Nothing else justifies it.
- Push `"use client"` to the **leaf**. The contact *page* is a Server Component; only `<ContactForm>` is a client component.
- `async` Server Components for anything reading content — no `useEffect` data fetching anywhere in this codebase.
- Props are typed inline or as a local `Props` type. Destructure in the signature.
- `children` over configuration props when composing layout.
- Keys are stable identifiers (`project.slug`), never array indices.
- No `useEffect` for derived values — compute during render.
- `next/link` for internal navigation, `next/image` for every image. A raw `<img>` or `<a href="/…">` is a review failure.

```tsx
type Props = {
  project: Project;
  className?: string;
};

export function ProjectCard({ project, className }: Props) { … }
```

## 4. Imports

Order, separated by blank lines:

1. React / Next
2. Third-party
3. Internal aliases (`@/components`, `@/lib`, `@/content`)
4. Relative
5. Types (`import type`), last

Always the `@/` alias for cross-directory imports; relative only within the same folder. Always `import type` for type-only imports — it keeps them out of the runtime bundle.

## 5. Styling

Full contract in [ui-rules.md](ui-rules.md) §5. The short version:

- Tokens only. No hex, no `text-gray-*`, no arbitrary values.
- No `dark:` variants for color.
- `cn()` for conditional classes; every component accepts `className`.
- Class order: layout → box model → typography → color → state. Prettier's Tailwind plugin enforces this, so let it.

## 6. Validation & errors

- Zod schemas in `lib/validation/`, shared by client and server. **The server parse is authoritative.**
- Server Actions return a typed result; they never throw to the client:

```ts
export type ActionResult =
  | { ok: true }
  | {
      ok: false;
      message: string;
      fieldErrors?: Record<string, string[]>;
      values?: { name: string; email: string; message: string };
    };
```

- Catch, log server-side with context, return a generic message. Never leak an error object to the browser.
- **Never swallow an error to make a symptom disappear.** An empty `catch {}` is a bug.
- Every user-facing failure offers a next step — the contact form's failure state shows a `mailto:` fallback.
- **A failure returns what the visitor typed.** `values` was added 2026-09-15 by PORT-044, which found that a failed submit re-rendered three empty fields: the inputs are uncontrolled, so a re-render rebuilds them from `defaultValue`, and with nothing echoed back the visitor lost their message under the words "Please check the fields below." Echo only the fields the form actually displays — never a honeypot (it confirms to a bot that its value survived) and never a timing token (a stale one riding back defeats the minimum-time guard). The `values` member is shaped per-action rather than generic, because only the action knows which of its inputs are safe to show again.

## 7. Environment variables

All access goes through `lib/env.ts`, which throws at module load if a required var is missing:

```ts
function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const env = {
  RESEND_API_KEY: required("RESEND_API_KEY"),
  CONTACT_TO_EMAIL: required("CONTACT_TO_EMAIL"),
} as const;
```

- Never `process.env.X` inline outside this file.
- `.env.local` is gitignored. `.env.example` is committed with names and empty values.
- **There is no `SITE_URL`, and no `NEXT_PUBLIC_` variable at all.** This snippet carried `SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"` until 2026-09-15, and PORT-042 built it that way — then removed it, because **nothing ever read it.** Every URL on the site resolves from `site.url` (`src/content/site.ts`) through `SITE_ORIGIN` in `lib/seo.ts`, which feeds `metadataBase`, `absoluteUrl()` and all five JSON-LD `@id`/`url` values. Two sources of truth for one origin is a trap, and this one pointed the wrong way: changing the Vercel value and redeploying would have changed nothing while looking load-bearing.
- **If a `NEXT_PUBLIC_` variable is ever added, note what the prefix actually does** — it is a framework contract, not a naming convention. Next inlines the value into the client bundle at build time, so renaming one to drop the prefix does not make it private; it makes `process.env.<NAME>` resolve to `undefined`, usually silently. Nothing in this repo needs one today: the site origin is public by nature (it is the address the browser is already on) but is committed in `site.ts`, where it is reviewable and cannot be silently wrong.

## 8. Formatting

Prettier owns it — 2-space indent, semicolons, double quotes, trailing commas, 100-char lines. Plugins: `prettier-plugin-tailwindcss`. Never hand-format; never argue with the formatter.

ESLint: `next/core-web-vitals` + `next/typescript`, plus one project-specific rule enforcing the boundary from [architecture.md](architecture.md) §3:

```js
// components/ui/** must not import domain content
{
  files: ["src/components/ui/**"],
  rules: {
    "no-restricted-imports": ["error", {
      patterns: [
        { group: ["@/content/*", "@/lib/content"],
          message: "ui/ primitives must not know about domain content. Put this in components/sections/." },
      ],
    }],
  },
}
```

## 9. Comments

- Comment **why**, never **what**. `// sort a copy — the imported array is shared module state` earns its place; `// loop over projects` does not.
- JSDoc on exported functions in `lib/` and on non-obvious fields in `content/types.ts`.
- No commented-out code. Git remembers.
- `// TODO:` must name what unblocks it. A bare `TODO` is noise.

## 10. Git

- **Commit straight to `main`. No feature branches, no PRs.** Set 2026-09-03, replacing the branch-per-ticket rule this project started with: it is a solo build with no reviewer, so a branch bought review that never happened and added two steps to every ticket.
- **Know what that costs.** `main` auto-deploys, so a ticket is live the moment it is pushed and there is no preview URL in between. The check that used to happen on a branch now has to happen *before* the commit — which is why a ticket is not closed until `npm run verify` and the browser checks are green.
- Conventional commits, subject ≤ 72 chars, ticket ID in the body or subject:

```
feat(projects): add filterable project grid

Implements PORT-031. Filter state is held in the URL via ?tag=
so a filtered view is shareable and survives a refresh.
```

- One ticket per commit where practical. Never mix a refactor with a feature.
- **Never commit** `.env.local`, `node_modules/`, `.next/`, or an unresolved merge conflict.
- `main` is always deployable. If `npm run verify` fails, it does not get pushed.

## 11. The pre-push check

`npm run verify` = `tsc --noEmit && next lint && next build`.

This runs locally before every push and in CI on every push. A red build on `main` is treated as a stop-everything event, not a backlog item.
