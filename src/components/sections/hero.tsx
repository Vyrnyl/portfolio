import { hasSocialMark, SocialMark } from "@/components/layout/social-mark";
import { StatusPill } from "@/components/sections/status-pill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

type HeroProps = {
  className?: string;
};

/**
 * The intro tile on `/`: status, name, what you do, and the ways onward. Owns
 * the page's one <h1>. Reads `site` directly — the same content/site.ts
 * carve-out Header and Footer already use (content-model.md §4), since this is
 * config identity, not queryable content that belongs behind lib/content.ts.
 *
 * The eyebrow is a lead-in to the name, not `site.role` (changed 2026-09-23).
 * The role eyebrow repeated the tagline's opening words three lines apart.
 * The tagline keeps the role because it also stands alone as the meta
 * description, the OG card and the JSON-LD description, where no eyebrow
 * precedes it. So the repeat was fixed here rather than there.
 */
export function Hero({ className }: HeroProps) {
  return (
    <Card className={cn("shadow-card flex flex-col justify-between gap-6 p-6 md:p-9", className)}>
      <StatusPill label={site.status} className="self-start" />

      <div>
        <p className="text-eyebrow text-faint mb-3 font-mono uppercase">Hi, I&apos;m</p>
        <h1 className="text-h-xl text-ink">{site.name}</h1>
        <p className="text-lead text-muted max-w-measure mt-4">{site.tagline}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button href="/projects">See my work</Button>
          <Button href="/contact" variant="outline">
            Get in touch
          </Button>
          <ul className="flex items-center gap-3">
            {site.socials
              .filter((social) => hasSocialMark(social.platform))
              .map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    className={cn(
                      "border-border text-muted hover:text-ink hover:bg-surface-2 inline-flex size-10 items-center justify-center rounded-full border transition-colors",
                      "focus-visible:ring-ring focus-visible:ring-offset-ground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                    )}
                  >
                    <SocialMark platform={social.platform} />
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
