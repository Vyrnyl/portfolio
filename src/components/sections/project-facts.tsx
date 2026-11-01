import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Project } from "@/content/types";
import { isPlaceholderUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";

type ProjectFactsProps = {
  project: Project;
  className?: string;
};

/**
 * The side panel on a project page: where to see it, and what it was built with.
 *
 * `role`, `duration`, `liveUrl` and `repoUrl` are optional in the content model,
 * so each is a real branch here even though no project sets `role` or
 * `duration` today. /gallery renders them, because no page does.
 */
export function ProjectFacts({ project, className }: ProjectFactsProps) {
  // Built as lists rather than inlined as three separate `&&` blocks, so the
  // "is there anything at all here" question is asked once, on `.length`.
  const meta: { term: string; value: string }[] = [];
  if (project.role) meta.push({ term: "Role", value: project.role });
  if (project.duration) meta.push({ term: "Duration", value: project.duration });

  /*
   * A placeholder URL renders as an INERT MARKER, never as a working link.
   *
   * The three states are deliberate. A real URL is a link. A placeholder is a
   * muted "— pending" span with no href, so it is visible on the page (the
   * project is known to have a repo; the address just is not ready) while
   * being impossible to click. An absent field renders nothing at all.
   *
   * The middle state is the one with history. `https://example.com` contains
   * no marker word, so the text-matching `isPlaceholder` cannot see it — that
   * is how a stand-in URL once reached a JSON-LD `sameAs`, and how these two
   * shipped for weeks as REAL buttons that dropped the visitor on an IANA
   * example page. A dead link looks fine until it is clicked; "— pending"
   * says what it is on its own face, the same way the placeholder images say
   * SCREENSHOT PENDING rather than pretending to be screenshots.
   *
   * Keyed on `label`, never on `href`: a project carries the same placeholder
   * for both, and two identical keys is a React warning.
   */
  const links: { label: string; href?: string }[] = [];
  if (project.liveUrl) {
    links.push({
      label: "Live site",
      href: isPlaceholderUrl(project.liveUrl) ? undefined : project.liveUrl,
    });
  }
  if (project.repoUrl) {
    links.push({
      label: "Source code",
      href: isPlaceholderUrl(project.repoUrl) ? undefined : project.repoUrl,
    });
  }

  return (
    <aside aria-label="Project details" className={className}>
      <Card className="shadow-card space-y-6 p-6">
        {links.length > 0 ? (
          <ul className="space-y-3">
            {links.map((link) => (
              <li key={link.label}>
                {link.href ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={cn(
                      "text-fern hover:text-fern-hover inline-flex items-center gap-1.5 rounded-md text-sm font-medium transition-colors",
                      "focus-visible:ring-ring focus-visible:ring-offset-ground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                    )}
                  >
                    {link.label}
                    <ArrowUpRight size={14} strokeWidth={1.9} aria-hidden />
                  </a>
                ) : (
                  /*
                    A <span>, not a disabled <a> or <button>. There is no action
                    to disable — nothing exists to navigate to yet — so this is
                    text, and text is what a screen reader should find. An <a>
                    without href is already non-interactive, but it keeps a link
                    role in some tools and invites a reader to try clicking it.
                  */
                  <span className="text-faint inline-flex items-center gap-1.5 text-sm">
                    {link.label}
                    <span className="text-eyebrow font-mono uppercase">— pending</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : null}

        {meta.length > 0 ? (
          <dl className="space-y-4">
            {meta.map((entry) => (
              <div key={entry.term}>
                <dt className="text-eyebrow text-faint font-mono uppercase">{entry.term}</dt>
                <dd className="text-ink mt-1.5 text-sm">{entry.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div>
          <p id="built-with" className="text-eyebrow text-faint font-mono uppercase">
            Built with
          </p>
          <ul aria-labelledby="built-with" className="mt-3 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <li key={item}>
                <Badge>{item}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </aside>
  );
}
