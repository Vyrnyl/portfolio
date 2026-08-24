import type { Metadata } from "next";

import { Cta } from "@/components/sections/cta";
import { Hero } from "@/components/sections/hero";
import { ProjectCard } from "@/components/sections/project-card";
import { Section } from "@/components/layout/section";
import { site } from "@/content/site";
import { getFeaturedProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.tagline,
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
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
