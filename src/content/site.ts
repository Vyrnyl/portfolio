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
  avatar: {
    src: "/images/avatar.jpg",
    alt: "Portrait of Vernel Aquino.",
    width: 200,
    height: 200,
  },
  heroPortrait: {
    src: "/images/hero-portrait.webp",
    alt: "Vernel Aquino taking a mirror selfie, in black and white.",
    width: 1000,
    height: 893,
  },
  status: "Open to new opportunities",
  // Hand-kept totals, because the source figures live in project prose.
  // 92 = 21 (gsp-mis) + 71 (presyo-serbisyo). A new live project changes it.
  // 2024 is the start of the freelance role in experience.ts.
  stats: [
    { value: "92", label: "Features shipped" },
    { value: "2024", label: "Building since" },
  ],
  stack: ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL"],
  nav: [
    { label: "Home", href: "/", icon: "LayoutPanelLeft" },
    { label: "Projects", href: "/projects", icon: "Layers" },
    { label: "Skills", href: "/skills", icon: "Code2" },
    { label: "About", href: "/about", icon: "User" },
    { label: "Resume", href: "/resume", icon: "FileText" },
    { label: "Contact", href: "/contact", icon: "MessageSquare" },
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
  resumePdf: "/Vernel-Aquino-Resume.pdf",
} satisfies SiteConfig;
