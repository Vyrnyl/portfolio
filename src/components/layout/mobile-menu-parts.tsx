import Image from "next/image";

import { hasSocialMark, SocialMark } from "@/components/layout/social-mark";
import { Icon } from "@/components/ui/icon";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

const FOCUS_RING =
  "focus-visible:ring-ring focus-visible:ring-offset-ground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none";

/**
 * The top of the mobile menu: headshot, name and role.
 *
 * MenuProfile and MenuContact are Server Components handed to MobileMenu as
 * props, which keeps `site` and the icons out of the client bundle even though
 * they render inside a Client Component.
 */
export function MenuProfile({ className }: { className?: string }) {
  return (
    <div className={cn("border-border shrink-0 border-b px-5 pt-6 pb-5", className)}>
      {/* Eager because the menu only mounts this on open, where lazy loading
          would show an empty frame for the first moment of the drawer. */}
      <Image
        src={site.avatar.src}
        alt={site.avatar.alt}
        width={site.avatar.width}
        height={site.avatar.height}
        sizes="88px"
        loading="eager"
        className="border-fern/40 shadow-fern/20 size-22 rounded-lg border object-cover shadow-lg"
      />
      <p className="text-h-md text-ink mt-4">{site.name}</p>
      <p className="text-fern text-badge mt-1.5 font-medium tracking-wider uppercase">
        {site.role}
      </p>
    </div>
  );
}

/** The foot of the mobile menu: email address and social buttons. */
export function MenuContact({ className }: { className?: string }) {
  return (
    <div className={cn("border-border mt-auto shrink-0 border-t p-5", className)}>
      <a
        href={`mailto:${site.email}`}
        className={cn(
          "text-muted hover:text-fern inline-flex items-center gap-2 rounded-md text-sm transition-colors",
          FOCUS_RING,
        )}
      >
        <Icon name="Mail" size={16} className="shrink-0" aria-hidden />
        {site.email}
      </a>

      <ul className="mt-3 flex items-center gap-3">
        {site.socials
          .filter((social) => hasSocialMark(social.platform))
          .map((social) => (
            <li key={social.platform}>
              <a
                href={social.href}
                aria-label={social.label}
                className={cn(
                  "bg-surface-2 border-border text-muted hover:text-fern inline-flex size-9 items-center justify-center rounded-sm border transition-colors",
                  FOCUS_RING,
                )}
              >
                <SocialMark platform={social.platform} />
              </a>
            </li>
          ))}
      </ul>
    </div>
  );
}
