import { Prose } from "@/components/ui/prose";
import { cn } from "@/lib/utils";

type CaseStudyProps = {
  problem: string;
  approach: string;
  outcome: string;
  /**
   * Optional bullets. Two of the four current projects have them; the block
   * does not render at all when they are absent, leaving no gap behind.
   */
  highlights?: string[];
  className?: string;
};

/**
 * The narrative body of a project page: problem, approach, outcome, and
 * highlights when there are any.
 *
 * Takes four plain values rather than a `Project`, because a case study is a
 * shape — heading, then prose — not a project. Anything with that shape can
 * use it without owning a Project.
 *
 * Each block's label is a real <h2> wearing the eyebrow's type style, not a
 * decorative <p>. That keeps the page navigable by heading while looking the
 * way the registry describes it.
 */
export function CaseStudy({ problem, approach, outcome, highlights, className }: CaseStudyProps) {
  const blocks = [
    { heading: "The problem", body: problem },
    { heading: "The approach", body: approach },
    { heading: "The outcome", body: outcome },
  ];

  return (
    <div className={cn("space-y-12", className)}>
      {blocks.map((block) => (
        <section key={block.heading}>
          <h2 className="text-eyebrow text-faint font-mono uppercase">{block.heading}</h2>
          <Prose className="mt-4">
            <p>{block.body}</p>
          </Prose>
        </section>
      ))}

      {highlights && highlights.length > 0 ? (
        <section>
          <h2 className="text-eyebrow text-faint font-mono uppercase">Highlights</h2>
          <Prose className="mt-4">
            <ul>
              {highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </Prose>
        </section>
      ) : null}
    </div>
  );
}
