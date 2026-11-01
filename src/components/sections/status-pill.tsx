import { cn } from "@/lib/utils";

type StatusPillProps = {
  label: string;
  className?: string;
};

/** A short availability line: a fern dot and its label, in a washed pill. */
export function StatusPill({ label, className }: StatusPillProps) {
  return (
    <p
      className={cn(
        "bg-fern-wash text-fern inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm",
        className,
      )}
    >
      <span aria-hidden className="bg-fern size-2 shrink-0 rounded-full" />
      {label}
    </p>
  );
}
