import type { Project } from "./types";

/* ---------------------------------------------------------------------------
   MIXED CONTENT — read this before editing.

   The two academic projects carry REAL copy, written from public/resume.pdf.
   The two OpalusPH sites are still placeholders.

   Still unverified even on the real two — replace in PORT-057:
     - year, status          inferred from the graduation timeline, not stated
     - stack "TBC" entries   the resume lists no per-project stack
     - liveUrl / repoUrl     omitted rather than invented; add if they exist
     - every image           all eight files still read "SCREENSHOT PENDING"

   No metric anywhere below was invented. Where an outcome has no measurement,
   it says so — that is deliberate and should survive editing.

   PORT-057 gate: neither "Placeholder" nor "TBC" appears in this file, and no
   image in public/images/projects/ still reads "SCREENSHOT PENDING".

   Field coverage is intentional — do not "tidy" it:
     grades-repository-system      cover + gallery + highlights
     cict-project-gate             cover + highlights, no gallery
     opalusph-website              role + duration + both URLs
     construction-company-website  no optional fields at all
   Every optional field is present on at least one entry and absent on at least
   one, and all three ProjectStatus values appear. That is what forces every
   branch AND its fallback to get built in PORT-021 / 031 / 032.
--------------------------------------------------------------------------- */

export const projects = [
  {
    slug: "cict-project-gate",
    title: "CICT Project Gate",
    summary:
      "Capstone title submission with GPT-4 assistance and embedding-based duplicate detection.",
    year: 2026,
    status: "archived",
    featured: true,
    tags: ["school-project", "full-stack", "ai", "access-control"],
    stack: ["GPT-4", "Vector embeddings", "TBC — confirm stack"],
    thumbnail: {
      src: "/images/projects/cict-project-gate.webp",
      alt: "Placeholder graphic standing in for a screenshot of CICT Project Gate.",
      width: 1600,
      height: 1000,
    },
    cover: {
      src: "/images/projects/cict-project-gate-cover.webp",
      alt: "Placeholder graphic standing in for a wide header screenshot of CICT Project Gate.",
      width: 2400,
      height: 1000,
    },

    problem:
      "Capstone and thesis titles are approved one at a time, by people reading them one at a time. Nobody holds every title already submitted in their head, so two groups can spend weeks on topics that turn out to be near-duplicates of each other — and the overlap surfaces at panel review, which is the most expensive possible moment to find it. The hard part is that duplicates are rarely worded alike; the same idea arrives phrased three different ways.",
    approach:
      "A submission and approval platform that compares a proposed title against everything already in the system before a human ever reviews it. Matching is done on vector embeddings with cosine similarity rather than keyword overlap, because the problem is semantic — two titles can share almost no words and still be the same project. GPT-4 sits on top as a decision support layer, suggesting and refining titles rather than deciding anything. Around that, role-based access separates the three groups: students submit, faculty review and comment, administrators manage users and settings.",
    outcome:
      "Near-duplicate topics are caught at submission instead of at panel review, and reviewers see a similarity signal alongside each title rather than having to recall the archive themselves. This was an academic build, so there are no production usage figures to quote.",

    highlights: [
      "Semantic duplicate detection using vector embeddings and cosine similarity, not keyword matching.",
      "GPT-4 integrated as a decision support system that recommends and refines titles, with approval left to people.",
      "Three-role access model — students submit, faculty review and comment, administrators manage the system.",
      "Similarity checking runs at submission time, ahead of human review rather than after it.",
    ],
  },
  {
    slug: "grades-repository-system",
    title: "Grades Repository System",
    summary:
      "Centralized academic records for students, faculty and admins, with role-based access throughout.",
    year: 2025,
    status: "archived",
    featured: true,
    tags: ["school-project", "full-stack", "access-control"],
    stack: ["RESTful APIs", "TBC — confirm stack"],
    thumbnail: {
      src: "/images/projects/grades-repository-system.webp",
      alt: "Placeholder graphic standing in for a screenshot of the Grades Repository System.",
      width: 1600,
      height: 1000,
    },
    cover: {
      src: "/images/projects/grades-repository-system-cover.webp",
      alt: "Placeholder graphic standing in for a wide header screenshot of the Grades Repository System.",
      width: 2400,
      height: 1000,
    },

    problem:
      "Students, faculty and administrators all need the same grade records, but for different reasons and with very different rights over them. A student needs to read their own results across several semesters. Faculty need to assign and revise them. Administrators need to manage the whole set. Serving all three from one system makes access control the central design problem rather than a feature added at the end — get it wrong once and a student sees somebody else's transcript.",
    approach:
      "A single records system with role-based access deciding what each group can read and change, enforced in one place instead of re-checked screen by screen. Faculty were given workflows for assigning, updating and managing grades; students were given read access scoped to their own results across multiple semesters. The data layer got the most attention: RESTful APIs over queries written to hold up as the number of records grows, since a grades table only ever gets longer.",
    outcome:
      "The three groups work from one record set instead of coordinating across separate ones, and every permission decision lives in a single layer that can be reasoned about on its own. As an academic project it was never run at institutional scale, so there are no performance numbers from real load.",

    highlights: [
      "One records system serving students, faculty and administrators from a single source.",
      "Grades readable across multiple semesters, scoped per student by role-based access control.",
      "Faculty workflows for assigning, updating and managing grades.",
      "RESTful APIs over queries optimized for growth rather than for the size of the test data.",
    ],
    gallery: [
      {
        src: "/images/projects/grades-repository-system-gallery-1.webp",
        alt: "Placeholder graphic standing in for the first gallery screenshot of the Grades Repository System.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/images/projects/grades-repository-system-gallery-2.webp",
        alt: "Placeholder graphic standing in for the second gallery screenshot of the Grades Repository System.",
        width: 1600,
        height: 1000,
      },
    ],
  },
  {
    slug: "opalusph-website",
    title: "OpalusPH Company Website",
    summary:
      "Placeholder summary for the OpalusPH company site — real copy pending.",
    year: 2025,
    status: "live",
    featured: true,
    tags: ["internship", "marketing-site"],
    stack: ["TBC — confirm stack"],
    thumbnail: {
      src: "/images/projects/opalusph-website.webp",
      alt: "Placeholder graphic standing in for a screenshot of the OpalusPH company website.",
      width: 1600,
      height: 1000,
    },
    liveUrl: "https://example.com",
    repoUrl: "https://example.com",

    problem:
      "Placeholder copy — the real problem statement goes here. This entry has no cover image, so the detail page must fall back to the thumbnail exactly as the type comment promises.",
    approach:
      "Placeholder copy — the real approach goes here. Two to four sentences in the finished version.",
    outcome:
      "Placeholder copy — the real outcome goes here. Numbers if honest ones exist; plain description if not.",

    role: "Placeholder role — pending",
    duration: "Placeholder duration",
  },
  {
    slug: "construction-company-website",
    title: "Construction Company Website",
    summary:
      "Placeholder summary — real copy pending, sized mid-range for the card grid.",
    year: 2025,
    status: "in-progress",
    featured: false,
    tags: ["internship", "marketing-site", "cms"],
    stack: ["TBC — confirm stack"],
    thumbnail: {
      src: "/images/projects/construction-company-website.webp",
      alt: "Placeholder graphic standing in for a screenshot of the construction company website.",
      width: 1600,
      height: 1000,
    },

    problem:
      "Placeholder copy — the real problem statement goes here. This entry carries no optional fields at all: no cover, no gallery, no highlights, no role, no duration, no links. It is the minimum a Project can be, and every component must render it without a gap or a stray separator.",
    approach: "Placeholder copy — the real approach goes here.",
    outcome: "Placeholder copy — the real outcome goes here.",
  },
] satisfies Project[];
