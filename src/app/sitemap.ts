import type { MetadataRoute } from "next";

import { getAllProjects } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

/* ---------------------------------------------------------------------------
   The sitemap. Spec: build-plan.md PORT-051, architecture.md §8.

   Next discovers this file by convention and serves /sitemap.xml. It runs at
   BUILD time, so the output is a static file — there is no request to respond
   to and nothing here may depend on one.
--------------------------------------------------------------------------- */

/**
 * The six public pages, listed literally.
 *
 * THIS LIST IS HAND-WRITTEN ON PURPOSE and the alternative was considered.
 * Next has no "enumerate my routes" API, so generating it means globbing the
 * filesystem for page.tsx at build time — and that sweeps up exactly the
 * routes that must NOT be indexed: `/gallery` (dev-only), `/opengraph-image`
 * and the four `[slug]/opengraph-image` card routes, which are PNG endpoints,
 * not pages. A clever enumeration would need a deny-list to be correct, at
 * which point it is a hand-written list with extra failure modes.
 *
 * The cost is real and worth naming: ADD A PAGE AND YOU MUST ADD IT HERE. That
 * is a thing to forget. It is also a thing a person can see is missing by
 * reading eight lines, which is not true of a glob that quietly skipped it.
 *
 * `/projects/[slug]` is NOT here — those come from the content layer below,
 * which is the AC's "a new project appears automatically".
 *
 * `priority` is ordinal, not a ranking signal: it tells a crawler which pages
 * matter most WITHIN this site and nothing about how the site ranks against
 * any other. Home leads, work and contact next, the rest level.
 */
const STATIC_ROUTES: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { path: "/", priority: 1.0, changeFrequency: "monthly" },
  { path: "/projects", priority: 0.9, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "yearly" },
  { path: "/skills", priority: 0.7, changeFrequency: "yearly" },
  { path: "/resume", priority: 0.7, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
];

/**
 * ONE timestamp for the whole build, taken once.
 *
 * Calling `new Date()` per entry would stamp each URL a few milliseconds apart
 * — harmless, but it makes a diff of two sitemaps unreadable and implies the
 * pages changed at different moments when they were all built at once.
 *
 * `lastModified` is honestly the BUILD time, not a content edit time. Git knows
 * when each file actually changed, but a sitemap generated from `git log` would
 * be wrong on Vercel, where the build runs against a shallow clone. Build time
 * is a defensible approximation: the site is static, so a rebuild IS the only
 * way any page changes.
 */
const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  /**
   * Newest first, because that is the order `getAllProjects()` guarantees.
   * A sitemap's order carries no meaning to a crawler — this is for the human
   * who opens /sitemap.xml to check it, and it costs nothing.
   *
   * NOTE what is deliberately absent: no `isPlaceholder` filter. Placeholder
   * copy is filtered out of share previews and structured data because those
   * travel with no context, but all four projects are REAL, reachable, linked
   * pages. Hiding two of them from the sitemap would not make the site look
   * more finished; it would just make two live pages harder to discover while
   * they sit one click away in the projects index.
   */
  const projectRoutes: MetadataRoute.Sitemap = getAllProjects().map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
    lastModified,
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  return [
    ...STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
      url: absoluteUrl(path),
      lastModified,
      changeFrequency,
      priority,
    })),
    ...projectRoutes,
  ];
}
