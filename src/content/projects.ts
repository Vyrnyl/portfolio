import type { Project } from "./types";

/* ---------------------------------------------------------------------------
   PLACEHOLDER CONTENT — PORT-012 shipped deliberately incomplete.

   Every prose string below contains the word "Placeholder" and every image is a
   generated stand-in. The SHAPE is real: field coverage, string lengths, status
   values and tag overlap are all chosen to exercise the components that will be
   built on top of this file. The FACTS are not real and must not ship.

   Unverified and needing replacement: year, status, tags, stack, role, duration,
   every URL, and all problem/approach/outcome prose.

   PORT-057 closes this. Its gate: no occurrence of "Placeholder" survives in
   this file, and no "SCREENSHOT PENDING" image survives in public/images/projects/.

   Field coverage is intentional — do not "tidy" it:
     grades-repository-system      every optional field present
     cict-project-gate             cover + highlights, no gallery/duration/liveUrl
     opalusph-website              role + liveUrl only
     construction-company-website  no optional fields at all
   That spread is what forces every optional branch AND its fallback to be built.
--------------------------------------------------------------------------- */

export const projects = [
  {
    slug: "grades-repository-system",
    title: "Grades Repository System",
    summary:
      "Placeholder summary — real copy pending. Sized near the 100-character card limit.",
    year: 2023,
    status: "archived",
    featured: true,
    tags: ["school-project", "full-stack", "dashboard"],
    stack: ["Framework TBC", "Database TBC", "Hosting TBC"],
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
    liveUrl: "https://example.com",
    repoUrl: "https://example.com",

    problem:
      "Placeholder copy — the real problem statement goes here. A finished version names who was blocked, what they were trying to accomplish, and why the way they were already doing it had stopped working. This paragraph is sized to match that, so the detail page is laid out against a realistic block of text rather than a single line.",
    approach:
      "Placeholder copy — the real approach goes here. A finished version describes what was actually built and picks out one decision worth defending, including the option that was rejected and the reason. Two to four sentences is the target length.",
    outcome:
      "Placeholder copy — the real outcome goes here. A finished version says what measurably changed, with a number where an honest one exists and a plain description where it does not. Inventing a metric here is worse than admitting there is not one.",

    highlights: [
      "Placeholder highlight one — real bullet pending.",
      "Placeholder highlight two, deliberately longer so the list is tested against a bullet that wraps onto a second line.",
      "Placeholder highlight three — real bullet pending.",
      "Placeholder highlight four — real bullet pending.",
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
    role: "Placeholder role — pending",
    duration: "Placeholder duration",
  },
  {
    slug: "cict-project-gate",
    title: "CICT Project Gate",
    summary: "Placeholder summary — real copy pending.",
    year: 2024,
    status: "in-progress",
    featured: true,
    tags: ["school-project", "full-stack"],
    stack: ["Framework TBC", "Database TBC"],
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
    repoUrl: "https://example.com",

    problem:
      "Placeholder copy — the real problem statement goes here. This entry deliberately carries no gallery, no duration and no live URL, so that the components built on top of it are forced to handle those fields being absent.",
    approach:
      "Placeholder copy — the real approach goes here. Keep the finished version concrete: what was built, and the one decision that took actual thought.",
    outcome:
      "Placeholder copy — the real outcome goes here. Say what changed for the people who use it.",

    highlights: [
      "Placeholder highlight one — real bullet pending.",
      "Placeholder highlight two — real bullet pending.",
      "Placeholder highlight three — real bullet pending.",
    ],
    role: "Placeholder role — pending",
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
    stack: ["Framework TBC", "Hosting TBC"],
    thumbnail: {
      src: "/images/projects/opalusph-website.webp",
      alt: "Placeholder graphic standing in for a screenshot of the OpalusPH company website.",
      width: 1600,
      height: 1000,
    },
    liveUrl: "https://example.com",

    problem:
      "Placeholder copy — the real problem statement goes here. This entry has no cover image, so the detail page must fall back to the thumbnail exactly as the type comment promises.",
    approach:
      "Placeholder copy — the real approach goes here. Two to four sentences in the finished version.",
    outcome:
      "Placeholder copy — the real outcome goes here. Numbers if honest ones exist; plain description if not.",

    role: "Placeholder role — pending",
  },
  {
    slug: "construction-company-website",
    title: "Construction Company Website",
    summary:
      "Placeholder summary — real copy pending, sized mid-range for the card grid.",
    year: 2025,
    status: "live",
    featured: false,
    tags: ["internship", "marketing-site", "cms"],
    stack: ["Framework TBC"],
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
