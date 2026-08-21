"use client";

import Link from "next/link";

import { Section } from "@/components/layout/section";
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
          This page failed to render. Trying again often clears it; if it does not, the problem
          is on my end rather than yours.
        </p>
      </Prose>

      {error.digest ? (
        <p className="text-faint mt-4 font-mono text-sm">Reference: {error.digest}</p>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        {/* PORT-020 replaces both of these with <Button>. Classes match ui-rules §5. */}
        <button
          type="button"
          onClick={reset}
          className="bg-fern text-fern-on hover:bg-fern-hover focus-visible:ring-ring focus-visible:ring-offset-ground inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Try again
        </button>

        <Link
          href="/"
          className="border-border text-ink hover:bg-surface-2 focus-visible:ring-ring focus-visible:ring-offset-ground inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Back to home
        </Link>
      </div>
    </Section>
  );
}
