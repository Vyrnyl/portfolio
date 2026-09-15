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

/**
 * NOTE — there is deliberately NO SITE_URL here.
 *
 * code-standards.md §7 sketched one, and it existed until 2026-09-15 as
 * `NEXT_PUBLIC_SITE_URL` with a localhost fallback. It was removed because
 * **nothing read it**: every URL on this site resolves from `site.url`
 * (src/content/site.ts) through `SITE_ORIGIN` in lib/seo.ts, which feeds
 * `metadataBase`, `absoluteUrl()` and all five JSON-LD `@id`/`url` values.
 *
 * Two sources of truth for one origin is a trap, and this one pointed the
 * wrong way: changing the env var in Vercel and redeploying would have changed
 * nothing at all, while *looking* load-bearing.
 *
 * If the origin ever needs to vary per deployment, add it back and point
 * `SITE_ORIGIN` at it — but note what is given up: `site.url` is committed and
 * reviewable, so it cannot be silently wrong, whereas a mistyped dashboard
 * value would ship broken OG tags with a green build.
 */
export const env = {
  RESEND_API_KEY: required("RESEND_API_KEY"),
  CONTACT_TO_EMAIL: required("CONTACT_TO_EMAIL"),
} as const;
