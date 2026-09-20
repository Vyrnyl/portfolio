import Image from "next/image";

import type { ImageAsset } from "@/content/types";
import { cn } from "@/lib/utils";

type ProjectGalleryProps = {
  images: ImageAsset[];
  className?: string;
};

/**
 * Extra screenshots for a project that has them.
 *
 * Renders nothing — not an empty wrapper, not a heading — when the list is
 * empty. The caller still has to decide whether to wrap it in a <Section>,
 * because a Section around nothing is a band of blank vertical padding, and
 * only the caller knows it is dealing with an optional field.
 *
 * Unlike the page header, these images DO sit in a fixed aspect-ratio box.
 * They are a grid, and a grid with one odd-sized cell breaks its row — the
 * same reason ProjectCard's thumbnail uses this box.
 */
export function ProjectGallery({ images, className }: ProjectGalleryProps) {
  if (images.length === 0) return null;

  return (
    <section className={cn(className)}>
      <h2 className="text-eyebrow text-faint font-mono uppercase">Gallery</h2>

      {/*
        Three-up at lg, two at md. Screenshots of a UI read better as a set of
        smaller tiles than as two large ones: the eye is scanning for "what
        else is in here", and the detail is a click away on the real site.
        `sizes` names all three steps — a stale `50vw` here would have the
        browser fetch a double-width candidate for every lg cell.
      */}
      <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <li key={image.src}>
            {/*
              `object-contain` on a neutral ground, not `cover` in a fixed box.
              A screenshot cropped is a screenshot lying: the 16:10 box this
              used to force cut 21% off the width of every real capture, which
              on a UI means losing a whole table column. The box keeps a fixed
              ratio so the grid rows still align; the image letterboxes inside
              it instead of being trimmed to fit.
            */}
            <div className="aspect-thumbnail border-border bg-surface-2 relative w-full overflow-hidden rounded-lg border">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1000px) 33vw, (min-width: 760px) 50vw, 100vw"
                className="object-contain"
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
