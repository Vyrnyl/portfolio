import { site } from "@/content/site";
import { cn } from "@/lib/utils";

type HeroProps = {
  className?: string;
};

/**
 * The page's one hero: who you are and what you do, above the fold on `/`.
 * Reads `site` directly — the same content/site.ts carve-out Header and
 * Footer already use (content-model.md §4), since this is config identity,
 * not queryable content that belongs behind lib/content.ts.
 */
export function Hero({ className }: HeroProps) {
  return (
    <div className={cn(className)}>
      <p className="text-eyebrow text-faint mb-4 font-mono uppercase">{site.role}</p>
      <h1 className="text-h-xl text-ink">{site.name}</h1>
      <p className="text-lead text-muted mt-6 max-w-measure">{site.tagline}</p>
    </div>
  );
}
