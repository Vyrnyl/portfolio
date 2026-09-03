import type { Education, Job } from "@/content/types";

/* ---------------------------------------------------------------------------
   Date formatting for the "YYYY-MM" strings in src/content/experience.ts.

   NO `Date` OBJECT IS CONSTRUCTED ANYWHERE IN THIS FILE, and that is the whole
   point of it existing.

   `new Date("2026-02")` is parsed by the spec as an ISO date-time string and
   lands on midnight UTC, 1 February. Rendered in any timezone BEHIND UTC it
   comes back as 31 January — so `formatMonth(jobs[0].start)` would print
   "Jan 2026" for a job that started in February, on a Vercel build running in
   UTC serving a reader in New York, while testing clean on a machine in
   Manila. The bug is invisible locally and permanent in production.

   These are fixed-format strings the content layer controls, so a split on "-"
   and a lookup is both correct and cheaper than parsing. Anything that does not
   match degrades to the year rather than throwing: a malformed date should
   render slightly wrong, never take down the page.
--------------------------------------------------------------------------- */

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

/**
 * "2026-02" -> "Feb 2026". `null` -> "Present", the convention `Job.end` and
 * `Education.end` both use for something still ongoing.
 */
export function formatMonth(value: string | null): string {
  if (value === null) return "Present";

  const [year, month] = value.split("-");
  if (year === undefined) return value;

  const name = month === undefined ? undefined : MONTHS[Number(month) - 1];
  return name === undefined ? year : `${name} ${year}`;
}

/**
 * The visible date range for one entry, e.g. "Feb 2026 — May 2026" or
 * "Aug 2024 — Present".
 *
 * An em dash with spaces, not a hyphen: at 375px the range is the widest
 * single line in a timeline item, and the spaces give it somewhere to wrap.
 */
export function formatRange(start: string, end: string | null): string {
  return `${formatMonth(start)} — ${formatMonth(end)}`;
}

/**
 * The machine-readable value for a `<time dateTime>` attribute.
 *
 * Returns undefined for a current role: there is no date to encode, and an
 * empty or invented `dateTime` is worse than none — a parser would read it as
 * a real claim about when the job ended.
 */
export function machineDate(value: string | null): string | undefined {
  return value ?? undefined;
}

/** The accessible range label, used on the `<time>` element's title-free text. */
export function entryRange(entry: Job | Education): string {
  return formatRange(entry.start, entry.end);
}
const ciProbe: number = "PORT-054 probe";
