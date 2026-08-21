import type { Metadata } from "next";

import { Section } from "@/components/layout/section";
import { Prose } from "@/components/ui/prose";

export const metadata: Metadata = {
  title: "Projects — Vernel Aquino",
  description: "Selected work, with the problem, the approach and the outcome for each.",
};

export default function ProjectsPage() {
  return (
    <Section>
      <p className="text-eyebrow text-faint mb-4 font-mono uppercase">PORT-031 · stub</p>
      <h1 className="text-h-lg text-ink">Projects</h1>
      <Prose className="mt-6">
        <p>
          Every project as a card, filterable by tag with the active filter reflected in the
          URL. PORT-031 builds the grid and the filter; PORT-032 builds the detail page behind
          each card.
        </p>
      </Prose>
    </Section>
  );
}
