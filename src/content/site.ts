import type { SiteConfig } from "./types";

/**
 * Site identity. The single source for the name, nav and socials — anything
 * that would otherwise be retyped in a component.
 *
 * `satisfies` rather than `: SiteConfig` so the literal is checked without
 * widening what it knows: `socials[0].platform` stays "github", not the whole
 * union. Missing a required field fails the build here, not at render.
 *
 * Adding a nav item is a one-line edit — it appears in the header row and the
 * mobile sheet with no other change, because both read this array.
 */
export const site = {
  name: "Vernel Aquino",
  role: "Full-stack web developer",
  tagline:
    "Full-stack web developer in the Philippines, building web applications with TypeScript, React and Next.js.",
  // Preview deploy, not the production domain. PORT-055 replaces this with the
  // custom domain, and OG images resolve against it — so no trailing slash.
  url: "https://vernel-portfolio.vercel.app",
  email: "vernaquino73@gmail.com",
  location: "Bicol, Philippines",
  // REAL PHOTO as of 2026-09-22, closing the PORT-058 gap the placeholder
  // tracked. scripts/portrait/build.mjs converts Vernel's source image to a
  // warm duotone keyed to --ink and --ground, and does NOTHING else: no crop,
  // no padding, so these are the photo's own dimensions at its own ratio.
  //
  // These dimensions are load-bearing: AboutIntro lays the photo out from
  // them and the padded frame fits around whatever height results, so the
  // photo keeps its native shape and is never letterboxed or cropped. A
  // replacement photo needs these two numbers updated to its real intrinsic
  // size — the script prints them.
  photo: {
    src: "/images/profile.webp",
    alt: "Vernel Aquino, in a monochrome portrait.",
    width: 1049,
    height: 1400,
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Skills", href: "/skills" },
    { label: "About", href: "/about" },
    { label: "Resume", href: "/resume" },
    { label: "Contact", href: "/contact" },
  ],
  // `label` is the accessible name, not the visible text. The footer shows a
  // shorter word and puts these on aria-label, so each one has to *contain*
  // that word — see the note in footer.tsx.
  socials: [
    {
      platform: "github",
      href: "https://github.com/Vyrnyl",
      label: "GitHub profile",
    },
    {
      platform: "linkedin",
      href: "https://www.linkedin.com/in/vernel-aquino-420446373",
      label: "LinkedIn profile",
    },
    {
      platform: "email",
      href: "mailto:vernaquino73@gmail.com",
      label: "Email Vernel Aquino",
    },
  ],
  resumePdf: "/resume.pdf",
} satisfies SiteConfig;
