import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { Practice } from "@/content/types";
import { cn } from "@/lib/utils";

type Props = {
  practice: Practice;
  className?: string;
};

/**
 * One "how I work" principle: icon, heading, body.
 *
 * Takes a `Practice` rather than three loose props — unlike `CaseStudy`, which
 * takes plain values because a case study is a shape anything can reuse, this
 * card renders one specific content type and nothing else has that shape.
 */
export function PracticeCard({ practice, className }: Props) {
  return (
    <Card padded className={cn("h-full", className)}>
      <span className="border-border bg-surface-2 text-fern flex size-10 items-center justify-center rounded-lg border">
        <Icon name={practice.icon} size={20} />
      </span>
      <h3 className="text-h-sm text-ink mt-5">{practice.title}</h3>
      <p className="text-muted mt-3 text-sm">{practice.body}</p>
    </Card>
  );
}
