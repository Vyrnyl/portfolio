import type { Practice, SkillGroup } from "./types";

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

/* ---------------------------------------------------------------------------
   How I work — written for PORT-037, the /skills page.

   These are the four habits, not four more technologies. Each one is drawn
   from something already in this repo rather than from a list of virtues, and
   the traceable source is named so a future edit can check the claim still
   holds:

     Access control first   jobs[1].bullets (RBAC on the freelance app) plus
                            the "grades-repository-system" and
                            "cict-project-gate" problem statements — three
                            builds where permissions were the design problem,
                            not a late feature.
     Schema and API together  jobs[1].bullets, verbatim in substance: the
                            schema and the API contract were designed as one
                            thing, which is what kept data consistent as
                            features landed on top.
     Say what is true       PORT-013's own "no metric invented" rule, visible
                            on this site: the OpalusPH role carries two
                            bullets rather than three, and the learning tier
                            above exists so the list is not only strengths.
     Learning in the open   the learning tier, and this site itself — the
                            App Router and WCAG work is happening here.

   Icons are IconName members (PORT-024), which already reserved eight names
   for exactly this content. Four are used; the other four stay available.
--------------------------------------------------------------------------- */

export const practices = [
  {
    icon: "ShieldCheck",
    title: "Access control first",
    body: "On three separate builds the hard part was not the feature — it was deciding who may see it. I would rather settle a permission once, in one layer, than re-check it screen by screen and find the gap in review.",
  },
  {
    icon: "Code2",
    title: "Schema and API together",
    body: "The database schema and the contract over it get designed in the same sitting. Designing them apart is how the two drift, and the drift only shows up later, as data that disagrees with itself.",
  },
  {
    icon: "MessageCircle",
    title: "Say what is actually true",
    body: "No invented numbers, and no skill claimed a level above where it is. The tiers on this page are graded honestly and the learning one is listed on purpose — a page that only shows strengths tells a reader nothing they can use.",
  },
  {
    icon: "BookOpen",
    title: "Learning in the open",
    body: "Server Components, accessibility to WCAG 2.2 AA, and token-driven design systems are things I am working through right now, and this site is where most of it is happening rather than a private sandbox.",
  },
] satisfies Practice[];
