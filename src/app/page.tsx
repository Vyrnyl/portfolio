import { Section } from "@/components/layout/section";
import { Cta } from "@/components/sections/cta";
import { Hero } from "@/components/sections/hero";
import { ProjectCard } from "@/components/sections/project-card";
import { site } from "@/content/site";
import { getFeaturedProjects } from "@/lib/content";
import { buildPageMetadata, DEFAULT_OG_IMAGE, OG_IMAGE_SIZE } from "@/lib/seo";

/**
 * The home page is the one route whose title must NOT take the root template.
 *
 * `%s — Vernel Aquino` applied to a home title would render "Vernel Aquino —
 * Full-stack web developer — Vernel Aquino". `title.absolute` opts this single
 * page out of the template, which is precisely what that field is for.
 *
 * THE OG TITLES MUST BE OVERRIDDEN TOO, and not doing so was a real bug found
 * in PORT-056. `buildPageMetadata` takes a BARE title and appends the site name
 * itself to build `og:title`/`twitter:title` — so this page, which is the one
 * caller that must pass a full title, got the name appended a second time and
 * served "Vernel Aquino — Full-stack web developer — Vernel Aquino" to every
 * link preview. The `title.absolute` below fixed only the document <title>,
 * which is exactly why the defect survived: the browser tab read correctly
 * while the shared card did not. FOUR surfaces carry this one string — the
 * document title, `og:title`, `twitter:title` and `og:image:alt` — and each is
 * set explicitly below, because fixing the two obvious ones left the alt text
 * still doubled.
 */
const homeTitle = `${site.name} — ${site.role}`;

const homeMetadata = buildPageMetadata({
  title: homeTitle,
  description: site.tagline,
  path: "/",
});

export const metadata = {
  ...homeMetadata,
  title: { absolute: homeTitle },
  openGraph: {
    ...homeMetadata.openGraph,
    title: homeTitle,
    /* `og:image:alt` is built from the same appended string, so it doubled too
       — a fourth surface for one title. It is what a screen reader announces
       for a shared card. */
    images: [{ url: DEFAULT_OG_IMAGE, ...OG_IMAGE_SIZE, alt: homeTitle }],
  },
  twitter: { ...homeMetadata.twitter, title: homeTitle },
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
            {featuredProjects.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                priority={index < 3}
              />
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
