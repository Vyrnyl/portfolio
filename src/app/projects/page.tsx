import { Section } from "@/components/layout/section";
import { ProjectFilter } from "@/components/sections/project-filter";
import { ProjectGrid } from "@/components/sections/project-grid";
import { Button } from "@/components/ui/button";
import { getAllProjects, getAllTags, getProjectsByTag } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

const description = "Selected work, with the problem, the approach and the outcome for each.";

export const metadata = buildPageMetadata({
  title: "Projects",
  description,
  path: "/projects",
});

type ProjectsPageProps = {
  searchParams: Promise<{ tag?: string | string[] }>;
};

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const tag = Array.isArray(params.tag) ? params.tag[0] : params.tag;

  const tags = getAllTags();
  const projects = tag ? getProjectsByTag(tag) : getAllProjects();

  const emptyState = tag ? (
    <div className="rounded-lg border border-border py-16 text-center">
      <p className="text-muted">No projects match “{tag}”.</p>
      <Button href="/projects" variant="outline" size="sm" className="mt-4">
        Reset filter
      </Button>
    </div>
  ) : (
    <p className="text-muted py-16 text-center">Projects are on the way — check back soon.</p>
  );

  return (
    <Section>
      <h1 className="text-h-lg text-ink">Projects</h1>
      <p className="text-muted mt-4 max-w-measure">{description}</p>

      <ProjectFilter tags={tags} activeTag={tag} className="mt-8 mb-8" />

      <ProjectGrid projects={projects} emptyState={emptyState} />
    </Section>
  );
}
