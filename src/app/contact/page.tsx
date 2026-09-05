import { Section } from "@/components/layout/section";
import { ContactForm } from "@/components/sections/contact-form";
import { ContactMethods } from "@/components/sections/contact-methods";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Contact",
  description: "Get in touch about work, a project, or a question — by form or directly by email.",
  path: "/contact",
});

/**
 * /contact — the form and the direct alternatives, side by side at lg.
 *
 * The page is a Server Component; only <ContactForm> is client
 * (code-standards.md §4). Submitting does nothing yet, and that is correct for
 * PORT-036 — the Server Action behind it is PORT-041. That split is deliberate:
 * you cannot debug a submission against a form that does not exist.
 *
 * ONE Section, not two. The first build put the intro in its own
 * `spacing="tight"` band above the grid, which measured clean but left a
 * *128px* void between the lead paragraph and the first field at 1440 — two
 * tight sections stacking their 64px padding, and the gap grows with the
 * breakpoint because the token is fluid. /about stacks two tight sections for
 * the same shape and it reads fine there, because its second section is body
 * prose continuing the first; here the second section is the thing the page
 * exists for, and pushing it down the fold made the page read as two
 * disconnected halves.
 */
export default function ContactPage() {
  return (
    <Section spacing="tight">
      <div className="grid gap-x-16 gap-y-12 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <p className="text-eyebrow text-faint mb-4 font-mono uppercase">Contact</p>
          <h1 className="text-h-lg text-ink">Let&apos;s talk</h1>
          <p className="text-lead text-muted mt-6 max-w-measure">
            Looking for a developer, working on something you want a second pair of hands on, or
            just have a question about one of the projects? Send it over.
          </p>
          <ContactForm className="mt-12" />
        </div>

        <div className="lg:col-span-2 lg:pt-2">
          <ContactMethods />
        </div>
      </div>
    </Section>
  );
}
