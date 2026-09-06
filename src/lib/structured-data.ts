import type { Project } from "@/content/types";
import { site } from "@/content/site";
import { absoluteUrl, isPlaceholder, projectDescription, SITE_ORIGIN } from "@/lib/seo";

/* ---------------------------------------------------------------------------
   JSON-LD builders. Spec: build-plan.md PORT-051, architecture.md §8.

   Structured data is the machine-readable copy of what a page already says. It
   is NOT a place to state anything the page does not — a mismatch between the
   two is what search engines penalise, and it is also just a lie with extra
   steps.

   Why a builder module rather than inline objects in each page: the `Person`
   and the `CreativeWork` have to agree about who the author is. Built in two
   places, they agree until one is edited.

   `lib/`, not `content/` — same direction as lib/seo.ts. These read `site` and
   a `Project` and derive from them; they invent no facts.
--------------------------------------------------------------------------- */

/**
 * Schema.org's `@id` for the person. A stable, absolute IRI.
 *
 * The `#person` fragment is what lets the `CreativeWork` on a project page
 * REFERENCE this Person rather than restating it. Without a shared id, every
 * project page declares its own anonymous author node and a consumer has no
 * way to know they are the same human — which defeats the point of emitting
 * `Person` at all.
 */
export const PERSON_ID = `${SITE_ORIGIN}/#person`;

/** Schema.org's `@id` for the site itself. Referenced by the Person's `url`. */
export const WEBSITE_ID = `${SITE_ORIGIN}/#website`;

/**
 * A URL that is still a PORT-012 stand-in rather than a real destination.
 *
 * THIS EXISTS BECAUSE `isPlaceholder` DID NOT CATCH IT, and the gap is worth
 * recording. That predicate matches marker WORDS — "TBC", "placeholder",
 * "pending" — which is right for prose written by us. A placeholder URL carries
 * no such word: `projects.ts` holds `https://example.com` for both of the
 * OpalusPH links, and it sailed through the text filter into a `sameAs` on the
 * first build of this file.
 *
 * `sameAs` is the strongest claim in the node — it asserts this project IS the
 * thing at that URL — so an unfiltered placeholder publishes a fabricated
 * attribution to a search index. On the page itself the same link is visible in
 * context on a site that is plainly unfinished; in JSON-LD it travels alone.
 *
 * `example.com`/`.org`/`.net` are RFC 2606 reserved names, so this can never
 * match a real destination. Deleted by PORT-057 along with the rest.
 */
function isPlaceholderUrl(url: string): boolean {
  return /(^|\/\/|\.)example\.(com|org|net)(\/|$|:)/i.test(url);
}

/**
 * The `Person` node, emitted once in the root layout.
 *
 * FIELD CHOICE WAS VERNEL'S CALL, NOT A DEFAULT — name, role, url and `sameAs`,
 * with email and location deliberately left out. Both are already visible on
 * /contact, so omitting them hides nothing from a human; the difference is that
 * a JSON-LD `email` is a machine-readable string in a predictable place, which
 * is a materially easier harvest than a rendered `mailto:` a scraper has to
 * parse out of markup.
 *
 * `sameAs` is the field that actually earns its place. It is how a search engine
 * establishes that this site, the GitHub account and the LinkedIn profile are
 * one entity rather than three unrelated pages that happen to share a name.
 * It reads `site.socials` and filters the email row out — `mailto:` is not a
 * profile URL, and putting one in `sameAs` is the single most common way this
 * property is emitted wrong.
 */
export function buildPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: site.name,
    jobTitle: site.role,
    description: site.tagline,
    url: SITE_ORIGIN,
    sameAs: site.socials
      .filter((social) => social.platform !== "email")
      .map((social) => social.href),
  };
}

/**
 * The `WebSite` node, emitted alongside `Person` in the root layout.
 *
 * Small, and it does one job the Person cannot: it names the publisher of the
 * site as the same `@id` as the author of every project, so the graph has a
 * single subject rather than a person and an unattributed website.
 *
 * NO `SearchAction` / sitelinks searchbox, which is the property most often
 * pasted into a node like this. The site has no search endpoint — declaring one
 * would advertise a URL that 404s.
 */
export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.name,
    url: SITE_ORIGIN,
    description: site.tagline,
    inLanguage: "en",
    publisher: { "@id": PERSON_ID },
  };
}

/**
 * The `CreativeWork` node for one project detail page.
 *
 * PLACEHOLDER CONTENT IS FILTERED ON EVERY FIELD THAT CARRIES IT, and this is
 * the third surface where that has had to be said. `projectDescription()` is
 * the same helper `generateMetadata` and the OG card now use, so all three
 * agree by construction rather than by three people remembering. JSON-LD is the
 * surface where it matters most: an og:description is read by a human glancing
 * at a preview, while this is read by an index that may serve it as a search
 * result months later.
 *
 * `keywords` filters the same way — all four projects carry a literal
 * "TBC — confirm stack" until PORT-057, and it has already rendered as a
 * visible chip on a generated card once.
 *
 * `sameAs` needs a DIFFERENT filter, which is the one this file got wrong
 * first: see `isPlaceholderUrl`. A word-matching predicate cannot see that
 * `https://example.com` is a stand-in.
 *
 * Deliberately NOT emitted:
 *   - `datePublished` — `year` is a number inferred from the graduation
 *     timeline, not a stated publication date (see the header of projects.ts).
 *     Schema.org wants an ISO date; manufacturing "2026-01-01" from a year we
 *     are not sure of would be inventing a fact to satisfy a validator.
 *   - `image` — every project image is still a "SCREENSHOT PENDING" placeholder.
 *     The generated OG card is a card, not a picture of the work.
 * Both come back in PORT-057, when the underlying content becomes true.
 */
export function buildProjectSchema(project: Project) {
  const url = absoluteUrl(`/projects/${project.slug}`);
  const keywords = project.stack.filter((tech) => !isPlaceholder(tech));
  const liveUrl =
    project.liveUrl && !isPlaceholderUrl(project.liveUrl) ? project.liveUrl : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#project`,
    name: project.title,
    headline: project.title,
    description: projectDescription(project.title, project.summary),
    url,
    /**
     * Author and creator both point at the ONE Person node the root layout
     * emits, by reference. `{ "@id": … }` rather than a repeated object is
     * what keeps them provably the same entity.
     */
    author: { "@id": PERSON_ID },
    creator: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: "en",
    ...(keywords.length > 0 && { keywords }),
    /**
     * The project's own live site, when it has a REAL one. Spread-guarded
     * rather than set to undefined: an explicit `undefined` disappears in
     * JSON.stringify anyway, but the guard makes the "this field is optional
     * content" branch visible in the source.
     */
    ...(liveUrl && { sameAs: liveUrl }),
  };
}

/**
 * Render a schema object as a `<script type="application/ld+json">`.
 *
 * `JSON.stringify` is the safe part and the reason this helper exists at all.
 * The one real injection risk in JSON-LD is a `</script>` sequence inside a
 * string value closing the tag early; every value here comes from typed content
 * we author, but `.replace(/</g, "\\u003c")` costs nothing and removes the
 * class of bug rather than arguing about whether today's content triggers it.
 *
 * `dangerouslySetInnerHTML` is required and is not a smell here: React escapes
 * text children, which would turn the quotes in the JSON into `&quot;` and
 * produce a script tag no parser can read.
 */
export function jsonLdScriptProps(schema: object) {
  return {
    type: "application/ld+json",
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
    },
  };
}
