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

      <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {images.map((image) => (
          <li key={image.src}>
            <div className="aspect-thumbnail border-border relative w-full overflow-hidden rounded-lg border">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 760px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
