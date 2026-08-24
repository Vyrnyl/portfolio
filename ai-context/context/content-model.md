# Content Model

> Replaces the former `database-design.md`. There is no database. This document specifies the **typed content layer** in `src/content/` — the schema every content file must satisfy, and the accessors pages read it through.

Rationale for the approach is [architecture.md](architecture.md) §2 (A3) and §5.

---

## 1. Principles

1. **Types first.** `src/content/types.ts` is written before any content file. A content file that does not satisfy its type fails `tsc`, which fails the build.
2. **`satisfies`, never `:`.** `satisfies Project[]` checks the shape while leaving the value's own inferred type in place — so a field declared as a union (`status`, `tier`, `platform`) stays narrow to the literal actually written (`"live"`, not `ProjectStatus`), which is what `:` would throw away.
   **It does not narrow `string` fields.** `slug` and `tags` widen to `string`, because that is how they are declared. `(typeof projects)[number]["slug"]` is `string`, not a union of the real slugs, and `getProjectsByTag("raect")` compiles. Narrowing those needs `as const satisfies`, which propagates `readonly` and breaks the §4 accessors' `Project[]` returns — measured, rejected, and recorded in [progress.md](progress.md) (2026-08-22). Slug uniqueness and tag casing are therefore §5 by-eye rules, not compile errors.
3. **Slugs are identity.** A slug is a permanent URL. Changing one breaks an inbound link — rename only with a deliberate redirect.
4. **No logic in content files.** They export literals. Sorting, filtering, and "featured" selection live in `lib/content.ts`.
5. **Optional means optional in the UI too.** Every `?` field needs a rendering branch. If a project has no `liveUrl`, the button must not render as a dead link.
6. **Images are referenced, not embedded.** Paths point into `public/images/`; every image records its intrinsic `width`/`height` so `next/image` reserves space and CLS stays at zero.

---

## 2. `src/content/types.ts`

The complete schema. **Built 2026-08-22 (PORT-010) — `src/content/types.ts` is now canonical.** The block below is the spec it was built from and matches it in shape; the file carries fuller JSDoc. Change the file first, then reconcile this block.

```ts
// ---------- shared ----------

/** A URL-safe permanent identifier. Changing one breaks inbound links. */
export type Slug = string;

export interface ImageAsset {
  /** Path under /public, e.g. "/images/projects/inventory-hero.png" */
  src: string;
  /** Required. Describe the content, not the fact that it is an image. */
  alt: string;
  width: number;
  height: number;
}

export interface Link {
  label: string;
  href: string;
  /** Set for links leaving the site — drives target/rel and an external icon. */
  external?: boolean;
}

// ---------- site ----------

export interface SocialLink {
  platform: "github" | "linkedin" | "email" | "x" | "dribbble";
  href: string;
  /** Screen-reader label, e.g. "GitHub profile". */
  label: string;
}

export interface SiteConfig {
  name: string;
  /** Role line under the name, e.g. "Full-stack developer". */
  role: string;
  /** One sentence. Used as the default meta description. */
  tagline: string;
  /** Absolute production URL, no trailing slash. Used for metadataBase. */
  url: string;
  email: string;
  location: string;
  /** Order here is the order in the header nav. */
  nav: Link[];
  socials: SocialLink[];
  /** Path to the downloadable CV under /public. */
  resumePdf: string;
}

// ---------- projects ----------

export type ProjectStatus = "live" | "archived" | "in-progress";

export interface Project {
  slug: Slug;
  title: string;
  /** One line for the card. Max ~100 chars or cards wrap unevenly. */
  summary: string;
  /** Sort key for the index, and shown on the card. */
  year: number;
  status: ProjectStatus;
  /** Promotes to the home page. Keep 2-3 true at a time. */
  featured: boolean;
  /** Drives the tag filter. Reuse existing tags before inventing one. */
  tags: string[];
  /** Named technologies, shown on the detail page. */
  stack: string[];
  thumbnail: ImageAsset;
  /** Wide image for the detail page header. Falls back to thumbnail. */
  cover?: ImageAsset;
  liveUrl?: string;
  repoUrl?: string;

  /** Detail-page narrative. All three required — this is the substance. */
  problem: string;
  approach: string;
  outcome: string;

  /** Optional extras for richer detail pages. */
  highlights?: string[];
  gallery?: ImageAsset[];
  role?: string;
  /** e.g. "3 months", "Ongoing" */
  duration?: string;
}

// ---------- experience ----------

export interface Job {
  company: string;
  role: string;
  /** ISO "YYYY-MM". Sort key. */
  start: string;
  /** ISO "YYYY-MM", or null for a current role. */
  end: string | null;
  location: string;
  /** 2-4 achievement bullets. Lead with the outcome, not the task. */
  bullets: string[];
  stack?: string[];
}

export interface Education {
  institution: string;
  credential: string;
  start: string;
  end: string | null;
  note?: string;
}

// ---------- skills ----------

/** Honest depth, not a percentage. Drives grouping and dot weight on /skills. */
export type SkillTier = "confident" | "working" | "learning";

export interface SkillGroup {
  tier: SkillTier;
  /** The tier's heading, e.g. "Confident", "Working knowledge", "Learning now" */
  label: string;
  /** One line saying what this tier actually means to a reader. */
  blurb: string;
  items: string[];
}

/** A practice principle on /skills — how I work, not what I know. */
export interface Practice {
  icon: IconName;
  title: string;
  body: string;
}
```

`IconName` (PORT-024) is a union of every icon the site can render, declared above `Practice` in the real file. `src/lib/icons.ts` pairs each member with a real lucide-react component — `Record<IconName, LucideIcon>` there fails the build the moment the two lists disagree, in either direction.

---

## 3. Files

| File | Exports | Feeds |
|---|---|---|
| `site.ts` | `site: SiteConfig` | Header, footer, root metadata, contact page, JSON-LD |
| `projects.ts` | `projects` (satisfies `Project[]`) | `/`, `/projects`, `/projects/[slug]`, sitemap |
| `experience.ts` | `jobs`, `education` | `/resume`, `/about` |
| `skills.ts` | `skillGroups`, `practices` | `/skills`, `/about`, `/resume` |

---

## 4. Accessors — `src/lib/content.ts`

**Built 2026-08-22 (PORT-015). This section now describes the real file** — read `src/lib/content.ts` for the authoritative version; what follows is the contract and the reasoning.

The only module allowed to import **queryable** content — `projects`, `jobs`, `education`, `skillGroups` — from `src/content/`. Pages import those from here, so sorting, filtering and "featured" selection live in one place.

**`site` is the exception, and imports directly.** It is a config singleton with nothing to query; wrapping it in a `getSite()` that returns a constant would be the "repository that returns an array literal" [architecture.md](architecture.md) §2 A7 rejects. `Header` and `Footer` import `@/content/site` (PORT-011). The ESLint boundary rule is unaffected either way — it restricts `components/ui/` only, and domain-aware components belong in `components/layout/` or `components/sections/`.

### The nine exports

| Function | Returns | Notes |
|---|---|---|
| `getAllProjects()` | `Project[]` | Newest first. The canonical order everywhere projects are listed. |
| `getFeaturedProjects(limit = 3)` | `Project[]` | Featured only, newest first, hard-capped. |
| `getProjectBySlug(slug)` | `Project \| undefined` | Never throws. The route calls `notFound()`. |
| `getProjectSlugs()` | `string[]` | For `generateStaticParams`. Unsorted. |
| `getAllTags()` | `string[]` | Unique, alphabetical. Drives the filter. |
| `getProjectsByTag(tag)` | `Project[]` | Case-sensitive, exact. Unknown tag → `[]`. |
| `getJobs()` | `Job[]` | Current role first, then newest start first. |
| `getEducation()` | `Education[]` | Newest start first. |
| `getSkillGroups()` | `SkillGroup[]` | Depth order: confident → working → learning. |

`TIER_ORDER`, the rank map behind `getSkillGroups()`, is module-private and deliberately not exported.

### Four rules the file holds

**1. Every sort copies first.** `[...projects].sort(...)` — `sort` mutates, and the imported array is module-level shared state. Sorting it in place would reorder it for every other caller, and on a warm server instance, for the next request that instance handles. This is the single most important line of reasoning in the file; it is verified by asserting the source arrays are unchanged after the accessors run.

**2. Dates are compared as `"YYYY-MM"` strings, never `Date` objects.** Lexicographic order is chronological order for that format, which is why §5 requires the zero-padded month — `"2026-2"` sorts *after* `"2026-11"`. Comparisons use `<` / `>`, not `localeCompare`, so the result cannot vary with the runtime locale between your machine, CI and Vercel. The same reasoning applies to `getAllTags()`, which uses the default comparator.

**3. Nothing throws.** Every accessor returns a value, `undefined`, or an empty array. Turning a miss into a 404 is the route's job; rendering an empty list is the page's. A content module has no opinion about HTTP.

**4. Ties are broken by source order.** `getAllProjects()` sorts on `year` only, and `sort` is stable, so projects sharing a year keep the order `projects.ts` lists them in. Reordering two same-year projects is therefore a content edit, not a code change.

### Two branches the current content cannot exercise

Both are written and both were verified with synthetic input, because the day the content changes is not the day anyone remembers to add them:

- **`getJobs()` puts `end: null` first** regardless of start date. §5 permits at most one current role and today there are zero, so nothing in the real data reaches this branch.
- **`getSkillGroups()` re-sorts by tier** even though `skills.ts` is already written in order. §5's ordering rule is by-eye; this is the guarantee.

```ts
import { education, jobs } from "@/content/experience";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import type { Education, Job, Project, SkillGroup, SkillTier } from "@/content/types";

/** Newest first. The canonical order everywhere projects are listed. */
export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => b.year - a.year);
}

export function getFeaturedProjects(limit = 3): Project[] {
  return getAllProjects()
    .filter((project) => project.featured)
    .slice(0, limit);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProjectSlugs(): string[] {
  return projects.map((project) => project.slug);
}

/** Unique tags, alphabetical. Drives the filter control. */
export function getAllTags(): string[] {
  return [...new Set(projects.flatMap((project) => project.tags))].sort();
}

export function getProjectsByTag(tag: string): Project[] {
  return getAllProjects().filter((project) => project.tags.includes(tag));
}

/** Current role first, then newest start first. */
export function getJobs(): Job[] {
  return [...jobs].sort((a, b) => {
    if (a.end === null && b.end !== null) return -1;
    if (b.end === null && a.end !== null) return 1;
    if (a.start === b.start) return 0;
    return a.start < b.start ? 1 : -1;
  });
}

export function getEducation(): Education[] {
  return [...education].sort((a, b) => {
    if (a.start === b.start) return 0;
    return a.start < b.start ? 1 : -1;
  });
}

const TIER_ORDER: Record<SkillTier, number> = {
  confident: 0,
  working: 1,
  learning: 2,
};

/** Depth order: confident → working → learning. */
export function getSkillGroups(): SkillGroup[] {
  return [...skillGroups].sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier]);
}
```

> **What this section used to say, and why it changed (2026-08-22).** The original snippet had seven functions and did not compile: it imported `education` and never used it. It also contradicted its own opening sentence, which lists `skillGroups` among the content only this module may import while giving no accessor for it — so `/skills` would have had to break the rule to render. `getEducation()` and `getSkillGroups()` were added and the section rewritten to match the built file. `getJobs()`'s comparator was also replaced: `(b.start > a.start ? 1 : -1)` never returns `0`, so two jobs with the same start compared `-1` in both directions — an inconsistent comparator, which leaves the result order unspecified.

---

## 5. Integrity rules

`tsc` catches shape errors. These are the rules it cannot catch — verify them by eye when adding content, and check them in the content-freeze ticket:

| Rule | Why it matters |
|---|---|
| Slugs unique and `kebab-case`, `[a-z0-9-]` only | Slug is the URL; a duplicate silently shadows a page |
| Every `ImageAsset.alt` is descriptive, never `""` or `"image"` | Accessibility target is WCAG AA |
| `width`/`height` match the real file's intrinsic size | Wrong values reintroduce layout shift |
| Every referenced path exists under `public/` | A 404 image only shows up at runtime |
| 2–3 projects have `featured: true` | The home grid is designed for three |
| Tags reused from `getAllTags()` before inventing new ones | "react" and "React" become two filter chips |
| **At most one** job has `end: null` | Two "current" roles reads as an error. Zero is legitimate and must stay legitimate — between roles is a normal state, and a rule demanding a current job would force the content to claim one. Amended 2026-08-22. |
| Exactly one `SkillGroup` per tier, in order confident → working → learning | The page renders them as three ordered tiers |
| Dates are `"YYYY-MM"` strings | Sorting is lexicographic and silently wrong otherwise |
| `summary` under ~100 chars | Longer strings break card grid alignment |

---

## 6. Adding a project — the whole procedure

This is the workflow the architecture exists to make cheap. It should stay this short:

1. Drop images into `public/images/projects/`, note their pixel dimensions.
2. Append one object to the array in `src/content/projects.ts`.
3. `npm run dev` → the card appears on `/projects`, the page exists at `/projects/<slug>`, and the sitemap includes it.
4. Commit and push. Vercel deploys.

No migration, no CMS entry, no rebuild step to remember. **If this ever takes more than these four steps, the content layer has regressed.**
