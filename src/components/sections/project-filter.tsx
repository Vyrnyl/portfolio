"use client";

import { usePathname, useRouter } from "next/navigation";

import { Chip } from "@/components/ui/chip";
import { cn } from "@/lib/utils";

type ProjectFilterProps = {
  /** Every distinct tag across all projects, from getAllTags(). */
  tags: string[];
  /** The tag currently active in the URL, or undefined for "All". */
  activeTag?: string;
  className?: string;
};

/**
 * The tag filter for /projects. Writes the active tag to the URL as
 * ?tag=<tag> via router.push, so the filtered view is shareable, survives a
 * refresh, and the back button steps through filter changes. This component
 * never filters anything itself — the page reads the same URL server-side
 * and decides what to render.
 */
export function ProjectFilter({ tags, activeTag, className }: ProjectFilterProps) {
  const router = useRouter();
  const pathname = usePathname();

  function select(tag: string | null) {
    router.push(tag ? `${pathname}?tag=${encodeURIComponent(tag)}` : pathname);
  }

  return (
    <ul aria-label="Filter projects by tag" className={cn("flex flex-wrap gap-2", className)}>
      <li>
        <Chip pressed={activeTag === undefined} onClick={() => select(null)}>
          All
        </Chip>
      </li>
      {tags.map((tag) => (
        <li key={tag}>
          <Chip pressed={activeTag === tag} onClick={() => select(tag)}>
            {tag}
          </Chip>
        </li>
      ))}
    </ul>
  );
}
