import type { Metadata } from "next";
import Link from "next/link";

import { Section } from "@/components/layout/section";
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
          The address you followed does not match anything on this site. It may have been
          renamed, or the link that brought you here may be out of date.
        </p>
      </Prose>

      {/* PORT-020 replaces this with <Button href="/">. Classes match ui-rules §5. */}
      <Link
        href="/"
        className="bg-fern text-fern-on hover:bg-fern-hover focus-visible:ring-ring focus-visible:ring-offset-ground mt-8 inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        Back to home
      </Link>
    </Section>
  );
}
