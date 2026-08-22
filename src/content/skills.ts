import type { SkillGroup } from "./types";

/* ---------------------------------------------------------------------------
   Source: public/resume.pdf, extracted 2026-08-22. Every item below appears on
   the resume or is demonstrably in use on this site.

   The ITEMS are read from the resume. The TIERS are a judgment call and are
   Vernel's to correct — placement was argued from evidence, not from feel:

     confident  used to ship something end to end at least twice. RBAC is here
                because it was built three separate times (the freelance app,
                Grades Repository and Project Gate), not once.
      working    real features built, but on a narrower base of evidence.

   TypeScript was moved confident <- working on 2026-08-22 at Vernel's call.
   The evidence pointed the other way (every project he describes was built in
   JavaScript), but depth in his own tools is his to judge, not mine.
     learning   in active use on THIS build and not yet claimed as known.

   Order is confident -> working -> learning and must stay that way: the /skills
   page renders the tiers as ordered depth, and content-model §5 requires
   exactly one group per tier.

   `practices` (the Practice[] export content-model §3 places in this file) is
   deliberately absent — it belongs to PORT-037, not PORT-013.
--------------------------------------------------------------------------- */

export const skillGroups = [
  {
    tier: "confident",
    label: "Confident",
    blurb:
      "Shipped working software with these more than once. I can start in them without looking up the basics.",
    items: [
      "TypeScript",
      "JavaScript",
      "React.js",
      "Node.js",
      "Express.js",
      "RESTful APIs",
      "MySQL",
      "HTML5 & CSS3",
      "Git & GitHub",
      "Role-based access control",
    ],
  },
  {
    tier: "working",
    label: "Working knowledge",
    blurb:
      "Built real features with these and can be productive, but I still reach for the documentation on the harder parts.",
    items: ["Next.js", "Tailwind CSS", "Prisma", "SQL", "JWT authentication"],
  },
  {
    tier: "learning",
    label: "Learning now",
    blurb:
      "Actively working through these, including on this site. Listed rather than hidden, because a skills page that only lists strengths tells you nothing.",
    items: [
      "React Server Components and the App Router",
      "Web accessibility to WCAG 2.2 AA",
      "Design systems and token-driven styling",
      "CI/CD and deployment pipelines",
    ],
  },
] satisfies SkillGroup[];
