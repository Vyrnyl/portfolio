import type { Metadata } from "next";

import { Section } from "@/components/layout/section";
import { Timeline, type TimelineEntry } from "@/components/sections/timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
import { getEducation, getJobs, getSkillGroups } from "@/lib/content";

const title = `Resume — ${site.name}`;
const description =
  "Experience, education and the tools I work with — plus a PDF you can take away.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${site.url}/resume`,
    siteName: site.name,
    type: "profile",
  },
};

/**
 * /resume — the timeline version of the PDF.
 *
 * Both timelines are fed by mapping content into Timeline's own
 * `TimelineEntry` shape. That mapping is the page's job precisely because
 * `Job` and `Education` disagree about what the two lines are called
 * (role/company vs credential/institution); pushing it into the component
 * would mean a union and a discriminant for no gain.
 *
 * Education entries pass `note` as a one-item `bullets` array rather than
 * getting their own prop — a note and a bullet render identically, and a
 * second rendering branch is a second thing to keep in sync.
 *
 * KNOWN GAP, tracked as PORT-059: the PDF at `site.resumePdf` is older than
 * this page and does not contain the OpalusPH internship the timeline above it
 * shows. The download is live anyway by decision (2026-09-02) — the same
 * unblock-and-track move PORT-012 and PORT-033 made — because hiding the
 * button removes the page's main action and leaves nothing tracked on the
 * board.
 */
export default function ResumePage() {
  const jobs = getJobs();
  const education = getEducation();
  const skillGroups = getSkillGroups();

  const jobEntries: TimelineEntry[] = jobs.map((job) => ({
    id: `${job.company}-${job.start}`,
    title: job.role,
    org: job.company,
    start: job.start,
    end: job.end,
    location: job.location,
    bullets: job.bullets,
    stack: job.stack,
  }));

  const educationEntries: TimelineEntry[] = education.map((entry) => ({
    id: `${entry.institution}-${entry.start}`,
    title: entry.credential,
    org: entry.institution,
    start: entry.start,
    end: entry.end,
    bullets: entry.note ? [entry.note] : undefined,
  }));

  return (
    <>
      <Section spacing="tight">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
          <div>
            <p className="text-eyebrow text-faint mb-4 font-mono uppercase">Resume</p>
            <h1 className="text-h-lg text-ink">{site.name}</h1>
            <p className="text-lead text-muted max-w-measure mt-4">{site.role} — {site.location}.</p>
          </div>

          {/* print:hidden — on paper the reader is already holding it. */}
          <Button
            href={site.resumePdf}
            target="_blank"
            rel="noopener noreferrer"
            className="print:hidden"
          >
            Download PDF
          </Button>
        </div>
      </Section>

      <Section heading="Experience" spacing="tight">
        <Timeline
          entries={jobEntries}
          icon="Briefcase"
          emptyState="Experience is being written up — check back soon."
        />
      </Section>

      <Section heading="Education" spacing="tight">
        <Timeline
          entries={educationEntries}
          icon="GraduationCap"
          emptyState="Education details are being written up — check back soon."
        />
      </Section>

      <Section heading="Skills" spacing="tight">
        {skillGroups.length > 0 ? (
          <div className="grid gap-10 lg:grid-cols-3">
            {skillGroups.map((group) => (
              <div key={group.tier} className="break-inside-avoid">
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
    </>
  );
}
