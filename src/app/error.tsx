"use client";

import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Prose } from "@/components/ui/prose";

type Props = {
  /** Next passes the thrown error. `digest` is a server-side hash, present in production only. */
  error: Error & { digest?: string };
  /** Re-renders the failed segment. The recovery path — not a page reload. */
  reset: () => void;
};

export default function ErrorBoundary({ error, reset }: Props) {
  return (
    <Section>
      <p className="text-eyebrow text-faint mb-4 font-mono uppercase">Error</p>
      <h1 className="text-h-lg text-ink">Something went wrong</h1>
      <Prose className="mt-6">
        <p>
          This page failed to render. Trying again often clears it; if it does not, the problem is
          on my end rather than yours.
        </p>
      </Prose>

      {error.digest ? (
        <p className="text-faint mt-4 font-mono text-sm">Reference: {error.digest}</p>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button href="/" variant="outline">
          Back to home
        </Button>
      </div>
    </Section>
  );
}
