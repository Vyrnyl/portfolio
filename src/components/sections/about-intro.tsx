import Image from "next/image";

import { Icon } from "@/components/ui/icon";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

type AboutIntroProps = {
  className?: string;
};

/**
 * The opening block of /about: who this is, in one line each, next to the
 * portrait.
 *
 * Reads `site` directly rather than taking props — the same carve-out Header,
 * Footer and Hero already use (content-model.md §4), and for the same reason:
 * there is exactly one person on this site, and threading their own name
 * through a prop would invent a configurability nothing wants.
 *
 * Deliberately does NOT repeat site.tagline. Hero already leads with it on the
 * home page, and the bio's first paragraph is this page's lead instead.
 *
 * The text comes before the photo in the DOM so a screen reader and a phone
 * both meet the heading first; at lg the photo moves into the right-hand
 * column purely by grid placement, with no order juggling. The columns are
 * centred against each other at lg because the portrait is roughly four times
 * the height of the two text lines beside it — top-aligned, it left a visible
 * hole under the name.
 */
export function AboutIntro({ className }: AboutIntroProps) {
  const meta = [
    { icon: "Briefcase", text: site.role },
    { icon: "MapPin", text: site.location },
  ] as const;

  return (
    <header
      className={cn(
        "grid items-start gap-10 lg:grid-cols-3 lg:items-center lg:gap-16",
        className,
      )}
    >
      <div className="lg:col-span-2">
        <p className="text-eyebrow text-faint mb-4 font-mono uppercase">About</p>

        <h1 className="text-h-lg text-ink">{site.name}</h1>

        <ul className="text-muted mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          {meta.map((item) => (
            <li key={item.text} className="inline-flex items-center gap-2">
              <Icon name={item.icon} className="text-faint" />
              {item.text}
            </li>
          ))}
        </ul>
      </div>

      {/*
        The photo keeps its NATIVE ratio and the container fits around it —
        no `aspect-*` box, no `object-contain`, nothing scaled to a shape it
        is not. The image is laid out from its own intrinsic width/height
        (`h-auto w-full`), and the padded frame simply takes whatever height
        that produces.

        This is the opposite of ProjectGallery's fixed box, on purpose. A
        grid of screenshots needs uniform cells so the rows align; a single
        portrait has nothing to align WITH, so forcing it into 4:5 only
        letterboxes a photo that was already the right shape.
      */}
      <div className="border-border bg-surface-2 mx-auto w-full max-w-2xs rounded-lg border p-3 lg:mx-0 lg:max-w-none">
        <Image
          src={site.photo.src}
          alt={site.photo.alt}
          width={site.photo.width}
          height={site.photo.height}
          /*
             Measured, not guessed: the rendered slot is 289px wide at lg.
             An understated `sizes` had the optimizer serving a 174px file
             stretched to 289px — the whole frame was there, just upscaled
             and soft. These values keep the smallest srcSet candidate at or
             above the real slot width on a 1x display, and let a 2x display
             pick a larger one.
          */
          sizes="(min-width: 1000px) 384px, (min-width: 460px) 320px, 90vw"
          priority
          className="h-auto w-full rounded-sm"
        />
      </div>
    </header>
  );
}
