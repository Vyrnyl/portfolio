import type { Metadata } from "next";

import { site } from "@/content/site";

/* ---------------------------------------------------------------------------
   The one place page metadata is assembled. Spec: build-plan.md PORT-050,
   architecture.md §8.

   Before this file, five pages each hand-wrote a near-identical `openGraph`
   block — same `siteName`, same `type`, same shape, with the URL rebuilt by
   string concatenation every time. That is five places to forget a field and
   five places to fix when one changes, which is exactly what the AC's "no page
   hand-assembles an OG object" bullet is about.

   `lib/`, not `content/`: this reads `site` and derives from it. The dependency
   runs content → lib → components in one direction only (architecture.md §2).
--------------------------------------------------------------------------- */

/**
 * The canonical origin, with no trailing slash.
 *
 * Today this is the Vercel preview domain, because that is what `site.url`
 * holds until PORT-055 buys the real one. That is the whole reason it is read
 * from content rather than written here: the domain swap stays a one-line edit
 * in `site.ts` and every absolute URL on the site follows it.
 */
export const SITE_ORIGIN = site.url;

/**
 * `metadataBase` for the root layout.
 *
 * THIS IS THE FIX FOR A BUG CARRIED SINCE PORT-030. Without it, Next resolves
 * every relative metadata URL — including the `og:image` it generates from
 * `opengraph-image.tsx` — against `http://localhost:3000`. It does not fail the
 * build; it emits a warning and ships. A link shared from production then
 * points at a machine nobody else can reach, and the card renders empty for
 * everyone.
 */
export const metadataBase = new URL(SITE_ORIGIN);

/** Canonical absolute URL for a route path. `"/"` → the bare origin. */
export function absoluteUrl(path: string): string {
  if (path === "/") return SITE_ORIGIN;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * The default generated card, as an absolute URL.
 *
 * THE CONVENTION DOES NOT CASCADE THE WAY THE FIRST BUILD OF THIS FILE CLAIMED,
 * and the correction is the important part of this comment.
 *
 * `app/opengraph-image.tsx` was documented here as "the card for every route
 * that does not have its own". It is not: checking the SERVED HTML showed the
 * tag present on `/` and **absent from `/projects`, `/skills`, `/about`,
 * `/resume` and `/contact`** — five of seven pages sharing as a bare title
 * while the build was green and the card file rendered a correct PNG on its own
 * URL. Nothing about the source said so.
 *
 * So the image is named explicitly below. That is not a workaround: for every
 * page except `/` this is now the only thing producing the tag, and naming it
 * once here is still one place rather than seven.
 *
 * The route stays real — `/opengraph-image` is prerendered by
 * `app/opengraph-image.tsx` and served as a static PNG. This constant points at
 * it rather than duplicating it.
 */
export const DEFAULT_OG_IMAGE = absoluteUrl("/opengraph-image");

type PageMetaInput = {
  /** The page's own title, WITHOUT the site name — the template appends it. */
  title: string;
  /** Under 160 characters. Unique per page; it is the search snippet. */
  description: string;
  /** Route path, e.g. "/projects". Used for the canonical and og:url. */
  path: string;
  /**
   * OG type. "website" for most pages, "profile" for the ones about a person,
   * "article" for a project case study. Defaults to "website" because that is
   * the correct answer for every page that has no reason to differ.
   */
  type?: "website" | "profile" | "article";
  /**
   * Overrides the default card. Pass this only where a route has its own
   * generated card — the project detail page — so the two never disagree.
   */
  image?: string;
};

/**
 * Build a page's full `Metadata` object.
 *
 * Every page except the root layout goes through this. The title is passed
 * BARE — "Projects", not "Projects — Vernel Aquino" — because the root layout's
 * title template appends the site name. Passing the full string here would
 * produce "Projects — Vernel Aquino — Vernel Aquino", which is the failure this
 * signature is shaped to prevent.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  type = "website",
  image = DEFAULT_OG_IMAGE,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);

  /**
   * The OG title carries the site name; the `<title>` tag does not.
   *
   * The root layout's `title.template` applies ONLY to the document title —
   * OpenGraph is a separate field and inherits nothing from it. The first
   * build of this file passed the bare title straight through, so `/projects`
   * served `og:title` of exactly "Projects": correct in a browser tab, but a
   * shared link is stripped of every other clue about whose work it is. Found
   * by reading the served tags, not the source.
   */
  const ogTitle = `${title} — ${site.name}`;

  return {
    title,
    description,
    alternates: {
      /**
       * A canonical on every page. There is only one URL per page on this
       * site today, so nothing is currently being de-duplicated — but a
       * canonical is what stops a query string (`?tag=react` on /projects, or
       * any tracking parameter a shared link picks up) from being indexed as a
       * separate page with the same content.
       */
      canonical: url,
    },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: site.name,
      locale: "en_US",
      type,
      images: [
        {
          url: image,
          width: OG_IMAGE_SIZE.width,
          height: OG_IMAGE_SIZE.height,
          alt: `${title} — ${site.name}`,
        },
      ],
    },
    twitter: {
      /**
       * The large card, which is what a 1200×630 image is for. The default is
       * `summary` — a small square thumbnail that crops a wide card to its
       * centre and cuts the text off at both ends.
       *
       * No `site`/`creator` handle: there is no Twitter account in
       * `site.socials`, and inventing one would be a broken link on every
       * shared post.
       */
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [image],
    },
  };
}

/**
 * Shared dimensions and content type for every generated OG card.
 *
 * 1200×630 is the size every major platform crops to, and re-declaring it in
 * each `opengraph-image.tsx` is how the two drift apart.
 */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;
export const OG_IMAGE_CONTENT_TYPE = "image/png";

/**
 * The card palette, as HEX — and the hex is not a shortcut.
 *
 * `globals.css` defines every colour as `oklch()`, and the OG cards are
 * rendered by Satori (inside `next/og`), which DOES NOT SUPPORT `oklch` and
 * does not report that it doesn't: an unparseable colour is skipped, so the
 * card renders black-on-transparent with no error anywhere in the build log.
 *
 * These are the source hexes ui-rules.md §3 records for the same tokens —
 * the values the oklch was derived from, not new colours invented here. If a
 * token changes there, it must be changed here too; that duplication is the
 * unavoidable cost of a renderer that cannot read the stylesheet.
 *
 * LIGHT ONLY, deliberately. A card is baked at build time and served to every
 * viewer, so it cannot respond to a `prefers-color-scheme` the renderer never
 * sees. Choosing the light palette means the card matches the site's default
 * appearance for a first-time visitor.
 */
export const OG_COLORS = {
  ground: "#FBFAF7",
  surface2: "#F4F4EF",
  ink: "#1C2420",
  muted: "#5E6B63",
  fern: "#2F7D5C",
  fernWash: "#E9F3ED",
} as const;
