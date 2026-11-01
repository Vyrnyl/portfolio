import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { Project } from "@/content/types";
import { cn } from "@/lib/utils";

type LatestWorkProps = {
  project: Project;
  className?: string;
};

/**
 * One project on `/`, shown in a small browser window. Like ProjectCard, the
 * whole tile is a single <Link> with no aria-label, and the screenshot is
 * decorative here so its alt text does not lead the link's accessible name.
 *
 * The "Live" marker only appears for a live project: an archived one has
 * nothing to point at, and the tile must not claim otherwise.
 */
export function LatestWork({ project, className }: LatestWorkProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group block rounded-lg",
        "focus-visible:ring-ring focus-visible:ring-offset-ground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        className,
      )}
    >
      <Card className="group-hover:border-fern group-hover:shadow-card-lift group-focus-visible:border-fern group-focus-visible:shadow-card-lift shadow-card flex h-full flex-col-reverse overflow-hidden transition-all duration-200 md:flex-row">
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-eyebrow text-faint font-mono uppercase">Latest work</p>
            {project.status === "live" ? (
              <p className="text-fern flex items-center gap-1.5 text-sm">
                <span aria-hidden className="bg-fern size-2 rounded-full" />
                Live
              </p>
            ) : null}
          </div>
          <h2 className="text-h-sm text-ink mt-auto">{project.title}</h2>
          <p className="text-muted mt-1 text-sm">{project.summary}</p>
          <p className="text-fern mt-2 inline-flex items-center gap-1 text-sm font-medium">
            View project
            <ArrowRight size={14} strokeWidth={1.9} aria-hidden />
          </p>
        </div>

        <div className="flex p-3 pb-0 md:w-1/2 md:pb-3 md:pl-0">
          <div className="bg-surface-2 border-border flex flex-1 flex-col overflow-hidden rounded-md border">
            <div aria-hidden className="border-border flex h-5 items-center gap-1 border-b px-2.5">
              <span className="bg-border-strong size-1.5 rounded-full" />
              <span className="bg-border-strong size-1.5 rounded-full" />
              <span className="bg-border-strong size-1.5 rounded-full" />
            </div>
            <div className="aspect-thumbnail relative md:aspect-auto md:flex-1">
              <Image
                src={project.thumbnail.src}
                alt=""
                aria-hidden
                fill
                sizes="(min-width: 760px) 360px, 100vw"
                className="object-cover object-top-left"
              />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
