import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Section } from "@/components/layout/section";
import { CaseStudy } from "@/components/sections/case-study";
import { ProjectGallery } from "@/components/sections/project-gallery";
import { ProjectHeader } from "@/components/sections/project-header";
import { ProjectNav } from "@/components/sections/project-nav";
import { site } from "@/content/site";
import { getAdjacentProjects, getProjectBySlug, getProjectSlugs } from "@/lib/content";

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
    return { title: `Project not found — ${site.name}` };
  }

  const title = `${project.title} — ${site.name}`;
  const image = project.cover ?? project.thumbnail;

  return {
    title,
    description: project.summary,
    openGraph: {
      title,
      description: project.summary,
      url: `${site.url}/projects/${project.slug}`,
      siteName: site.name,
      type: "article",
      // Absolute, built from site.url. The root layout sets no metadataBase,
      // so a relative path here would resolve against localhost in the build
      // output. A generated OG image is PORT-050; this is the project's own.
      images: [
        {
          url: `${site.url}${image.src}`,
          width: image.width,
          height: image.height,
          alt: image.alt,
        },
      ],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  // notFound() is typed `never`, so `project` is a Project below this line.
  if (!project) notFound();

  const { previous, next } = getAdjacentProjects(project.slug);

  return (
    <>
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
