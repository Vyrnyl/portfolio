import { Button } from "@/components/ui/button";
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

/**
 * A closing call-to-action panel: heading, optional body, one or two
 * buttons. Carries no page's copy — every caller supplies its own heading,
 * body and links, so the same component can serve `/`, `/skills` and
 * `/about` (ui-registry.md §4) without editing it per page.
 */
export function Cta({ heading, body, primary, secondary, className }: CtaProps) {
  return (
    <div
      className={cn(
        "border-border bg-surface-2 rounded-xl border px-8 py-12 text-center",
        className,
      )}
    >
      <h2 className="text-h-lg text-ink">{heading}</h2>
      {body ? <p className="text-muted mx-auto mt-3 max-w-measure">{body}</p> : null}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button href={primary.href}>{primary.label}</Button>
        {secondary ? (
          <Button href={secondary.href} variant="outline">
            {secondary.label}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
