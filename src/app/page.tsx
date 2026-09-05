import { Section } from "@/components/layout/section";
import { Cta } from "@/components/sections/cta";
import { Hero } from "@/components/sections/hero";
import { ProjectCard } from "@/components/sections/project-card";
import { site } from "@/content/site";
import { getFeaturedProjects } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

/**
 * The home page is the one route whose title must NOT take the root template.
 *
 * `%s — Vernel Aquino` applied to a home title would render "Vernel Aquino —
 * Full-stack web developer — Vernel Aquino". `title.absolute` opts this single
 * page out of the template, which is precisely what that field is for.
 */
export const metadata = {
  ...buildPageMetadata({
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
    path: "/",
  }),
  title: { absolute: `${site.name} — ${site.role}` },
};

export default function HomePage() {
  const featuredProjects = getFeaturedProjects();

  return (
    <>
      <Section>
        <Hero />
      </Section>

      <Section heading="Featured work">
        {featuredProjects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-muted">Projects are on the way — check back soon.</p>
        )}
      </Section>

      <Section>
        <Cta
          heading="Have a project in mind?"
          body="I'm open to new opportunities — reach out and let's talk about what you're building."
          primary={{ label: "Get in touch", href: "/contact" }}
          secondary={{ label: "See my work", href: "/projects" }}
        />
      </Section>
    </>
  );
}
