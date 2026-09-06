import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Section } from "@/components/layout/section";
import { CaseStudy } from "@/components/sections/case-study";
import { ProjectGallery } from "@/components/sections/project-gallery";
import { ProjectHeader } from "@/components/sections/project-header";
import { ProjectNav } from "@/components/sections/project-nav";
import { getAdjacentProjects, getProjectBySlug, getProjectSlugs } from "@/lib/content";
import { absoluteUrl, buildPageMetadata, projectDescription } from "@/lib/seo";
import { buildProjectSchema, jsonLdScriptProps } from "@/lib/structured-data";

type ProjectPageProps = {
  // Next 15+: params is a Promise. Awaiting it is not optional.
  params: Promise<{ slug: string }>;
};

/**
 * One prerendered page per project at build time. `next build` should show a
 * bullet for every slug under /projects/[slug] — that is the ticket's own
 * acceptance criterion, and the thing that breaks first if this is removed.
 *
 * `dynamicParams` is left at its default (true) on purpose: a slug that is not
 * in this list is rendered on demand, misses in getProjectBySlug, and calls
 * notFound(). That path is what serves the 404 for /projects/does-not-exist.
 */
export function generateStaticParams(): { slug: string }[] {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  // Runs before the page component, so it has to survive an unknown slug on
  // its own — the page's notFound() has not happened yet at this point.
  if (!project) {
    return { title: "Project not found" };
  }

  /**
   * A placeholder summary must not become the share description.
   *
   * Two of the four projects still carry "Placeholder summary … real copy
   * pending" from PORT-012, and the FIRST fix for this only filtered the card
   * IMAGE — so the picture was clean while the sentence printed under it in
   * every preview still read "real copy pending". Caught by auditing the served
   * tags, not the source; the image and the description are two separate
   * surfaces and fixing one says nothing about the other.
   *
   * On the page itself the placeholder is fine and honest — a visitor sees it
   * in context on a site that is visibly a work in progress. A share preview
   * has no context: it travels into a chat, an email, an application.
   *
   * PORT-051 MOVED THIS INTO `lib/seo.ts`. It was a private copy of a function
   * that also existed in this segment's opengraph-image.tsx, and the structured
   * data added below made it a third reader of the same summaries. Three copies
   * of a predicate that must agree is how the two surfaces disagreed in the
   * first place.
   */
  const description = projectDescription(project.title, project.summary);

  return buildPageMetadata({
    // Bare title — the root layout's template appends the site name.
    title: project.title,
    description,
    path: `/projects/${project.slug}`,
    type: "article",
    /**
     * The project's own GENERATED card, not its screenshot.
     *
     * This line previously pointed at `project.cover ?? project.thumbnail`,
     * and PORT-050 replaced it for two reasons. The stated one: all four
     * project images are 1600×1000 placeholders until PORT-057, so the
     * screenshot is the one part of a shared link that would be fiction,
     * while the generated card carries the real title.
     *
     * The one found by checking: `opengraph-image.tsx` sits in this same
     * segment and generates a card per slug — but an explicit `images` here
     * OVERRIDES that convention-discovered card silently. The served HTML
     * still advertised the placeholder WebP while four correct cards were
     * being prerendered and never referenced by anything.
     */
    image: absoluteUrl(`/projects/${project.slug}/opengraph-image`),
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  // notFound() is typed `never`, so `project` is a Project below this line.
  if (!project) notFound();

  const { previous, next } = getAdjacentProjects(project.slug);

  return (
    <>
      {/*
        CreativeWork for this project (PORT-051), referencing the Person the
        root layout emits by @id rather than restating the author.

        Rendered inside the page rather than the layout because it describes
        THIS project — the layout has no slug. It sits before the first Section
        so it is never inside a conditional branch that might not render.
      */}
      <script {...jsonLdScriptProps(buildProjectSchema(project))} />

      <Section>
        <ProjectHeader project={project} />
      </Section>

      <Section spacing="tight">
        <CaseStudy
          problem={project.problem}
          approach={project.approach}
          outcome={project.outcome}
          highlights={project.highlights}
        />
      </Section>

      {/* The Section is skipped too, not just the gallery — a Section wrapped
          around a component that returns null is a band of blank padding. */}
      {project.gallery ? (
        <Section spacing="tight">
          <ProjectGallery images={project.gallery} />
        </Section>
      ) : null}

      <Section spacing="tight">
        <ProjectNav previous={previous} next={next} />
      </Section>
    </>
  );
}
