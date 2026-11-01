import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

type CtaLink = {
  label: string;
  href: string;
};

type CtaProps = {
  heading: string;
  body?: string;
  primary: CtaLink;
  secondary?: CtaLink;
  className?: string;
};

/* One corner mark per corner of the blueprint sheet. */
const TICKS = [
  "top-4 left-4 border-t border-l",
  "top-4 right-4 border-t border-r",
  "bottom-4 left-4 border-b border-l",
  "bottom-4 right-4 border-b border-r",
];

/**
 * A closing call-to-action panel, drawn as a blueprint sheet: heading, optional
 * body, one or two buttons, and the email address for anyone who would rather
 * skip the form. Carries no page's copy — every caller supplies its own
 * heading, body and links, so the same component serves `/`, `/skills` and
 * `/about` without editing it per page. The address reads `site` directly,
 * because it is the same on every page.
 */
export function Cta({ heading, body, primary, secondary, className }: CtaProps) {
  return (
    <div
      className={cn(
        "blueprint-sheet bg-surface border-border shadow-card relative overflow-hidden rounded-lg border px-5 py-10 text-center md:px-8 md:py-14",
        className,
      )}
    >
      {TICKS.map((tick) => (
        <span
          key={tick}
          aria-hidden
          className={cn("border-border-strong absolute z-10 size-4", tick)}
        />
      ))}

      <div className="relative z-10">
        <h2 className="text-h-lg text-ink">{heading}</h2>
        {body ? <p className="text-muted max-w-measure mx-auto mt-3">{body}</p> : null}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button href={primary.href}>{primary.label}</Button>
          {secondary ? (
            <Button href={secondary.href} variant="outline">
              {secondary.label}
            </Button>
          ) : null}
        </div>
        <a
          href={`mailto:${site.email}`}
          className={cn(
            "text-badge text-muted hover:text-fern mt-5 inline-block rounded-md font-mono transition-colors",
            "focus-visible:ring-ring focus-visible:ring-offset-ground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          )}
        >
          {site.email}
        </a>
      </div>
    </div>
  );
}
