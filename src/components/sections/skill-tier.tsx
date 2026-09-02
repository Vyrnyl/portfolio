import { Badge } from "@/components/ui/badge";
import type { SkillGroup, SkillTier as Tier } from "@/content/types";
import { cn } from "@/lib/utils";

type Props = {
  group: SkillGroup;
  className?: string;
};

const DOT_COUNT = 3;

/**
 * How many dots each tier fills, out of DOT_COUNT. A full Record over
 * SkillTier, so a fourth tier fails the build here rather than rendering zero
 * dots and looking like a deliberate "none".
 */
const TIER_WEIGHT: Record<Tier, number> = {
  confident: 3,
  working: 2,
  learning: 1,
};

/**
 * Dot size per tier — the second visual variable, and the reason no step needs
 * a dimmed colour.
 *
 * Two earlier attempts failed a real contrast measurement. Wash tokens
 * (`fern-wash`, `surface-2`) came out at 1.02–1.23:1 against the ground and
 * were invisible on screen. Opacity over `fern` was better but still short:
 * 2.79:1 at 70% and 1.86:1 at 45% in light, where WCAG 1.4.11 asks 3:1 of a
 * non-text element carrying meaning. The cause is headroom — light-mode fern
 * starts at only 3.31:1, so there is nothing to dim into. Size carries the
 * same information at zero contrast cost, and "dot weight" is what the ticket
 * asked for in the first place.
 */
const TIER_DOT_SIZE: Record<Tier, string> = {
  confident: "size-2.5",
  working: "size-2",
  learning: "size-1.5",
};

/**
 * One skill tier: a weighted dot meter, the tier's label and what it means,
 * then its items as badges.
 *
 * The meter encodes depth twice — how many dots are filled and how large they
 * are — so it never rests on colour alone (WCAG 1.4.1). `blurb` states the
 * tier's meaning in words regardless, which is why the meter is `aria-hidden`:
 * it summarises text already on the page rather than being the only place the
 * depth is given.
 */
export function SkillTier({ group, className }: Props) {
  const weight = TIER_WEIGHT[group.tier];
  const dotSize = TIER_DOT_SIZE[group.tier];

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Fixed height so the three meters sit on one baseline across the grid
          row — without it a row of 6px dots centres differently to 10px ones
          and the tier headings below them stop aligning. */}
      <div className="flex h-2.5 items-center gap-1.5" aria-hidden="true">
        {Array.from({ length: DOT_COUNT }, (_, index) => (
          <span
            key={index}
            className={cn(
              "rounded-full border",
              dotSize,
              index < weight
                ? "bg-fern border-transparent"
                : "border-border bg-transparent",
            )}
          />
        ))}
      </div>

      <h3 className="text-h-sm text-ink mt-4">{group.label}</h3>
      <p className="text-muted mt-2 text-sm">{group.blurb}</p>

      {group.items.length > 0 ? (
        <ul className="mt-5 flex flex-wrap gap-2">
          {group.items.map((item) => (
            <li key={item}>
              <Badge>{item}</Badge>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-faint mt-5 text-sm">Nothing listed in this tier yet.</p>
      )}
    </div>
  );
}
