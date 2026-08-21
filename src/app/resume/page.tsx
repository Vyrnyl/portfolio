import type { Metadata } from "next";

import { Section } from "@/components/layout/section";
import { Prose } from "@/components/ui/prose";

export const metadata: Metadata = {
  title: "Resume — Vernel Aquino",
  description: "Experience, education, and a downloadable PDF.",
};

export default function ResumePage() {
  return (
    <Section>
      <p className="text-eyebrow text-faint mb-4 font-mono uppercase">PORT-034 · stub</p>
      <h1 className="text-h-lg text-ink">Resume</h1>
      <Prose className="mt-6">
        <p>
          Structured experience and education as a timeline, plus a download of the PDF already
          sitting at <code>public/resume.pdf</code>. PORT-034 — the timeline going responsive is
          the risky part of it.
        </p>
      </Prose>
    </Section>
  );
}
