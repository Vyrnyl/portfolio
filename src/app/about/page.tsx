import type { Metadata } from "next";
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { AboutIntro } from "@/components/sections/about-intro";
import { Cta } from "@/components/sections/cta";
import { Badge } from "@/components/ui/badge";
import { Prose } from "@/components/ui/prose";
import { site } from "@/content/site";
import { getSkillGroups } from "@/lib/content";

const title = `About — ${site.name}`;
const description =
  "Full-stack web developer in the Philippines — what I build, where I have built it, and what I am learning now.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${site.url}/about`,
    siteName: site.name,
    type: "profile",
    // No `images` on purpose. The portrait is still the "PHOTO PENDING"
    // placeholder, and an OG image is what every shared link renders. Site-wide
    // OG images are PORT-050; this page opts out until there is a real photo.
  },
};

/**
 * /about — intro, bio, what I work with, and the way out to the resume and the
 * contact form.
 *
 * The bio is JSX rather than a content file: it carries an inline link, appears
 * exactly once, and putting markup inside a typed content string would mean
 * either a markdown renderer or HTML in content — both ruled out (build-plan
 * §9, "no blog, no MDX").
 *
 * Every factual claim below is traceable to something already in the repo:
 *   ¶1  education[0] (BSIT, Catanduanes State University) + site.location;
 *       the full-stack framing is jobs[1].bullets, the freelance role.
 *   ¶2  role-based access in jobs[1].bullets, projects "grades-repository-
 *       system" and "cict-project-gate" — the three separate builds.
 *   ¶3  projects "cict-project-gate": embeddings + cosine similarity, GPT-4 as
 *       decision support with approval left to people.
 *   ¶4  jobs[0] (OpalusPH, Feb–May 2026) and jobs[1] (Freelance, 2024). NOTE:
 *       jobs[0].bullets are still placeholder, so nothing is claimed about what
 *       that role achieved — only that it happened.
 *   ¶5  skillGroups "learning" tier, verbatim in substance.
 * Nothing here was invented. The voice is a first draft and Vernel's to rewrite;
 * the facts are the part that must not drift.
 *
 * The skills block is the COMPACT treatment — tier label, what the tier means,
 * then the items as badges. The full /skills page with dot weight and swatch
 * saturation is PORT-037's SkillTier, which this must not grow into.
 */
export default function AboutPage() {
  const skillGroups = getSkillGroups();

  return (
    <>
      <Section spacing="tight">
        <AboutIntro />
      </Section>

      <Section spacing="tight">
        <Prose>
          <p>
            I&apos;m a full-stack web developer based in the Philippines, finishing a BS in
            Information Technology at Catanduanes State University. Most of what I&apos;ve built has
            been full-stack rather than front-of-house only — a schema, an API over it, the rules
            deciding who may see what, and then the interface on top.
          </p>
          <p>
            The thread running through it is access control. I&apos;ve built role-based permissions
            three separate times — for a freelance client&apos;s application, for a grades repository
            serving students, faculty and administrators, and for a capstone submission platform —
            and each time the interesting part was the same: deciding a permission once, in one
            layer, instead of re-checking it screen by screen.
          </p>
          <p>
            The most recent of those, CICT Project Gate, compares a proposed capstone title against
            every title already submitted using vector embeddings and cosine similarity rather than
            keyword matching, because near-duplicate topics are rarely worded alike. GPT-4 sits on
            top as a decision-support layer that suggests and refines titles; approving them stays
            with people. There is more on that one, and the rest, in{" "}
            <Link href="/projects">my projects</Link>.
          </p>
          <p>
            Outside coursework I worked as a frontend developer at OpalusPH from February to May
            2026, and in 2024 I delivered a full-stack application for a freelance client on my own
            — schema, API and interface — on schedule.
          </p>
          <p>
            Right now I&apos;m working through React Server Components and the App Router,
            accessibility to WCAG 2.2 AA, and token-driven design systems. This site is where most of
            that is happening. I&apos;d rather list those as things I&apos;m learning than claim them
            outright.
          </p>
        </Prose>
      </Section>

      <Section heading="What I work with">
        {skillGroups.length > 0 ? (
          <div className="grid gap-10 lg:grid-cols-3">
            {skillGroups.map((group) => (
              <div key={group.tier}>
                <h3 className="text-h-sm text-ink">{group.label}</h3>
                <p className="text-muted mt-2 text-sm">{group.blurb}</p>
                {group.items.length > 0 ? (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li key={item}>
                        <Badge>{item}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">The skills list is being written up — check back soon.</p>
        )}
      </Section>

      <Section>
        <Cta
          heading="Want the short version?"
          body="The resume has the dates, the stack and the coursework on one page. If you would rather just talk, the contact form reaches my inbox directly."
          primary={{ label: "Read my resume", href: "/resume" }}
          secondary={{ label: "Get in touch", href: "/contact" }}
        />
      </Section>
    </>
  );
}
