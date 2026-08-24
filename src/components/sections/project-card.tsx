import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Project } from "@/content/types";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  className?: string;
};

/**
 * A project shown as one clickable card: thumbnail, title, year, summary,
 * tags. The whole card is a single <Link> to /projects/[slug] — everything
 * inside it, including the tags, is deliberately non-interactive, because a
 * link cannot contain another link without breaking.
 */
export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      aria-label={project.title}
      className={cn(
        "group block rounded-lg",
        "focus-visible:ring-ring focus-visible:ring-offset-ground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        className,
      )}
    >
      <Card
        className={cn(
          "overflow-hidden p-0 transition-all duration-200",
          "group-hover:border-fern group-hover:shadow-card-lift",
          "group-focus-visible:border-fern group-focus-visible:shadow-card-lift",
        )}
      >
        <div className="aspect-thumbnail relative w-full">
          <Image
            src={project.thumbnail.src}
            alt={project.thumbnail.alt}
            fill
            sizes="(min-width: 1000px) 33vw, (min-width: 760px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="space-y-3 p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-h-sm text-ink">{project.title}</h3>
            <span className="text-badge text-faint shrink-0 font-mono">
              {project.year}
            </span>
          </div>
          <p className="text-muted text-sm">{project.summary}</p>
          {project.tags.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <li key={tag}>
                  <Badge>{tag}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </Link>
  );
}
