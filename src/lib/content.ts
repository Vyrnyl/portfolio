import { education, jobs } from "@/content/experience";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import type {
  Education,
  Job,
  Project,
  SkillGroup,
  SkillTier,
} from "@/content/types";

/* ---------------------------------------------------------------------------
   The accessor layer. Spec: ai-context/context/content-model.md §4.

   This is the ONLY module that imports queryable content — `projects`, `jobs`,
   `education`, `skillGroups`. Pages import from here rather than from
   src/content/ directly, so "newest first", "which three are featured" and
   "what order do the skill tiers go in" are each decided in exactly one place
   instead of being re-derived, slightly differently, on every page.

   `site` is the documented exception and is imported directly by Header and
   Footer. It is a config singleton with nothing to query; a getSite() that
   returns a constant is the "repository that returns an array literal" that
   architecture.md §2 A7 rejects.

   EVERY FUNCTION THAT SORTS COPIES FIRST. Array.prototype.sort reorders in
   place, and these arrays are module-level state shared by every caller in the
   process. Sorting one directly would not just order your result — it would
   silently reorder the array for every other page, and on a warm server
   instance, for the next request it handles.

   Dates are compared as plain "YYYY-MM" strings. For that format lexicographic
   order IS chronological order, which is exactly why content-model §5 requires
   the zero-padded month: "2026-2" sorts after "2026-11".

   No accessor throws. Every one of them either returns a value or returns
   undefined / an empty array, and the caller decides what that means on screen.
--------------------------------------------------------------------------- */

// ---------- projects ----------

/**
 * Every project, newest first. The canonical order everywhere projects are
 * listed — /projects, the home grid, the sitemap.
 *
 * Ties keep their order from src/content/projects.ts. `sort` is stable, so two
 * projects sharing a year (there are currently two from 2025) stay in the order
 * the content file lists them. That is deliberate: it makes the file itself the
 * tie-breaker, so reordering two same-year projects is a content edit rather
 * than a code change.
 */
export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => b.year - a.year);
}

/**
 * The projects promoted to the home page grid, newest first.
 *
 * @param limit hard cap on how many come back. The home grid is designed for
 *   exactly three, so the cap means a fourth `featured: true` slipping into the
 *   content file cannot break that layout — it simply does not appear. Fewer
 *   than three is a content problem the home page must still render sanely.
 */
export function getFeaturedProjects(limit = 3): Project[] {
  return getAllProjects()
    .filter((project) => project.featured)
    .slice(0, limit);
}

/**
 * One project by slug, or `undefined` when nothing matches.
 *
 * Deliberately does not throw. The caller is a dynamic route answering an
 * arbitrary URL, and turning a miss into a 404 is that route's job — this
 * module has no opinion about HTTP.
 */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/**
 * Every slug, for `generateStaticParams` on /projects/[slug].
 *
 * Unsorted on purpose — prerendering does not care about order, and sorting
 * here would imply a meaning the value does not have.
 */
export function getProjectSlugs(): string[] {
  return projects.map((project) => project.slug);
}

/**
 * Unique tags across all projects, alphabetical. Drives the filter control.
 *
 * Sorted with the default comparator rather than `localeCompare`, so the order
 * is identical on your machine, on CI and on Vercel. `localeCompare` reads the
 * runtime locale and can quietly produce a different build output.
 *
 * `Project["tags"]` is `string[]`, not a union, so "ai" and "AI" would arrive
 * here as two separate chips. Keeping tags consistent is the by-eye rule in
 * content-model §5 — this function reports what is there, it does not fix it.
 */
export function getAllTags(): string[] {
  return [...new Set(projects.flatMap((project) => project.tags))].sort();
}

/**
 * Projects carrying a tag, newest first. Matching is case-sensitive and exact.
 *
 * An unknown tag returns `[]` rather than throwing, because the tag arrives
 * from the URL and a hand-edited query string must render the empty state, not
 * an error page.
 */
export function getProjectsByTag(tag: string): Project[] {
  return getAllProjects().filter((project) => project.tags.includes(tag));
}

// ---------- experience ----------

/**
 * Jobs for /resume and /about: the current role first, then newest start first.
 *
 * `end: null` means "current", and content-model §5 permits at most one. Zero
 * is legitimate and is in fact the case today, so the current-role branch is
 * unexercised by the present content. It is written now because the first job
 * that sets `end: null` has to jump the list without anyone remembering to
 * come back and add it.
 */
export function getJobs(): Job[] {
  return [...jobs].sort((a, b) => {
    if (a.end === null && b.end !== null) return -1;
    if (b.end === null && a.end !== null) return 1;
    if (a.start === b.start) return 0;
    return a.start < b.start ? 1 : -1;
  });
}

/**
 * Education entries, newest start first.
 *
 * There is only one entry today, so the sort is insurance rather than work —
 * but it means adding a second (a bootcamp, a certification) needs no code
 * change to appear in the right place.
 */
export function getEducation(): Education[] {
  return [...education].sort((a, b) => {
    if (a.start === b.start) return 0;
    return a.start < b.start ? 1 : -1;
  });
}

// ---------- skills ----------

/**
 * Depth order for the skill tiers. Typed as a full Record over `SkillTier`, so
 * adding a fourth tier to the union fails to compile until it is given a rank
 * here — rather than sorting to `undefined` and landing wherever.
 */
const TIER_ORDER: Record<SkillTier, number> = {
  confident: 0,
  working: 1,
  learning: 2,
};

/**
 * The skill tiers in depth order: confident → working → learning.
 *
 * The order is enforced here rather than trusted from the content file.
 * content-model §5 asks for skills.ts to be written in order too, but that is a
 * by-eye rule — this is the one /skills actually renders, and it is the one the
 * compiler can help hold.
 */
export function getSkillGroups(): SkillGroup[] {
  return [...skillGroups].sort(
    (a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier],
  );
}
