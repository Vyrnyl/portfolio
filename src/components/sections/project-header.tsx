import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { Project, ProjectStatus } from "@/content/types";
import { isPlaceholderUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";

/**
 * The visible word for each status. A full Record over the union, so adding a
 * fourth ProjectStatus in types.ts fails the build here rather than rendering
 * `undefined` in the eyebrow — the same guard Footer uses for social platforms.
 */
const STATUS_TEXT: Record<ProjectStatus, string> = {
  live: "Live",
  archived: "Archived",
  "in-progress": "In progress",
};

type ProjectHeaderProps = {
  project: Project;
  className?: string;
};

/**
 * The opening block of a project's detail page: what it is, when, what it was
 * built with, and where to go and see it.
 *
 * Four of the things it renders are optional in the content model — `role`,
 * `duration`, `liveUrl`, `repoUrl` — and a fifth, `cover`, has a documented
 * fallback. Every one is still a real branch here, because at least one
 * project in src/content/projects.ts is missing it.
 *
 * 2026-09-22: no project is missing ALL of them at once any more. That case
 * was construction-company-website, replaced in the same pass; the gap is
 * recorded in projects.ts's header rather than quietly accepted.
 */
export function ProjectHeader({ project, className }: ProjectHeaderProps) {
  // types.ts promises this fallback: "Wide image for the detail page header.
  // Falls back to thumbnail when absent." Without it a project with no cover
  // opens on a bare wall of text while every other one opens on an image.
  const cover = project.cover ?? project.thumbnail;

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
    <header className={cn(className)}>
      {/*
        A real <Link> to /projects, never router.back(). History is not a
        reliable map of where the visitor came from: a shared link, a search
        result or an opened-in-new-tab card all land here with nothing to go
        back to, and back() would either do nothing or leave the site. The
        index is the true parent of this page regardless of the route taken.

        Styled as a quiet text link rather than a Button on purpose — the 404
        and error pages use a Button because it is their only exit, whereas
        here it sits directly above the <h1> and must not compete with it.
      */}
      <Link
        href="/projects"
        className={cn(
          "text-muted hover:text-fern mb-6 inline-flex items-center gap-1.5 rounded-md text-sm font-medium transition-colors",
          "focus-visible:ring-ring focus-visible:ring-offset-ground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        )}
      >
        <ArrowLeft size={14} strokeWidth={1.9} aria-hidden />
        All projects
      </Link>

      <p className="text-eyebrow text-faint mb-4 font-mono uppercase">
        {project.year} · {STATUS_TEXT[project.status]}
      </p>

      <h1 className="text-h-lg text-ink">{project.title}</h1>

      <p className="text-lead text-muted mt-6 max-w-measure">{project.summary}</p>

      {meta.length > 0 ? (
        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
          {meta.map((entry) => (
            <div key={entry.term}>
              <dt className="text-eyebrow text-faint font-mono uppercase">{entry.term}</dt>
              <dd className="text-ink mt-1.5 text-sm">{entry.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <ul aria-label="Built with" className="mt-8 flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <li key={item}>
            <Badge>{item}</Badge>
          </li>
        ))}
      </ul>

      {/*
        Capped at max-w-figure rather than filling the shell. A real screenshot
        is a dense UI, not a hero band: at the full 1120px it dominated the
        page and pushed the case study below the fold. `sizes` has to track the
        cap or the browser downloads a 1120px-wide candidate for an 800px slot.
      */}
      <Image
        src={cover.src}
        alt={cover.alt}
        width={cover.width}
        height={cover.height}
        sizes="(min-width: 1000px) 800px, 100vw"
        priority
        className="border-border mt-12 h-auto w-full max-w-figure rounded-lg border"
      />

      {/*
        Under the image, not above it. These answer "can I go and see it?",
        which is a question the visitor asks once they have looked at the
        thing — putting them above the screenshot pushed the image itself
        further down for a row most readers scroll straight past on the way
        to it. Capped to max-w-figure so the row aligns with the image edge
        rather than running out to the full shell width.
      */}
      {links.length > 0 ? (
        <ul className="mt-6 flex max-w-figure flex-wrap items-center gap-x-6 gap-y-3">
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
    </header>
  );
}
