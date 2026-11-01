import type { ReactNode } from "react";

import type { SocialLink } from "@/content/types";

/**
 * Drawn here because lucide-react dropped its brand icons in v1. Same grid and
 * stroke as Icon's defaults, so they sit beside the lucide marks unnoticed.
 *
 * Partial on purpose: email has no entry because its address always has its
 * own row, and a platform with no mark simply gets no button.
 */
const SOCIAL_MARKS: Partial<Record<SocialLink["platform"], ReactNode>> = {
  github: (
    <>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-5-2" />
    </>
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
};

/** True when `platform` has a mark, so a caller can skip the whole button. */
export function hasSocialMark(platform: SocialLink["platform"]) {
  return platform in SOCIAL_MARKS;
}

/** A platform's brand mark, decorative: its link carries the accessible name. */
export function SocialMark({ platform }: { platform: SocialLink["platform"] }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {SOCIAL_MARKS[platform]}
    </svg>
  );
}
