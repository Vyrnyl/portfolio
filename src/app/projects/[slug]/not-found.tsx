import type { Metadata } from "next";

import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Prose } from "@/components/ui/prose";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `Project not found — ${site.name}`,
};

/**
 * The 404 for /projects/<anything that is not a real slug>.
 *
 * Next renders the NEAREST not-found.tsx above the segment that called
 * notFound(), so this file — and not the root one — is what a bad project slug
 * gets. The only reason it exists separately is the exit: the root 404 sends
 * you home, and someone who mistyped a project slug wants the project list.
 */
export default function ProjectNotFound() {
  return (
    <Section>
      <p className="text-eyebrow text-faint mb-4 font-mono uppercase">Error 404</p>
      <h1 className="text-h-lg text-ink">No project at this address</h1>
      <Prose className="mt-6">
        <p>
          There is no project with that name. It may have been renamed, or the link that brought
          you here may be out of date — the full list is one click away.
        </p>
      </Prose>

      <Button href="/projects" className="mt-8">
        Browse all projects
      </Button>
    </Section>
  );
}
