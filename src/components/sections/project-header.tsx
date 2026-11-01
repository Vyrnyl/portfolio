import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Project, ProjectStatus } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * The visible word for each status. A full Record over the union, so adding a
 * fourth ProjectStatus in types.ts fails the build here rather than rendering
 * `undefined` in the eyebrow — the same guard Footer uses for social platforms.
 */
const STATUS_TEXT: Record<ProjectStatus, string> = {
  live: "Live",
  archived: "Archived",
  "in-progress": "In progress",
};

type ProjectHeaderProps = {
  project: Project;
  className?: string;
};

/**
 * The opening block of a project's detail page: what it is, when, and what it
 * looks like. Links and stack live in ProjectFacts beside the case study.
 */
export function ProjectHeader({ project, className }: ProjectHeaderProps) {
  // types.ts promises this fallback: "Wide image for the detail page header.
  // Falls back to thumbnail when absent." Without it a project with no cover
  // opens on a bare wall of text while every other one opens on an image.
  const cover = project.cover ?? project.thumbnail;

  return (
    <header className={cn(className)}>
      {/*
        A real <Link> to /projects, never router.back(). History is not a
        reliable map of where the visitor came from: a shared link, a search
        result or an opened-in-new-tab card all land here with nothing to go
        back to, and back() would either do nothing or leave the site. The
        index is the true parent of this page regardless of the route taken.

        Styled as a quiet text link rather than a Button on purpose — the 404
        and error pages use a Button because it is their only exit, whereas
        here it sits directly above the <h1> and must not compete with it.
      */}
      <Link
        href="/projects"
        className={cn(
          "text-muted hover:text-fern mb-6 inline-flex items-center gap-1.5 rounded-md text-sm font-medium transition-colors",
          "focus-visible:ring-ring focus-visible:ring-offset-ground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        )}
      >
        <ArrowLeft size={14} strokeWidth={1.9} aria-hidden />
        All projects
      </Link>

      <p className="text-eyebrow text-faint mb-4 font-mono uppercase">
        {project.year} · {STATUS_TEXT[project.status]}
      </p>

      <h1 className="text-h-lg text-ink">{project.title}</h1>

      <p className="text-lead text-muted mt-6 max-w-measure">{project.summary}</p>

      {/*
        Full shell width, so it shares both edges with the gallery and the
        case study grid below. Decided with Vernel 2026-11-01, replacing the
        800px cap: the capped image left the right third of the page empty.
      */}
      <Image
        src={cover.src}
        alt={cover.alt}
        width={cover.width}
        height={cover.height}
        sizes="(min-width: 1120px) 1120px, 100vw"
        priority
        className="border-border shadow-card mt-10 h-auto w-full rounded-lg border"
      />
    </header>
  );
}
