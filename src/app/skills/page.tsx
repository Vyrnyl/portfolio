import type { Metadata } from "next";

import { Section } from "@/components/layout/section";
import { Prose } from "@/components/ui/prose";

export const metadata: Metadata = {
  title: "Skills — Vernel Aquino",
  description: "What I work with, grouped by honest depth rather than a logo wall.",
};

export default function SkillsPage() {
  return (
    <Section>
      <p className="text-eyebrow text-faint mb-4 font-mono uppercase">PORT-037 · stub</p>
      <h1 className="text-h-lg text-ink">Skills</h1>
      <Prose className="mt-6">
        <p>
          Three depth tiers and four &ldquo;how I work&rdquo; principles, built in PORT-037.
          The tiers need a <code>tier</code> field on <code>SkillGroup</code>, which PORT-010
          adds when it writes the content types.
        </p>
      </Prose>
    </Section>
  );
}
