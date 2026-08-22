import type { Metadata } from "next";

import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Prose } from "@/components/ui/prose";

export const metadata: Metadata = {
  title: "Page not found — Vernel Aquino",
};

export default function NotFound() {
  return (
    <Section>
      <p className="text-eyebrow text-faint mb-4 font-mono uppercase">Error 404</p>
      <h1 className="text-h-lg text-ink">This page does not exist</h1>
      <Prose className="mt-6">
        <p>
          The address you followed does not match anything on this site. It may have been renamed,
          or the link that brought you here may be out of date.
        </p>
      </Prose>

      <Button href="/" className="mt-8">
        Back to home
      </Button>
    </Section>
  );
}
