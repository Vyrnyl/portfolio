# Implementation Guide

The ordered walkthrough. [build-plan.md](build-plan.md) says *what* each ticket must satisfy; this file says *how* to approach it, with the commands and the code shapes for the parts that are genuinely fiddly.

**How to use this:** work one ticket at a time, top to bottom. Open the ticket in [build-plan.md](build-plan.md) for its acceptance criteria, then come here for the approach. The code below is a **skeleton to type and understand**, not a snippet to paste — the parts that matter are marked with why they are that way.

---

## Sprint 0 — Foundation

### PORT-001 · Scaffold

```bash
cd c:/WebDev/personal
npx create-next-app@latest portfolio-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```

You already have `c:/WebDev/personal/portfolio/` holding `ai-context/`. Two options — pick one now, because paths depend on it:

- **A (recommended):** scaffold into a temp folder, then move `src/`, `package.json`, `next.config.ts`, etc. into `portfolio/` alongside `ai-context/`. One repo, docs beside code.
- **B:** keep the app in a `portfolio/app/` subfolder. Cleaner separation, but every path in these docs shifts by one level.

These docs assume **A**.

Then tighten the config:

```jsonc
// tsconfig.json — add to compilerOptions
"strict": true,
"noUncheckedIndexedAccess": true   // makes array access T | undefined — catches real bugs
```

```jsonc
// package.json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "verify": "npm run typecheck && npm run lint && npm run build"
}
```

```bash
npm i -D prettier prettier-plugin-tailwindcss
```

```jsonc
// .prettierrc
{ "semi": true, "singleQuote": false, "printWidth": 100, "trailingComma": "all",
  "plugins": ["prettier-plugin-tailwindcss"] }
```

**Checkpoint:** `npm run verify` passes.

---

### PORT-003 · Tokens — the ticket most likely to bite

Two things go wrong here, and both are silent.

**Step 1 — extract from Stitch.** Pull the design through the MCP connection and read off: background, surface, border, text, muted text, brand, and the on-brand text color — for **both** light and dark. Also the type scale, radii, and section spacing.

**Step 2 — write them into [ui-rules.md](ui-rules.md) §3 before writing any CSS.** This feels like busywork. It is the thing that stops component #7 from having a slightly different grey than component #2.

**Step 3 — implement:**

```css
/* src/app/globals.css */
@import "tailwindcss";

/* Class-based dark mode. Without this, v4 uses prefers-color-scheme only
   and your toggle will not work. */
@custom-variant dark (&:where(.dark, .dark *));

:root {
  --bg: oklch(1 0 0);
  --surface: oklch(0.98 0.002 250);
  --border: oklch(0.9 0.004 250);
  --fg: oklch(0.2 0.01 250);
  --fg-muted: oklch(0.52 0.012 250);
  --brand: oklch(0.55 0.18 260);
  --brand-fg: oklch(1 0 0);
  --danger: oklch(0.55 0.2 25);
  --ring: var(--brand);
}

.dark {
  --bg: oklch(0.17 0.01 250);
  --surface: oklch(0.22 0.012 250);
  --border: oklch(0.3 0.014 250);
  --fg: oklch(0.96 0.003 250);
  --fg-muted: oklch(0.72 0.01 250);
  --brand: oklch(0.7 0.16 260);
  --brand-fg: oklch(0.17 0.01 250);
  --danger: oklch(0.68 0.18 25);
  --ring: var(--brand);
}

/* `inline` is REQUIRED here. Plain @theme resolves var() at build time and
   bakes the light value into the utility class — dark mode then silently
   does nothing. This one keyword is the whole trick. */
@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-border: var(--border);
  --color-fg: var(--fg);
  --color-fg-muted: var(--fg-muted);
  --color-brand: var(--brand);
  --color-brand-fg: var(--brand-fg);
  --color-danger: var(--danger);
  --color-ring: var(--ring);

  --font-sans: var(--font-inter);
  --font-mono: var(--font-jetbrains);

  --radius-btn: 0.5rem;
  --radius-card: 0.75rem;
}

@layer base {
  body { @apply bg-bg text-fg font-sans antialiased; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

The values above are **placeholders** — replace them with the real Stitch palette.

**The test that proves it works** (do not skip): put `<div className="bg-surface text-fg p-8">test</div>` on the home page, then add `class="dark"` to `<html>` in devtools. If the colors do not change, you used `@theme` instead of `@theme inline`.

Fonts:

```tsx
// src/app/layout.tsx
import { Inter, JetBrains_Mono } from "next/font/google";

// The next/font variable MUST NOT share a name with the theme token it feeds.
// `--font-sans: var(--font-sans)` is self-referential and resolves to nothing.
const sans = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });
// then: <html className={`${sans.variable} ${mono.variable}`}>
// and in @theme inline:  --font-sans: var(--font-inter);  --font-mono: var(--font-jetbrains);
```

---

### PORT-004 · Layout primitives

Three small components that prevent a large problem: spacing decided independently on every page.

```tsx
// src/components/layout/container.tsx
import { cn } from "@/lib/utils";

export function Container({ children, className }: Props) {
  return <div className={cn("mx-auto w-full max-w-shell px-gut", className)}>{children}</div>;
}
```

`cn()` first — you need it everywhere:

```bash
npm i clsx tailwind-merge
```

```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge classes so a caller's `className` wins over the component's default.
 *  Plain clsx would leave both `px-4` and `px-8` in the string; twMerge drops the loser. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

`max-w-shell` (1120px) and `px-gut` (24px, 18px below `md`) are tokens that already
exist — do not re-invent them as `max-w-5xl px-4 sm:px-6`, which is a different
number in a different place.

`Section` wraps its children in a `Container` itself, which is why the page example
below has no layout wrapper of its own. A section whose background must reach the
viewport edge opts out with `bleed` and places its own `Container` inside.

**Rule from here on:** no page file contains `max-w-*` or `px-*`. If one does, `Container` is being bypassed.

---

### PORT-005 · App shell

```bash
npm i next-themes lucide-react
```

The flash-of-wrong-theme problem, solved:

```tsx
// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning is REQUIRED — next-themes writes the class onto
    // <html> before React hydrates, so server and client markup differ by design.
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SkipLink />
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

The toggle must not render its icon until mounted, or the server renders the wrong one:

```tsx
"use client";
export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Reserve the space so the header does not shift when the icon appears.
  if (!mounted) return <div className="size-9" aria-hidden />;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
      className="…"
    >
      {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
```

Keep the client boundary tight: `Header` is a Server Component that renders `<NavLinks />` and `<ThemeToggle />`, and only those two carry `"use client"`.

The skip link — invisible until focused:

```tsx
<a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-btn focus:bg-brand focus:px-4 focus:py-2 focus:text-brand-fg">
  Skip to content
</a>
```

---

## Sprint 1 — Content

### PORT-010 → 015

Order matters and is not negotiable: **types → content → accessors**. Copy `types.ts` from [content-model.md](content-model.md) §2 verbatim, then write content against it, then write accessors.

The `satisfies` detail, and why it is not the same as a type annotation:

```ts
// `: Project[]` would widen slug to `string`.
// `satisfies` type-checks AND keeps the literal types, so tooling knows
// the exact set of slugs that exists.
export const projects = [ /* … */ ] satisfies Project[];
```

The accessor bug worth internalizing:

```ts
export function getAllProjects(): Project[] {
  // [...projects] is not defensive style — .sort() mutates in place, and
  // `projects` is module-level shared state. Sorting it directly would
  // reorder the array for every other importer, once, unpredictably.
  return [...projects].sort((a, b) => b.year - a.year);
}
```

**On PORT-012:** write the real project copy. Three projects with genuine problem/approach/outcome text beat six with placeholders — and every layout you build afterwards will be sized against text that actually exists.

---

## Sprint 2 — Primitives

Build in the gallery, not in a page. A component built inside `/about` absorbs `/about`'s assumptions and then breaks when reused.

### PORT-020 · Button, with the `asChild` pattern

You need a button that can also be a link without duplicating styles:

```tsx
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-btn font-medium transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-brand-fg hover:opacity-90",
  outline: "border border-border bg-transparent text-fg hover:bg-surface",
  ghost: "bg-transparent text-fg-muted hover:bg-surface hover:text-fg",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-base",
};

type Props = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
} & ({ href: string } | { href?: never } & React.ButtonHTMLAttributes<HTMLButtonElement>);

export function Button({ variant = "primary", size = "md", className, children, ...props }: Props) {
  const classes = cn(base, variants[variant], sizes[size], className);

  // A link and a button are different elements with different semantics.
  // Rendering the wrong one breaks keyboard behavior and screen readers.
  if ("href" in props && props.href) {
    return <Link href={props.href} className={classes}>{children}</Link>;
  }
  return <button className={classes} {...props}>{children}</button>;
}
```

Note `Record<Variant, string>` — add a variant to the union and TypeScript forces you to style it.

### PORT-023 · Field — the one to get right

Every form accessibility failure comes from hand-wiring these attributes. Centralize them once:

```tsx
import { useId } from "react";

type Props = {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: (props: {
    id: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
  }) => React.ReactNode;
};

export function Field({ label, error, hint, required, children }: Props) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-fg">
        {label}
        {required && <span className="text-danger" aria-hidden> *</span>}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {hint && <p id={hintId} className="text-sm text-fg-muted">{hint}</p>}
      {children({ id, "aria-describedby": describedBy, "aria-invalid": !!error })}
      {/* role="alert" so the error is announced the moment it appears */}
      {error && <p id={errorId} role="alert" className="text-sm text-danger">{error}</p>}
    </div>
  );
}
```

Used as: `<Field label="Email" error={errors?.email?.[0]} required>{(p) => <Input type="email" name="email" {...p} />}</Field>`

The render-prop shape exists so the wiring **cannot** be forgotten — there is no way to render the input without receiving the ids.

---

## Sprint 3 — Pages

Pages are assembly. A page file should read like an outline:

```tsx
// src/app/page.tsx
import { getFeaturedProjects } from "@/lib/content";

export const metadata: Metadata = { title: "Home", description: "…" };

export default function HomePage() {
  const featured = getFeaturedProjects();
  return (
    <>
      <Hero />
      <Section heading="Selected work">
        <ProjectGrid projects={featured} />
      </Section>
      <Cta />
    </>
  );
}
```

No padding, no max-width, no data shaping. If a page starts growing logic, that logic belongs in `lib/content.ts` or a section component.

### PORT-031 · Filter state in the URL

The instinct is `useState`. Use the URL instead — the filtered view becomes shareable and survives a refresh, and the back button works:

```tsx
"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function ProjectFilter({ tags }: { tags: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const active = params.get("tag");

  function select(tag: string | null) {
    const next = new URLSearchParams(params);
    if (tag) next.set("tag", tag); else next.delete("tag");
    // scroll:false keeps the viewport steady while filtering
    router.push(`${pathname}?${next}`, { scroll: false });
  }
  // …chips
}
```

The page reads `searchParams` and filters server-side, so the cards stay Server Components:

```tsx
export default async function ProjectsPage({
  searchParams,
}: { searchParams: Promise<{ tag?: string }> }) {   // Promise — Next 15+
  const { tag } = await searchParams;
  const projects = tag ? getProjectsByTag(tag) : getAllProjects();
  // …
}
```

### PORT-032 · Static params and per-project metadata

```tsx
export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary, images: [project.thumbnail.src] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();   // narrows `project` to Project below this line
  // …
}
```

`params` and `searchParams` are Promises in Next 15+. Forgetting `await` produces a confusing type error rather than an obvious one — this is the most common upgrade papercut.

**Test `/projects/nonsense` before closing the ticket.**

---

## Sprint 4 — Contact wiring

Build outward: schema → action → email → hardening. Each step is testable before the next exists.

### PORT-040 · Schema

```ts
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(200),
  message: z.string().trim().min(10, "Please write at least a sentence or two").max(2000),
  // Bots fill hidden fields. Humans never see this one.
  honeypot: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
```

Every string has a `.max()`. Without one, a 10MB message body reaches your email provider.

### PORT-041 · The action

```ts
"use server";

export type ActionResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

export async function submitContact(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the fields below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Honeypot filled → a bot. Return SUCCESS: never tell it what caught it.
  if (parsed.data.honeypot) return { ok: true };

  try {
    await sendContactEmail(parsed.data);
    return { ok: true };
  } catch (error) {
    // Log with context server-side; return something generic to the browser.
    // An error object reaching the client leaks internals and helps nobody.
    console.error("[contact] send failed", error);
    return { ok: false, message: "Something went wrong sending your message." };
  }
}
```

Wired with `useActionState`:

```tsx
"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

export function ContactForm() {
  const [state, action] = useActionState(submitContact, null);

  if (state?.ok) return <SuccessPanel />;

  return (
    <form action={action} className="space-y-6">
      {/* aria-live so the result is announced, not just displayed */}
      <div aria-live="polite" className="sr-only">
        {state?.ok === false ? state.message : ""}
      </div>
      {/* … Fields, wired to state.fieldErrors … */}
      <input type="text" name="honeypot" tabIndex={-1} autoComplete="off"
             aria-hidden="true" className="sr-only" />
      <SubmitButton />
    </form>
  );
}

// Separate component: useFormStatus only reads the status of a PARENT form,
// so calling it inside ContactForm itself would always return pending: false.
function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? "Sending…" : "Send message"}</Button>;
}
```

That `SubmitButton` split is a real gotcha, not a style choice.

### PORT-042 · Email + env

```ts
// src/lib/email.ts
import { Resend } from "resend";
import { env } from "@/lib/env";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendContactEmail(input: ContactInput) {
  const { error } = await resend.emails.send({
    from: "Portfolio <contact@yourdomain.com>",   // must be a verified domain
    to: env.CONTACT_TO_EMAIL,
    // Visitor input NEVER goes in the subject or headers — only the body.
    subject: "New portfolio contact message",
    replyTo: input.email,
    text: `From: ${input.name} <${input.email}>\n\n${input.message}`,
  });
  if (error) throw new Error(error.message);
}
```

`replyTo` is what makes replying from your inbox actually work.

**Test the env guard by deleting `RESEND_API_KEY` from `.env.local` and starting the server.** It should fail immediately and loudly. If it starts fine and fails on submission instead, `lib/env.ts` is not being imported at module load.

---

## Sprint 5 — Production

Order: metadata → SEO → a11y → perf → CI → deploy → checklist. Accessibility before performance, because a11y fixes sometimes change markup and invalidate perf measurements.

**Practical notes:**

- Run Lighthouse against `npm run build && npm start`, never `npm run dev` — dev-mode numbers are meaningless.
- Install axe DevTools and run it per route. It catches more than Lighthouse's a11y score does.
- `priority` goes on exactly one image per page: the LCP element. Putting it on several is worse than putting it on none.
- Verify the production build excludes `/gallery`: `npm run build && npm start`, then visit `/gallery` and confirm a 404.
- Test the contact form **on the production domain**. Resend domain verification is per-domain, and a preview deploy passing proves nothing about production.

---

## Working rhythm

Per ticket:

1. `git checkout -b feat/PORT-0xx-short-name`
2. Read the acceptance criteria in [build-plan.md](build-plan.md).
3. Build. Keep `npm run dev` open — look at it constantly, not at the end.
4. Check all four breakpoints and both themes **before** you consider it finished.
5. `npm run verify`.
6. Update [progress.md](progress.md) and, if a component was built, [ui-registry.md](ui-registry.md).
7. Commit, merge to `main`.

When stuck for more than ~20 minutes: mark the ticket `Blocked` in [progress.md](progress.md) with the specific symptom, and pull the next `Ready` ticket. Stuck time is rarely recovered by pushing harder on the same wall, and a written symptom is much easier to get help with than "the form is weird."

**Where to ask me for help, specifically:** a single component's implementation, a TypeScript error you cannot decode, a design decision inside a ticket, or a review of something you have built. The tickets are yours to execute — that is the point of building it this way.
