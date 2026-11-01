import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Prose } from "@/components/ui/prose";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

type AboutIntroProps = {
  className?: string;
};

/**
 * The intro tile on /about: who this is, and a short bio. Owns the page's
 * single <h1>.
 *
 * Reads `site` directly rather than taking props — the same carve-out Header,
 * Footer and Hero already use (content-model.md §4), and for the same reason:
 * there is exactly one person on this site, and threading their own name
 * through a prop would invent a configurability nothing wants.
 *
 * Deliberately does NOT repeat site.tagline, which Hero already leads with. The
 * bio is JSX rather than content because it carries an inline link. Sources:
 * education[0], `practices` in skills.ts, and gsp-mis and presyo-serbisyo in
 * projects.ts. Nothing here is invented, and it stays silent on graduation
 * because the content only records the end date.
 */
export function AboutIntro({ className }: AboutIntroProps) {
  const meta = [
    { icon: "Briefcase", text: site.role },
    { icon: "MapPin", text: site.location },
  ] as const;

  return (
    <Card className={cn("shadow-card flex flex-col justify-between gap-8 p-6 md:p-9", className)}>
      <div>
        <p className="text-eyebrow text-faint mb-3 font-mono uppercase">About</p>
        <h1 className="text-h-lg text-ink">{site.name}</h1>
        <Prose className="mt-5">
          <p>
            I&apos;m a full-stack web developer based in the Philippines. I studied Information
            Technology at Catanduanes State University, and most of what I build covers the whole
            stack: a schema, an API over it, the rules for who may see what, and the interface on
            top.
          </p>
          <p>
            The thread running through it is access control: deciding a permission once, in one
            layer, instead of re-checking it screen by screen. My latest{" "}
            <Link href="/projects">projects</Link>, GSP MIS and PresyoSerbisyo, replace paper records
            for the Girl Scouts council and DTI in Catanduanes.
          </p>
          <p>
            Right now I&apos;m working through serverless architecture, system design at scale and
            token-driven design systems.
          </p>
        </Prose>
      </div>

      <ul className="text-muted flex flex-wrap gap-x-8 gap-y-3 text-sm">
        {meta.map((item) => (
          <li key={item.text} className="inline-flex items-center gap-2">
            <Icon name={item.icon} className="text-faint" />
            {item.text}
          </li>
        ))}
      </ul>
    </Card>
  );
}
