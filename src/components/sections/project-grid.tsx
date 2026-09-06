import type { ReactNode } from "react";

import { ProjectCard } from "@/components/sections/project-card";
import type { Project } from "@/content/types";
import { cn } from "@/lib/utils";

type ProjectGridProps = {
  projects: Project[];
  /** Rendered instead of the grid when `projects` is empty. Defaults to a plain message. */
  emptyState?: ReactNode;
  /** Heading level for each card title — passed straight through to ProjectCard. */
  cardHeadingLevel?: "h2" | "h3";
  /**
   * How many leading cards eager-load their thumbnail. A count rather than a
   * boolean because the grid is three-up at lg, so the first row holds three
   * LCP candidates on a wide screen and one on a phone. Marking more than the
   * first row eager would compete with it for bandwidth and make LCP worse.
   */
  priorityCount?: number;
  className?: string;
};

/**
 * The project card grid, shared by / (featured) and /projects (all,
 * filtered). Renders cards or the empty state — filtering, sorting and
 * "which projects" are entirely the caller's decision.
 */
export function ProjectGrid({
  projects,
  emptyState,
  cardHeadingLevel,
  priorityCount = 0,
  className,
}: ProjectGridProps) {
  if (projects.length === 0) {
    return emptyState ?? <p className="text-muted">No projects to show yet.</p>;
  }

  return (
    <div className={cn("grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3", className)}>
      {projects.map((project, index) => (
        <ProjectCard
          key={project.slug}
          project={project}
          headingLevel={cardHeadingLevel}
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
}
