import { ImageResponse } from "next/og";

import { site } from "@/content/site";
import { getProjectBySlug, getProjectSlugs } from "@/lib/content";
import { OG_COLORS, OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/lib/seo";

/* ---------------------------------------------------------------------------
   Per-project social cards. Spec: build-plan.md PORT-050.

   Sitting inside the `[slug]` segment makes this override the root card for
   project pages only — the same convention-based discovery, one level deeper.

   THE CARD IS GENERATED, NOT THE PROJECT'S SCREENSHOT, and that was a decision
   rather than a default (2026-09-05). The detail page's `generateMetadata`
   already pointed `og:image` at `project.cover ?? project.thumbnail`, which
   reads like the better preview — until you note that all four project images
   are 1600×1000 GENERATED PLACEHOLDERS until PORT-057. A card built from the
   title and summary carries real content; a stand-in screenshot is the one
   part of a shared link that would be fiction. Revisit when PORT-057 lands.

   THE PLACEHOLDER FILTER BELOW IS THE OTHER HALF OF THAT DECISION, and it was
   added only after LOOKING at a rendered card. The reasoning above — "the
   title and summary are real" — turned out to be true of exactly two of the
   four projects. `stack` carries a literal "TBC — confirm stack" entry on ALL
   FOUR, and it landed in the chip row of the first card rendered; two projects
   would have shipped a card whose ONLY chip read "TBC". Two summaries are
   placeholder prose that says so on its face.

   That is fine on the site itself, where a visitor sees it in context and the
   surrounding page is honestly a work in progress. It is NOT fine on a social
   card, which is the one artefact that travels without its context: it is
   pasted into a chat, an email, a job application. So the card renders what is
   real and silently omits what is not — the same instinct as PORT-012's
   generated screenshots saying "PHOTO PENDING" on their face, applied to the
   surface where saying so is not possible.
--------------------------------------------------------------------------- */

export const alt = "Project case study";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

/**
 * Text still carrying a PORT-012 placeholder marker.
 *
 * Matched rather than hardcoded per project, so a new placeholder written in
 * the same house style is caught without an edit here. It is deliberately
 * loose: on a social card a false positive costs one omitted chip, while a
 * false negative publishes "TBC — confirm stack" to everyone who sees the link.
 */
function isPlaceholder(text: string): boolean {
  return /\b(TBC|placeholder|pending|TODO|lorem)\b/i.test(text);
}

/**
 * Prerender one card per project at build time.
 *
 * Without this the route is generated on demand, which for a static export
 * means the card is built on first request — the exact moment a crawler is
 * waiting for it, and some crawlers do not retry a slow first response.
 * `getProjectSlugs()` is the same accessor the page itself uses, so a new
 * project gets a card with no edit here.
 */
export function generateStaticParams(): { slug: string }[] {
  return getProjectSlugs().map((slug) => ({ slug }));
}

/**
 * `params` IS A PROMISE — the Next 15+ rule that applies to pages applies here
 * too. This file is a route handler in everything but name.
 */
export default async function ProjectOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  /**
   * An unknown slug must still return an image.
   *
   * This runs independently of the page, so the page's `notFound()` has not
   * happened and cannot help. Throwing here would fail the build for a bad
   * link rather than the page 404ing cleanly, so the fallback is the site's
   * own name — a plain card, never a broken one.
   */
  const title = project?.title ?? site.name;

  /**
   * A placeholder summary falls back to the site tagline rather than being
   * dropped: the card has a designed slot under the title, and an empty one
   * leaves a visible hole where a sentence belongs. The tagline is true of
   * every project page on this site, so it is a weaker line but never a false
   * one.
   */
  const rawSummary = project?.summary ?? site.tagline;
  const summary = isPlaceholder(rawSummary) ? site.tagline : rawSummary;

  /**
   * Placeholder stack entries are dropped, not replaced — the chip row is a
   * flex row that simply renders shorter, so unlike the summary there is no
   * hole to fill. Filtering happens BEFORE the cap, so a real fifth entry is
   * not lost to a "TBC" occupying one of the four slots.
   */
  const stack = (project?.stack ?? []).filter((tech) => !isPlaceholder(tech)).slice(0, 4);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: OG_COLORS.ground,
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 28,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: OG_COLORS.muted,
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: OG_COLORS.fern,
              backgroundColor: OG_COLORS.fernWash,
              padding: "10px 22px",
              borderRadius: 999,
            }}
          >
            Project
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 68,
              lineHeight: 1.1,
              color: OG_COLORS.ink,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              lineHeight: 1.4,
              color: OG_COLORS.muted,
              marginTop: 24,
              maxWidth: 940,
            }}
          >
            {summary}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/*
            The stack chips are capped at four above, not wrapped. Satori has no
            text measurement to fall back on here, so a fifth entry would push
            the row past the card edge and be cropped rather than wrapping — a
            cap is the only reliable answer at a fixed width.

            The row renders empty when every entry was a placeholder, which is
            correct: the fern rule opposite still anchors the baseline, so the
            card reads as deliberately spare rather than broken.
          */}
          <div style={{ display: "flex", gap: 14 }}>
            {stack.map((tech) => (
              <div
                key={tech}
                style={{
                  display: "flex",
                  fontSize: 24,
                  color: OG_COLORS.muted,
                  backgroundColor: OG_COLORS.surface2,
                  padding: "10px 22px",
                  borderRadius: 999,
                }}
              >
                {tech}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              width: 120,
              height: 8,
              backgroundColor: OG_COLORS.fern,
              borderRadius: 999,
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
