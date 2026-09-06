import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

/* ---------------------------------------------------------------------------
   robots.txt. Spec: build-plan.md PORT-051, architecture.md §8.

   Next serves this at /robots.txt, generated at build time.
--------------------------------------------------------------------------- */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /**
       * `/gallery` is a development-only page. It already 404s in production —
       * `page.tsx` calls notFound() when NODE_ENV is "production", and the JSX
       * beneath that branch is constant-folded out of the bundle entirely.
       *
       * So this line does not protect anything. It is here because the AC asks
       * for the exclusion and because the two mechanisms answer different
       * questions: the 404 handles a visitor who has the URL, this handles a
       * crawler that finds it and stops it wasting requests on a page that will
       * never return 200. If the production gate is ever relaxed for debugging,
       * this stays correct on its own.
       *
       * NOT disallowed: /opengraph-image and the per-project card routes. They
       * are absent from the sitemap because they are images rather than pages,
       * but a crawler must be able to FETCH them — that is the entire job of an
       * og:image, and blocking them here would break every link preview on the
       * site while looking like tidy housekeeping.
       */
      disallow: "/gallery",
    },
    /**
     * Absolute by requirement, not by preference: the sitemap directive in
     * robots.txt is the one place in the file where a relative path is invalid.
     * It resolves through `site.url`, so the PORT-055 domain swap carries it.
     */
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
