/**
 * The content schema. Every file in src/content/ must satisfy a type from here.
 *
 * Types first: this file is written before any content, so tsc catches a
 * malformed entry at build time rather than a page catching it at render time.
 * Content files use `satisfies`, never `:` — `satisfies` checks the shape while
 * keeping literal types, so slugs and tags stay narrow and autocomplete.
 *
 * No logic lives in content files. Sorting, filtering and "featured" selection
 * belong to src/lib/content.ts (PORT-015).
 *
 * Spec: ai-context/context/content-model.md §2.
 */

// ---------- shared ----------

/**
 * A URL-safe permanent identifier: lowercase kebab-case, [a-z0-9-] only.
 * A slug IS the URL. Changing one breaks every inbound link to that page,
 * so rename only alongside a deliberate redirect.
 */
export type Slug = string;

export interface ImageAsset {
  /** Path under /public, e.g. "/images/projects/grades-hero.png". */
  src: string;
  /**
   * Required, and never "" or "image". Describe what the image shows, not
   * the fact that it is an image. Decorative images do not belong in content.
   */
  alt: string;
  /** Intrinsic pixel width of the real file. Wrong values reintroduce layout shift. */
  width: number;
  /** Intrinsic pixel height of the real file. Wrong values reintroduce layout shift. */
  height: number;
}

export interface Link {
  label: string;
  href: string;
  /** Set for links leaving the site — drives target/rel and the external icon. */
  external?: boolean;
}

// ---------- site ----------

export interface SocialLink {
  platform: "github" | "linkedin" | "email" | "x" | "dribbble";
  href: string;
  /** Screen-reader label, e.g. "GitHub profile". Never bare "GitHub". */
  label: string;
}

export interface SiteConfig {
  name: string;
  /** Role line under the name, e.g. "Full-stack developer". */
  role: string;
  /** One sentence. Used as the default meta description. */
  tagline: string;
  /** Absolute production URL, no trailing slash. Feeds metadataBase and OG images. */
  url: string;
  email: string;
  location: string;
  /** Order here is the order in the header nav. */
  nav: Link[];
  socials: SocialLink[];
  /** Path to the downloadable CV under /public, e.g. "/resume.pdf". */
  resumePdf: string;
}

// ---------- projects ----------

export type ProjectStatus = "live" | "archived" | "in-progress";

export interface Project {
  slug: Slug;
  title: string;
  /** One line for the card. Keep under ~100 chars or the card grid wraps unevenly. */
  summary: string;
  /** Sort key for the index, and shown on the card. */
  year: number;
  status: ProjectStatus;
  /** Promotes to the home page grid, which is designed for exactly three. Keep 2–3 true. */
  featured: boolean;
  /** Drives the tag filter. Reuse an existing tag before inventing one — casing is not normalised. */
  tags: string[];
  /** Named technologies, shown on the detail page. */
  stack: string[];
  thumbnail: ImageAsset;
  /** Wide image for the detail page header. Falls back to thumbnail when absent. */
  cover?: ImageAsset;
  liveUrl?: string;
  repoUrl?: string;

  /** Detail-page narrative. All three required — this is the substance of a case study. */
  problem: string;
  approach: string;
  outcome: string;

  /** Optional extras for richer detail pages. Each needs its own rendering branch. */
  highlights?: string[];
  gallery?: ImageAsset[];
  role?: string;
  /** e.g. "3 months", "Ongoing". */
  duration?: string;
}

// ---------- experience ----------

export interface Job {
  company: string;
  role: string;
  /** ISO "YYYY-MM". Sorted lexicographically, so the zero-padded month matters. */
  start: string;
  /** ISO "YYYY-MM", or null for the current role. Exactly one job may be null. */
  end: string | null;
  location: string;
  /** 2–4 achievement bullets. Lead with the outcome, not the task. */
  bullets: string[];
  stack?: string[];
}

export interface Education {
  institution: string;
  credential: string;
  /** ISO "YYYY-MM". */
  start: string;
  /** ISO "YYYY-MM", or null if ongoing. */
  end: string | null;
  note?: string;
}

// ---------- skills ----------

/** Honest depth, not a percentage. Drives grouping and dot weight on /skills. */
export type SkillTier = "confident" | "working" | "learning";

export interface SkillGroup {
  tier: SkillTier;
  /** The tier's heading, e.g. "Confident", "Working knowledge", "Learning now". */
  label: string;
  /** One line saying what this tier actually means to a reader. */
  blurb: string;
  items: string[];
}

/** A practice principle on /skills — how I work, not what I know. */
export interface Practice {
  /** lucide-react icon name. PORT-024 narrows this to the icon map's keys. */
  icon: string;
  title: string;
  body: string;
}
