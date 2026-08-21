import type { Metadata } from "next";

import { Section } from "@/components/layout/section";
import { Prose } from "@/components/ui/prose";

export const metadata: Metadata = {
  title: "Vernel Aquino — Developer",
  description: "Portfolio of Vernel Aquino, a developer based in the Philippines.",
};

export default function HomePage() {
  return (
    <Section>
      <p className="text-eyebrow text-faint mb-4 font-mono uppercase">PORT-030 · stub</p>
      <h1 className="text-h-xl text-ink">Vernel Aquino</h1>
      <Prose className="mt-6">
        <p>
          The hero, positioning statement, two or three featured projects and the closing call
          to action all land here in PORT-030. This stub exists so the route is reachable and
          the shell can be checked end to end.
        </p>
      </Prose>
    </Section>
  );
}
