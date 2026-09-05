import { Section } from "@/components/layout/section";
import { Cta } from "@/components/sections/cta";
import { PracticeCard } from "@/components/sections/practice-card";
import { SkillTier } from "@/components/sections/skill-tier";
import { getPractices, getSkillGroups } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Skills",
  description:
    "What I am confident in, what I have working knowledge of, and what I am learning now — graded honestly, with no percentage bars.",
  path: "/skills",
});


/**
 * /skills — three honest tiers, then the four habits behind them.
 *
 * The intro sits inside the first Section rather than in a Section of its own.
 * Two stacked `spacing="tight"` bands add their padding together, and because
 * the token is fluid the gap grows with the breakpoint — that was the 128px
 * void PORT-036 found at 1440.
 *
 * That is also why the tier group's <h2> is written inline instead of passed as
 * `Section`'s `heading` prop: the prop renders above `children`, which would put
 * the heading above the page's own <h1>. Without it the outline ran 1 → 3 and
 * the three tier <h3>s hung off no section heading at all (WCAG 1.3.1).
 */
export default function SkillsPage() {
  const skillGroups = getSkillGroups();
  const practices = getPractices();

  return (
    <>
      <Section spacing="tight">
        <p className="text-eyebrow text-faint mb-4 font-mono uppercase">Skills</p>
        <h1 className="text-h-lg text-ink">What I can build with</h1>
        <p className="text-lead text-muted mt-6 max-w-measure">
          Graded by what I have actually shipped, not by a number out of ten. The tiers below say
          what each level means, and the last one exists because a skills page that only lists
          strengths is not telling you anything.
        </p>

        <h2 className="text-h-md text-ink mt-14">Where I am</h2>

        {skillGroups.length > 0 ? (
          <div className="mt-8 grid gap-10 lg:grid-cols-3 lg:gap-8">
            {skillGroups.map((group) => (
              <SkillTier key={group.tier} group={group} />
            ))}
          </div>
        ) : (
          <p className="text-muted mt-8">
            The skills list is being written up — check back soon.
          </p>
        )}
      </Section>

      <Section heading="How I work">
        {practices.length > 0 ? (
          <ul className="grid gap-6 md:grid-cols-2">
            {practices.map((practice) => (
              <li key={practice.title}>
                <PracticeCard practice={practice} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">Still writing this part up.</p>
        )}
      </Section>

      <Section>
        <Cta
          heading="See it in the work"
          body="The projects go through the same reasoning in detail — the problem, the approach and what actually came out of it. The resume has the dates and the coursework on one page."
          primary={{ label: "View my projects", href: "/projects" }}
          secondary={{ label: "Read my resume", href: "/resume" }}
        />
      </Section>
    </>
  );
}
