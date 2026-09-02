import { ArrowUpRight } from "lucide-react";

import { Icon } from "@/components/ui/icon";
import { site } from "@/content/site";
import type { SocialLink } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * The visible word for each platform. Same split as Footer's PLATFORM_TEXT and
 * for the same reason: site.socials carries the *accessible* name ("GitHub
 * profile"), this is the shorter visible text, and WCAG 2.5.3 requires the
 * accessible name to contain it. Declared as a full Record over the union so a
 * new platform fails the build here rather than rendering `undefined`.
 *
 * `email` is deliberately absent from what this renders — the address gets its
 * own labelled row above, so listing it again as a social would be the same
 * link twice.
 */
const PLATFORM_TEXT: Record<SocialLink["platform"], string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  email: "Email",
  x: "X",
  dribbble: "Dribbble",
};

type Props = {
  className?: string;
};

/**
 * The non-form ways to reach me: the address itself, where I am, and the
 * profiles. Reads `site` directly — the Header/Footer/Hero carve-out
 * (content-model.md §4) — because there is exactly one person on this site.
 */
export function ContactMethods({ className }: Props) {
  const socials = site.socials.filter((social) => social.platform !== "email");

  return (
    <div className={cn("space-y-8", className)}>
      <div>
        <h2 className="text-h-sm text-ink">Or reach me directly</h2>
        <p className="text-muted mt-2 text-sm">
          The form lands in the same inbox. Use whichever you prefer — I read both.
        </p>
      </div>

      <ul className="space-y-4">
        <li className="flex items-start gap-3">
          <Icon name="Mail" className="text-fern mt-0.5 shrink-0" aria-hidden />
          <div>
            <p className="text-eyebrow text-faint font-mono uppercase">Email</p>
            <a
              href={`mailto:${site.email}`}
              className={cn(
                "text-ink hover:text-fern mt-1 inline-block rounded-md text-sm transition-colors",
                "focus-visible:ring-ring focus-visible:ring-offset-ground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
              )}
            >
              {site.email}
            </a>
          </div>
        </li>

        <li className="flex items-start gap-3">
          <Icon name="MapPin" className="text-fern mt-0.5 shrink-0" aria-hidden />
          <div>
            <p className="text-eyebrow text-faint font-mono uppercase">Based in</p>
            <p className="text-ink mt-1 text-sm">{site.location}</p>
          </div>
        </li>
      </ul>

      {socials.length > 0 ? (
        <div>
          <p className="text-eyebrow text-faint font-mono uppercase">Elsewhere</p>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {socials.map((social) => (
              <li key={social.platform}>
                <a
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={cn(
                    "text-muted hover:text-fern inline-flex items-center gap-1 rounded-md text-sm transition-colors",
                    "focus-visible:ring-ring focus-visible:ring-offset-ground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                  )}
                >
                  {PLATFORM_TEXT[social.platform]}
                  <ArrowUpRight size={14} strokeWidth={1.9} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
