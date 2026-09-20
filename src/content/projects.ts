import type { Project } from "./types";

/* ---------------------------------------------------------------------------
   MIXED CONTENT — read this before editing.

   The two academic projects carry REAL copy, written from public/resume.pdf.
   The two OpalusPH sites are still placeholders.

   Still unverified even on the real two — replace in PORT-057:
     - year, status          inferred from the graduation timeline, not stated
     - stack "TBC" entries   the resume lists no per-project stack
     - liveUrl / repoUrl     omitted rather than invented; add if they exist
     - most images           cict-project-gate now carries REAL screenshots of
                             the running app (2026-09-20); the other three
                             projects' files still read "SCREENSHOT PENDING"

   No metric anywhere below was invented. Where an outcome has no measurement,
   it says so — that is deliberate and should survive editing.

   PORT-057 gate: neither "Placeholder" nor "TBC" appears in this file, no
   image in public/images/projects/ still reads "SCREENSHOT PENDING", and
   no "example.com" URL remains. That third clause is NOT redundant — a
   placeholder URL contains no marker word, so the first clause passes over
   it entirely. Grep for all three.

   Field coverage is intentional — do not "tidy" it:
     grades-repository-system      cover + gallery + highlights
     cict-project-gate             gallery + highlights, NO cover (2026-09-20:
                                   it exercises the cover -> thumbnail fallback)
     opalusph-website              role + duration + both URLs, no gallery
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
    // PLACEHOLDER URLs, and the filter that matters is not the text one.
    // `isPlaceholder` matches WORDS, so "https://example.com" sails straight
    // through it — that is exactly how a stand-in URL once reached a JSON-LD
    // `sameAs`, the field asserting this project IS that address.
    // `isPlaceholderUrl` (lib/seo.ts) guards both surfaces: JSON-LD omits the
    // value, and ProjectHeader renders "Live site — PENDING" as inert text
    // rather than a clickable link. Replace with the real URLs and both
    // surfaces light up on their own; no code change needed.
    liveUrl: "https://example.com",
    repoUrl: "https://example.com",

    // No `cover`: with a real screenshot there is no second crop to serve, so
    // the page header falls back to this exact file — the documented fallback
    // in types.ts, used here on purpose rather than duplicating one image
    // under two names.
    thumbnail: {
      src: "/images/projects/cict-project-gate.webp",
      alt: "The title submission screen in CICT Project Gate, with the duplicate check reporting the proposed title as 100% similar to an existing one and advising a revision.",
      width: 1919,
      height: 869,
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

    gallery: [
      {
        src: "/images/projects/cict-project-gate-gallery-1.webp",
        alt: "The student dashboard, with a welcome panel, a notifications count and a table of recently submitted capstone titles.",
        width: 1115,
        height: 550,
      },
      {
        src: "/images/projects/cict-project-gate-gallery-2.webp",
        alt: "The capstone archive, listing previously approved titles with their block, program and submission date, above a search field.",
        width: 1112,
        height: 532,
      },
      {
        src: "/images/projects/cict-project-gate-gallery-3.webp",
        alt: "A submitted title's detail view, showing its description, a faculty comment, and controls to download the result or allow a transfer request.",
        width: 1116,
        height: 532,
      },
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
    liveUrl: "https://example.com",
    repoUrl: "https://example.com",
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
    tags: ["internship", "marketing-site", "cms", "sa"],
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
