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
  location: "Philippines",
  // PLACEHOLDER, and it says so on its own face: the file reads "PHOTO PENDING".
  // 1000×1250 are the real intrinsic dimensions of the real file on disk, so
  // next/image reserves the correct box and the swap introduces no layout
  // shift. 4:5 is now the ratio a real photo should be cropped to. PORT-058.
  photo: {
    src: "/images/profile-placeholder.webp",
    alt: "Placeholder graphic standing in for a photo of Vernel Aquino.",
    width: 1000,
    height: 1250,
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
