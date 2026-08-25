import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { Project } from "@/content/types";
import { cn } from "@/lib/utils";

const DIRECTION_TEXT = {
  previous: "Previous",
  next: "Next",
} as const;

type Direction = keyof typeof DIRECTION_TEXT;

type ProjectNavProps = {
  /** The entry above this one in the canonical order. Absent at the top of the list. */
  previous?: Project;
  /** The entry below this one. Absent at the bottom of the list. */
  next?: Project;
  className?: string;
};

/**
 * Previous / next links at the foot of a project page.
 *
 * getAdjacentProjects does not wrap around, so one of the two is missing on
 * the newest and the oldest project. Rather than centre a lone card or let it
 * drift to whichever side the grid puts it, the missing side renders an empty
 * cell — so "previous" always sits left and "next" always sits right, at every
 * width where there are two columns.
 */
export function ProjectNav({ previous, next, className }: ProjectNavProps) {
  if (!previous && !next) return null;

  return (
    <nav aria-labelledby="more-projects" className={cn(className)}>
      <h2 id="more-projects" className="text-eyebrow text-faint font-mono uppercase">
        More projects
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {previous ? <NavCard project={previous} direction="previous" /> : <div aria-hidden />}
        {next ? <NavCard project={next} direction="next" /> : null}
      </div>
    </nav>
  );
}

function NavCard({ project, direction }: { project: Project; direction: Direction }) {
  const isNext = direction === "next";

  return (
    <Link
      href={`/projects/${project.slug}`}
      aria-label={`${DIRECTION_TEXT[direction]} project: ${project.title}`}
      className={cn(
        "group block rounded-lg",
        "focus-visible:ring-ring focus-visible:ring-offset-ground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
      )}
    >
      <Card
        padded
        className={cn(
          "h-full transition-colors",
          "group-hover:border-fern group-focus-visible:border-fern",
          isNext && "md:text-right",
        )}
      >
        <span
          className={cn(
            "text-eyebrow text-faint flex items-center gap-2 font-mono uppercase",
            isNext && "md:justify-end",
          )}
        >
          {isNext ? null : <ArrowLeft size={14} strokeWidth={1.9} aria-hidden />}
          {DIRECTION_TEXT[direction]}
          {isNext ? <ArrowRight size={14} strokeWidth={1.9} aria-hidden /> : null}
        </span>

        <span className="text-h-sm text-ink group-hover:text-fern mt-2 block transition-colors">
          {project.title}
        </span>
      </Card>
    </Link>
  );
}
