import { Section } from "@/components/layout/section";
import { AboutIntro } from "@/components/sections/about-intro";
import { BackgroundList } from "@/components/sections/background-list";
import { Cta } from "@/components/sections/cta";
import { StackStrip } from "@/components/sections/stack-strip";
import type { TimelineEntry } from "@/components/sections/timeline";
import { site } from "@/content/site";
import { getEducation, getJobs } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

/**
 * /about ships PORT-050's typographic OG card, reversing PORT-033's opt-out.
 * Decided with Vernel 2026-09-05.
 */
export const metadata = buildPageMetadata({
  title: "About",
  description:
    "Full-stack web developer in the Philippines — what I build, where I have built it, and what I am learning now.",
  path: "/about",
  type: "profile",
});

/** /about: a short bio and background, in the same tiles as the home page. */
export default function AboutPage() {
  const background: TimelineEntry[] = [
    ...getJobs().map((job) => ({
      id: `${job.company}-${job.start}`,
      title: job.role,
      org: job.company,
      start: job.start,
      end: job.end,
    })),
    ...getEducation().map((entry) => ({
      id: `${entry.institution}-${entry.start}`,
      title: entry.credential,
      org: entry.institution,
      start: entry.start,
      end: entry.end,
    })),
  ];

  return (
    <Section spacing="tight" className="pt-7">
      <div className="grid gap-3 md:gap-4 lg:grid-cols-12">
        <AboutIntro className={background.length > 0 ? "lg:col-span-7" : "lg:col-span-12"} />
        <BackgroundList entries={background} className="lg:col-span-5" />

        <StackStrip items={site.stack} className="lg:col-span-12" />

        <Cta
          heading="Want the full picture?"
          body="The resume has the dates, the stack and the coursework on one page. If you would rather just talk, the contact form reaches my inbox directly."
          primary={{ label: "Read my resume", href: "/resume" }}
          secondary={{ label: "Get in touch", href: "/contact" }}
          className="lg:col-span-12"
        />
      </div>
    </Section>
  );
}
