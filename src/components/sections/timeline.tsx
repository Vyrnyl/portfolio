import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/content/types";
import { formatRange, machineDate } from "@/lib/dates";
import { cn } from "@/lib/utils";

/**
 * One entry in a vertical timeline. Deliberately NOT `Job` or `Education` —
 * both feed this component, and they differ in field names only
 * (company/institution, role/credential). The page maps each into this shape,
 * so Timeline stays a layout with no opinion about which content type it came
 * from.
 */
export type TimelineEntry = {
  /** Stable React key. The page builds it from the source content. */
  id: string;
  /** The bold line: a job title, or a credential. */
  title: string;
  /** The organisation: a company, or an institution. */
  org: string;
  start: string;
  /** `null` renders as "Present" and marks the entry as current. */
  end: string | null;
  location?: string;
  /** Achievement bullets, or a single note for an education entry. */
  bullets?: string[];
  stack?: string[];
};

type Props = {
  entries: TimelineEntry[];
  /** The icon marking each node — Briefcase for jobs, GraduationCap for study. */
  icon: IconName;
  /** Rendered when `entries` is empty. Every list on this site needs one. */
  emptyState: React.ReactNode;
  className?: string;
};

/**
 * A vertical timeline of dated entries, newest first.
 *
 * The rail is drawn by a pseudo-element on each item rather than one
 * absolutely positioned line down the list. That is what makes the whole thing
 * survive `@media print`: an absolute rail keeps its height from the screen
 * layout and runs off the bottom of a printed page, whereas a per-item line
 * re-flows with the content and simply stops where each item stops.
 *
 * The last item's rail is trimmed to the height of its marker
 * (`last:before:h-6`), so the line ends at the final node instead of trailing
 * into whitespace under it.
 *
 * THE TITLE/DATE ROW IS BREAKPOINT-DRIVEN, NOT WRAP-DRIVEN. It stacks below
 * `md` and only becomes a row above it. An earlier version used
 * `flex-wrap` and let each item wrap on its own, which measured fine but
 * looked broken: at 460 and 375 the two longer titles pushed their dates onto
 * a second line while "Web Developer" — short enough to fit — kept its date
 * beside it, so one list rendered in two different layouts at the same width.
 * A flex-wrap decision is made per item by string length; this one is made
 * once, by the breakpoint, so every item in a list always agrees.
 */
export function Timeline({ entries, icon, emptyState, className }: Props) {
  if (entries.length === 0) {
    return <div className={cn("text-muted", className)}>{emptyState}</div>;
  }

  return (
    <ol className={cn("space-y-10", className)}>
      {entries.map((entry) => {
        const isCurrent = entry.end === null;

        return (
          <li
            key={entry.id}
            className={cn(
              "relative pl-10",
              // The rail. A pseudo-element rather than a border on the <li>
              // itself, so the last item can shorten it without also losing
              // the padding that keeps text clear of the markers.
              "before:bg-border before:absolute before:top-0 before:bottom-0 before:left-[11px] before:w-px before:content-['']",
              "last:before:bottom-auto last:before:h-6",
              // Never split an entry across two printed pages.
              "break-inside-avoid",
            )}
          >
            {/* The node. Sits on top of the rail, filled with the page ground
                so the line does not show through the ring. */}
            <span
              aria-hidden
              className={cn(
                "bg-ground absolute top-0 left-0 flex size-6 items-center justify-center rounded-full",
                isCurrent ? "text-fern ring-fern ring-2" : "text-faint ring-border ring-1",
              )}
            >
              <Icon name={icon} size={13} />
            </span>

            <div className="md:flex md:items-baseline md:justify-between md:gap-x-6">
              <h3 className="text-h-sm text-ink">{entry.title}</h3>
              {/* shrink-0 so the range never wraps mid-date once it is a row. */}
              <p className="text-muted mt-1 font-mono text-sm md:mt-0 md:shrink-0">
                <time dateTime={machineDate(entry.start)}>
                  {formatRange(entry.start, entry.end)}
                </time>
              </p>
            </div>

            <p className="text-muted mt-1 text-sm">
              {entry.org}
              {entry.location ? <span className="text-faint"> · {entry.location}</span> : null}
            </p>

            {entry.bullets && entry.bullets.length > 0 ? (
              <ul className="text-muted mt-4 space-y-2 text-base">
                {entry.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="before:text-faint relative pl-5 before:absolute before:left-0 before:content-['—']"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : null}

            {entry.stack && entry.stack.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {entry.stack.map((item) => (
                  <li key={item}>
                    <Badge>{item}</Badge>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
