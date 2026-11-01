import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StackStripProps = {
  items: readonly string[];
  /** What is being learned right now. Omitted, the right side simply closes up. */
  learning?: string;
  className?: string;
};

/** A slim bar naming the short stack. Renders nothing for an empty list. */
export function StackStrip({ items, learning, className }: StackStripProps) {
  if (items.length === 0) return null;

  return (
    <Card
      className={cn(
        "shadow-card flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md px-5 py-3",
        className,
      )}
    >
      <p className="text-eyebrow text-faint font-mono uppercase">Stack</p>
      <ul className="flex flex-1 flex-wrap gap-1.5">
        {items.map((item) => (
          <li key={item}>
            <Badge className="bg-surface-2">{item}</Badge>
          </li>
        ))}
      </ul>
      {learning ? <p className="text-muted text-sm">Learning now: {learning}</p> : null}
    </Card>
  );
}
