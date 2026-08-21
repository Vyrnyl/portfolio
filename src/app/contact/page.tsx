import type { Metadata } from "next";

import { Section } from "@/components/layout/section";
import { Prose } from "@/components/ui/prose";

export const metadata: Metadata = {
  title: "Contact — Vernel Aquino",
  description: "Send a message, or reach me directly.",
};

export default function ContactPage() {
  return (
    <Section>
      <p className="text-eyebrow text-faint mb-4 font-mono uppercase">PORT-036 · stub</p>
      <h1 className="text-h-lg text-ink">Contact</h1>
      <Prose className="mt-6">
        <p>
          The form UI is PORT-036 and the Server Action behind it is Sprint 4. That split is
          deliberate: you cannot debug a submission against a form that does not exist yet.
        </p>
      </Prose>
    </Section>
  );
}
