import type { Metadata } from "next";

import { Section } from "@/components/layout/section";
import { Prose } from "@/components/ui/prose";

export const metadata: Metadata = {
  title: "About — Vernel Aquino",
  description: "Background, how I got here, and what I am working on next.",
};

export default function AboutPage() {
  return (
    <Section>
      <p className="text-eyebrow text-faint mb-4 font-mono uppercase">PORT-033 · stub</p>
      <h1 className="text-h-lg text-ink">About</h1>
      <Prose className="mt-6">
        <p>
          Bio, photo, the story, strengths and weaknesses. PORT-033. The profile photo is still an
          open prerequisite in progress.md — worth sorting before that ticket starts.
        </p>
      </Prose>
    </Section>
  );
}
