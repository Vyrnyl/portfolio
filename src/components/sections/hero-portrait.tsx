import Image from "next/image";

import { site } from "@/content/site";
import { cn } from "@/lib/utils";

type HeroPortraitProps = {
  className?: string;
};

/**
 * The portrait tile on `/`: a cutout standing on a fern panel, with the head
 * rising past the panel's top edge, above a strip naming place and role.
 *
 * Always eager. This is the home page's largest image above the fold, and
 * next/image's default lazy loading would defer the LCP element.
 */
export function HeroPortrait({ className }: HeroPortraitProps) {
  return (
    <figure className={cn("flex flex-col", className)}>
      <div className="relative flex flex-1 items-end justify-center">
        <div aria-hidden className="portrait-glow absolute -top-8 left-0 aspect-square w-3/5" />
        <div
          aria-hidden
          className="portrait-panel absolute inset-x-0 top-7 bottom-0 rounded-t-lg lg:top-19"
        />
        <Image
          src={site.heroPortrait.src}
          alt={site.heroPortrait.alt}
          width={site.heroPortrait.width}
          height={site.heroPortrait.height}
          sizes="(min-width: 1000px) 400px, 85vw"
          priority
          className="relative h-auto w-5/6 max-w-md"
        />
      </div>

      <figcaption className="bg-surface border-border shadow-card flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-b-lg border border-t-0 px-5 py-4">
        <span className="text-badge text-ink font-mono">{site.location}</span>
        <span className="text-muted text-sm">{site.role}</span>
      </figcaption>
    </figure>
  );
}
