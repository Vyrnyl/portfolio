import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Section } from "@/components/layout/section";
import { ProjectCard } from "@/components/sections/project-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Prose } from "@/components/ui/prose";
import { Textarea } from "@/components/ui/textarea";
import { getFeaturedProjects } from "@/lib/content";
import { ICONS, type IconName } from "@/lib/icons";

export const metadata: Metadata = {
  title: "Component gallery — Vernel Aquino",
  description: "Every built UI primitive, in every variant and state.",
};

const ICON_NAMES = Object.keys(ICONS) as IconName[];

/**
 * Every primitive from components/ui/ that is actually built, plus
 * ProjectCard — the one components/sections/ composite this ticket depends
 * on (PORT-021 shipped both halves together) — in every variant and state
 * real content can currently exercise.
 *
 * Dev-only: 404s the moment this is a production build, via the same
 * not-found.tsx every unknown route already hits. process.env.NODE_ENV is
 * inlined at build time, so the branch below is constant-folded — the
 * production bundle never ships the JSX beneath it.
 */
export default function GalleryPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <>
      <Section spacing="tight">
        <p className="text-eyebrow text-faint mb-4 font-mono uppercase">PORT-025 · dev only</p>
        <h1 className="text-h-lg text-ink">Component gallery</h1>
        <Prose className="mt-6">
          <p>
            Every component in <code>components/ui/</code> that is built so far, shown in every
            variant and state real content can exercise today. Not part of the site&rsquo;s nav —
            this route 404s in a production build.
          </p>
        </Prose>
      </Section>

      <Section heading="Button">
        <div className="space-y-6">
          <div>
            <h3 className="text-h-sm text-ink mb-3">Variant × size</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="md">
                Primary md
              </Button>
              <Button variant="primary" size="sm">
                Primary sm
              </Button>
              <Button variant="outline" size="md">
                Outline md
              </Button>
              <Button variant="outline" size="sm">
                Outline sm
              </Button>
              <Button variant="ghost" size="md">
                Ghost md
              </Button>
              <Button variant="ghost" size="sm">
                Ghost sm
              </Button>
            </div>
          </div>
          <div>
            <h3 className="text-h-sm text-ink mb-3">With an icon, as a link, disabled</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">
                <Icon name="Rocket" />
                Ship it
              </Button>
              <Button href="/" variant="outline">
                As a link
              </Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
        </div>
      </Section>

      <Section heading="Card">
        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <p className="text-muted p-6 text-sm">
              Unpadded (the default) — a caller supplies its own interior padding, the way
              ProjectCard pads only its text block and leaves the thumbnail flush.
            </p>
          </Card>
          <Card padded>
            <p className="text-muted text-sm">
              Padded — <code>padded</code> adds <code>p-6</code> for you.
            </p>
          </Card>
        </div>
      </Section>

      <Section heading="Badge">
        <div className="flex flex-wrap gap-2">
          <Badge>Next.js</Badge>
          <Badge>TypeScript</Badge>
          <Badge>Tailwind</Badge>
          <Badge>Server Components</Badge>
        </div>
      </Section>

      <Section heading="Field, Input, Textarea">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field name="gallery-name-hint" label="Name" hint="As it should appear on the site.">
            {(props) => <Input {...props} placeholder="Ada Lovelace" />}
          </Field>

          <Field name="gallery-name-required" label="Name" required>
            {(props) => <Input {...props} placeholder="Ada Lovelace" />}
          </Field>

          <Field
            name="gallery-email-error"
            label="Email"
            required
            error="Enter a valid email address."
          >
            {(props) => <Input {...props} type="email" defaultValue="not-an-email" />}
          </Field>

          <Field name="gallery-message-hint" label="Message" hint="Markdown is not supported.">
            {(props) => (
              <Textarea {...props} rows={4} placeholder="What would you like to say?" />
            )}
          </Field>

          <Field
            name="gallery-message-error"
            label="Message"
            required
            error="Message is required."
          >
            {(props) => <Textarea {...props} rows={4} />}
          </Field>

          <Field name="gallery-disabled" label="Disabled">
            {(props) => <Input {...props} disabled placeholder="Can't type here" />}
          </Field>
        </div>
      </Section>

      <Section heading="Icon">
        <p className="text-muted mb-6 text-sm">
          Every name in <code>IconName</code> — extend <code>src/lib/icons.ts</code> and{" "}
          <code>src/content/types.ts</code> together as pages need more.
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {ICON_NAMES.map((name) => (
            <div key={name} className="text-muted flex items-center gap-2 text-sm">
              <Icon name={name} />
              <span className="font-mono text-xs">{name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section heading="ProjectCard">
        <p className="text-muted mb-6 text-sm">
          The real featured projects from <code>getFeaturedProjects()</code> — no placeholder
          markup, since the real content already exercises the card&rsquo;s optional fields.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {getFeaturedProjects().map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Section>

      <Section heading="Prose">
        <Prose>
          <h2>A sample heading</h2>
          <p>
            Prose styles long-form content — paragraphs, headings, lists, <a href="#">links</a>,{" "}
            <code>inline code</code>, and blockquotes — with one consistent rhythm.
          </p>
          <ul>
            <li>First item</li>
            <li>Second item</li>
          </ul>
        </Prose>
      </Section>

      <Section heading="Known gap">
        <Prose>
          <p>
            No component built so far has a designed empty state to show here —{" "}
            <code>ProjectGrid</code>&rsquo;s (PORT-031) and <code>ContactForm</code>&rsquo;s
            (PORT-036 / PORT-041) are still <code>designed</code>, not built. This section stays
            until one lands.
          </p>
        </Prose>
      </Section>
    </>
  );
}
