import type { TimelineEntry } from "@/components/sections/timeline";
import { Card } from "@/components/ui/card";
import { formatRange } from "@/lib/dates";
import { cn } from "@/lib/utils";

type BackgroundListProps = {
  entries: readonly TimelineEntry[];
  className?: string;
};

/**
 * The compact work and study list on /about: role, place, dates, one row each.
 * Takes the same neutral entry as Timeline, which stays the full treatment on
 * /resume. Renders nothing for an empty list.
 */
export function BackgroundList({ entries, className }: BackgroundListProps) {
  if (entries.length === 0) return null;

  return (
    <Card className={cn("shadow-card flex flex-col p-6 md:p-7", className)}>
      <h2 className="text-eyebrow text-faint font-mono uppercase">Background</h2>
      {/* The rows share any spare height, so a taller tile beside this one
          never leaves a hole at the bottom. */}
      <ol className="divide-border mt-2 flex flex-1 flex-col divide-y">
        {entries.map((entry) => (
          <li key={entry.id} className="flex flex-1 flex-col justify-center py-3.5 last:pb-0">
            <p className="text-ink text-sm font-medium">{entry.title}</p>
            <p className="text-muted mt-0.5 text-sm">{entry.org}</p>
            <p className="text-badge text-faint mt-1.5 font-mono">
              {formatRange(entry.start, entry.end)}
            </p>
          </li>
        ))}
      </ol>
    </Card>
  );
}
