/* ---------------------------------------------------------------------------
   Typed environment access. Spec: code-standards.md §7, architecture.md §6.

   THIS MODULE THROWS AT IMPORT TIME, and that is the entire point: a missing
   key fails at boot rather than on a visitor's submission. The alternative —
   reading process.env at call time — turns a deployment mistake into a silent
   contact form that accepts messages and drops them.

   THE CONSEQUENCE IS REAL AND WAS CHOSEN DELIBERATELY (2026-09-15): because
   `next build` evaluates every imported module during page-data collection, a
   build with no env vars fails HERE. That is why .github/workflows/ci.yml now
   carries an `env:` block on its build step — PORT-054's header predicted this
   exact coupling a fortnight before it landed. If CI goes red with "Missing
   required environment variable", the repository secrets are missing, not the
   code.

   Never `process.env.X` anywhere else. One file reads the environment, so
   there is one place to look when a value is wrong.
--------------------------------------------------------------------------- */

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const env = {
  RESEND_API_KEY: required("RESEND_API_KEY"),
  CONTACT_TO_EMAIL: required("CONTACT_TO_EMAIL"),

  /**
   * NOT `required()`, and the inconsistency is deliberate.
   *
   * The NEXT_PUBLIC_ prefix means this value is inlined into the client bundle
   * at build time, and a local `next dev` with no .env.local should still boot
   * — a portfolio that will not start until someone provisions an email key is
   * hostile to work on. The fallback is the dev origin: wrong in production but
   * harmless, because nothing security-sensitive reads it and `site.url`
   * (src/content/site.ts) is what actually feeds OG tags and the sitemap today.
   *
   * Do not "fix" this to match the two above without checking what reads it.
   */
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
