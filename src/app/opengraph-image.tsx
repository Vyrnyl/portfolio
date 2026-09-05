import { ImageResponse } from "next/og";

import { site } from "@/content/site";
import { OG_COLORS, OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from "@/lib/seo";

/* ---------------------------------------------------------------------------
   The default social card. Spec: build-plan.md PORT-050.

   Next finds this file by CONVENTION, not by import — sitting in `app/` makes
   it the card for every route that does not have its own
   `opengraph-image.tsx` deeper in the tree. Nothing imports it, and nothing
   should; `lib/seo.ts` deliberately sets no `images`, because doing so would
   override this discovery.

   Generated at BUILD time, not per request: the route below is static, so this
   runs once during `next build` and the PNG is served from the CDN.
--------------------------------------------------------------------------- */

export const alt = `${site.name} — ${site.role}`;
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

/**
 * THIS IS NOT REACT AND THE JSX IS NOT A COMPONENT TREE.
 *
 * `ImageResponse` hands the markup to Satori, which implements a deliberately
 * small subset of CSS: flexbox only (no grid, no float), no cascade, no
 * external stylesheet, and no Tailwind classes — which is why every rule below
 * is an inline style object and why none of the project's utility classes
 * appear. A `className` here does nothing at all, silently.
 *
 * Every `display: flex` is load-bearing for the same reason: Satori requires
 * an explicit display on any element with more than one child and throws if it
 * is missing.
 *
 * The font is Geist, which `next/og` bundles — no font file is loaded from
 * `public/` and no network fetch happens during the build. That is the reason
 * this ticket needed no font prerequisite.
 */
export default function OpengraphImage() {
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
        {/* Eyebrow — the wordmark, matching the header's role in the real site. */}
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

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              lineHeight: 1.1,
              color: OG_COLORS.ink,
              letterSpacing: "-0.02em",
            }}
          >
            {site.role}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 32,
              lineHeight: 1.4,
              color: OG_COLORS.muted,
              marginTop: 24,
              maxWidth: 900,
            }}
          >
            {site.tagline}
          </div>
        </div>

        {/* The fern rule — the one piece of brand colour, and the reason the
            card reads as this site rather than as a generic text slide. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 160,
              height: 8,
              backgroundColor: OG_COLORS.fern,
              borderRadius: 999,
            }}
          />
          <div style={{ display: "flex", fontSize: 26, color: OG_COLORS.muted }}>
            {site.url.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
