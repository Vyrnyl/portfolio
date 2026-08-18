# Content Model

> Replaces the former `database-design.md`. There is no database. This document specifies the **typed content layer** in `src/content/` — the schema every content file must satisfy, and the accessors pages read it through.

Rationale for the approach is [architecture.md](architecture.md) §2 (A3) and §5.

---

## 1. Principles

1. **Types first.** `src/content/types.ts` is written before any content file. A content file that does not satisfy its type fails `tsc`, which fails the build.
2. **`satisfies`, never `:`.** `satisfies Project[]` checks the shape *and* keeps literal types, so slugs and tags stay narrow and autocomplete.
3. **Slugs are identity.** A slug is a permanent URL. Changing one breaks an inbound link — rename only with a deliberate redirect.
4. **No logic in content files.** They export literals. Sorting, filtering, and "featured" selection live in `lib/content.ts`.
5. **Optional means optional in the UI too.** Every `?` field needs a rendering branch. If a project has no `liveUrl`, the button must not render as a dead link.
6. **Images are referenced, not embedded.** Paths point into `public/images/`; every image records its intrinsic `width`/`height` so `next/image` reserves space and CLS stays at zero.

---

## 2. `src/content/types.ts`

The complete schema. Copy this as the first content ticket.

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
  /** lucide-react icon name */
  icon: string;
  title: string;
  body: string;
}

// ---------- uses ----------

export interface UsesItem {
  name: string;
  note: string;
  href?: string;
}

export interface UsesGroup {
  category: string;
  items: UsesItem[];
}
```

---

## 3. Files

| File | Exports | Feeds |
|---|---|---|
| `site.ts` | `site: SiteConfig` | Header, footer, root metadata, contact page, JSON-LD |
| `projects.ts` | `projects` (satisfies `Project[]`) | `/`, `/projects`, `/projects/[slug]`, sitemap |
| `experience.ts` | `jobs`, `education` | `/resume`, `/about` |
| `skills.ts` | `skillGroups`, `practices` | `/skills`, `/about`, `/resume` |
| `uses.ts` | `usesGroups` | `/uses` |

---

## 4. Accessors — `src/lib/content.ts`

The only module allowed to import from `src/content/`. Pages import from here.

```ts
import { projects } from "@/content/projects";
import { jobs, education } from "@/content/experience";
import type { Project } from "@/content/types";

/** Newest first. The canonical order everywhere projects are listed. */
export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => b.year - a.year);
}

export function getFeaturedProjects(limit = 3): Project[] {
  return getAllProjects().filter((p) => p.featured).slice(0, limit);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}

/** Unique tags, alphabetical. Drives the filter control. */
export function getAllTags(): string[] {
  return [...new Set(projects.flatMap((p) => p.tags))].sort();
}

export function getProjectsByTag(tag: string): Project[] {
  return getAllProjects().filter((p) => p.tags.includes(tag));
}

/** Current role first, then reverse-chronological. */
export function getJobs() {
  return [...jobs].sort((a, b) => (b.start > a.start ? 1 : -1));
}
```

Note `[...projects]` before `.sort()` — `sort` mutates, and the imported array is module-level shared state. Sorting it in place would reorder it for every other caller.

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
| Exactly one job has `end: null` | Two "current" roles reads as an error |
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
