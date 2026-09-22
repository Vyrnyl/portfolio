import { Section } from "@/components/layout/section";
import { ProjectGrid } from "@/components/sections/project-grid";
import { getAllProjects } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

const description = "Selected work, with the problem, the approach and the outcome for each.";

export const metadata = buildPageMetadata({
  title: "Projects",
  description,
  path: "/projects",
});

/*
 * The tag filter was removed on 2026-09-22 at Vernel's request.
 *
 * That makes this route STATIC again. It was the site's only `ƒ` route, and
 * only because reading `?tag=` server-side opts a page out of prerendering —
 * PORT-031 built it that way and build-plan §9 D11 settled it deliberately.
 * With no searchParams read, `next build` should mark it `○` alongside every
 * other page.
 *
 * The parts are kept rather than deleted: ProjectFilter, ui/Chip and the
 * getAllTags() / getProjectsByTag() accessors all still exist and still
 * compile. They are unused on purpose, so filtering can come back without
 * rebuilding a designed primitive.
 */
export default function ProjectsPage() {
  const projects = getAllProjects();

  const emptyState = (
    <p className="text-muted py-16 text-center">Projects are on the way — check back soon.</p>
  );

  return (
    <Section>
      <h1 className="text-h-lg text-ink">Projects</h1>
      <p className="text-muted max-w-measure mt-4">{description}</p>

      <ProjectGrid
        projects={projects}
        emptyState={emptyState}
        cardHeadingLevel="h2"
        priorityCount={3}
        className="mt-10"
      />
    </Section>
  );
}
