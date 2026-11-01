import { Card } from "@/components/ui/card";
import type { Stat } from "@/content/types";
import { cn } from "@/lib/utils";

type StatRowProps = {
  stats: readonly Stat[];
  className?: string;
};

/**
 * The "At a glance" tile on `/`. A real <dl>, with each label read before its
 * figure; `flex-col-reverse` puts the figure on top for the eye only.
 *
 * Renders nothing for an empty list, because a heading over no figures has
 * nothing to say.
 */
export function StatRow({ stats, className }: StatRowProps) {
  if (stats.length === 0) return null;

  return (
    <Card className={cn("shadow-card flex flex-col gap-4 p-5 md:p-6", className)}>
      <p className="text-eyebrow text-faint font-mono uppercase">At a glance</p>
      <dl className="grid flex-1 auto-cols-fr grid-flow-col">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border-border flex flex-col-reverse justify-start gap-3 border-l pl-5 first:border-l-0 first:pl-0"
          >
            <dt className="text-eyebrow text-faint w-min leading-normal font-mono uppercase">
              {stat.label}
            </dt>
            <dd className="text-stat text-fern">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
