import type { Project } from "./types";

/* ---------------------------------------------------------------------------
   MIXED CONTENT — read this before editing.

   2026-09-22: the two OpalusPH placeholder entries were REPLACED by gsp-mis
   and presyo-serbisyo, both written from Vernel's own project notes. Those
   two are fully real — real copy, real screenshots of the running apps, real
   live and repo URLs, and stacks named rather than "TBC".

   The two academic projects carry REAL copy written from public/resume.pdf,
   but are still unverified on the points below — replace in PORT-057:
     - year, status          inferred from the graduation timeline, not stated
     - stack "TBC" entries   the resume lists no per-project stack
     - liveUrl / repoUrl     still "https://example.com" on both
     - images                cict-project-gate carries REAL screenshots
                             (2026-09-20); grades-repository-system's four
                             files still read "SCREENSHOT PENDING"

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
     gsp-mis                       gallery + highlights, no cover
     presyo-serbisyo               gallery + highlights, no cover
   `cover` is absent on three, which keeps the fallback branch exercised in
   PORT-021 / 031 / 032.

   THREE COVERAGE GAPS, recorded rather than quietly accepted:
     - NO entry sets `role` or `duration` (removed 2026-09-22 at Vernel's
       request — the values read as filler on solo projects). ProjectHeader
       still branches on both and its <dl> now renders empty on every project,
       so that code path is live but unexercised.
     - NO entry has zero optional fields. construction-company-website was the
       minimum-Project case proving components render it without a stray
       separator. /gallery does not cover this either.
     - NO entry is status "in-progress". STATUS_TEXT in project-header.tsx is
       a Record<ProjectStatus, string>, so the case cannot vanish without
       failing the build — but nothing RENDERS it, and this repo's own lesson
       is that a state no page renders is a state nothing tests.
--------------------------------------------------------------------------- */

export const projects = [
  {
    slug: "cict-project-gate",
    title: "CICT Project Gate",
    summary:
      "Capstone title submission with GPT-4 assistance and embedding-based duplicate detection.",
    year: 2025,
    status: "archived",
    featured: true,
    tags: ["school-project", "full-stack", "ai", "access-control"],
    stack: ["React.js", "Node.js", "Express", "MySQL", "Prisma", "Vector embeddings"],
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
      "Capstone titles get approved one at a time, and nobody can remember every title already submitted. So two groups can spend weeks on the same idea without knowing it. The clash usually shows up at panel review, which is the worst time to find out. What makes it hard is that matching topics are rarely worded the same way.",
    approach:
      "The system checks a new title against every existing one before a person reviews it. It compares meaning instead of matching words, so it still catches two titles that describe the same project in different language. GPT-4 helps students suggest and improve titles, but never decides anything. Each group gets its own access: students submit, faculty review and comment, admins manage users and settings.",
    outcome:
      "Repeated topics get caught at submission instead of at panel review, and reviewers see a similarity score next to each title. This was a school project, so there are no real usage numbers to show.",

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
    year: 2024,
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
      "Students, faculty and admins all need the same grade records, but they need to do different things with them. Students read their own results. Faculty enter and correct grades. Admins manage everything. Putting all three in one system makes access the main thing to get right — one mistake and a student sees someone else's grades.",
    approach:
      "One records system where each role gets its own level of access, checked in a single place instead of on every screen. Faculty can assign and update grades. Students can only read their own, across all their semesters. The data side got the most care: the APIs and queries were written to stay fast as records pile up, since a grades table only ever grows.",
    outcome:
      "All three groups now work from the same records instead of keeping separate copies, and every access rule lives in one place. It was a school project, so it never ran at full school scale and there are no real performance numbers.",

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
    slug: "gsp-mis",
    title: "GSP Management Information System",
    summary:
      "Role-based platform replacing the Girl Scouts council's paper records with one system.",
    year: 2026,
    status: "live",
    featured: true,
    tags: ["full-stack", "access-control", "dashboard"],
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "Prisma",
      "PostgreSQL",
      "Chart.js",
    ],
    thumbnail: {
      src: "/images/projects/gsp-mis.webp",
      alt: "The GSP dashboard showing active councils, troops and member counts beside a membership growth chart and a members-by-status breakdown.",
      width: 1917,
      height: 912,
    },
    liveUrl: "https://gsp-mis-web.vercel.app/login",
    repoUrl: "https://github.com/Vyrnyl/gsp-mis",

    problem:
      "The Girl Scouts council in Catanduanes keeps track of thousands of scouts across troops and schools — sign-ups, event attendance, badges and fees. All of it lived on paper and in spreadsheets, which is slow to update and easy to get wrong. If an officer wanted to know which troops were falling behind on attendance, the only way to find out was to go through the records by hand.",
    approach:
      "Sixteen parts of the system, each with its own screens: members, events and attendance, badges, money, reports and charts. Permissions are stored as data rather than as a setting on each user, so what someone can do is always looked up, never assumed. Every protected page checks the user's role on the server, so it can't be faked from the browser.",
    outcome:
      "All 21 planned features are finished and running on a live database, with 325 automated tests passing. Three roles are enforced on the server, and six kinds of reports export to real PDF and Excel files that are saved for later. The attendance question that used to mean digging through paper is now just a report.",

    highlights: [
      "39 Prisma models, 21 web pages and 67 BFF handlers in an npm-workspaces monorepo.",
      "Relational RBAC — no role column on the user record, so permissions cannot drift out of the data.",
      "Six report types exported to real PDF and Excel, with generation history persisted.",
      "Seven analytics tabs, each broken down by school, level, troop or category.",
    ],
    gallery: [
      {
        src: "/images/projects/gsp-mis-gallery-1.webp",
        alt: "The report generation screen offering six report types, with a date range, troop filter and a generate preview action.",
        width: 1917,
        height: 917,
      },
      {
        src: "/images/projects/gsp-mis-gallery-2.webp",
        alt: "Financial tracking showing total income, expenses and council balance above an income-versus-expense chart and an expenses-by-category breakdown.",
        width: 1917,
        height: 916,
      },
      {
        src: "/images/projects/gsp-mis-gallery-3.webp",
        alt: "The councils and troops registry listing five troops with their codes, leaders and member counts, two flagged as having no leader.",
        width: 1917,
        height: 915,
      },
    ],
  },
  {
    slug: "presyo-serbisyo",
    title: "PresyoSerbisyo",
    summary:
      "Price monitoring and forecasting for DTI Catanduanes, with a public transparency surface.",
    year: 2026,
    status: "live",
    featured: false,
    tags: ["full-stack", "access-control", "dashboard", "forecasting"],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "Prisma",
      "PostgreSQL",
      "Chart.js",
      "ARIMA",
    ],
    thumbnail: {
      src: "/images/projects/presyo-serbisyo.webp",
      alt: "The public PresyoSerbisyo landing page headlined Monitor Commodity Prices in Real-Time, noting prices collected by DTI field officers.",
      width: 1897,
      height: 913,
    },
    liveUrl: "https://price-service-v2.vercel.app/",
    repoUrl: "https://github.com/Vyrnyl/price-service-v2",

    problem:
      "DTI Catanduanes checks commodity prices in stores around the province. Officers visit shops, write prices on paper forms, and someone later compares each one by hand against the official Suggested Retail Price to spot overpricing. It is slow, easy to get wrong, and leaves no history worth using. Asking which stores were overpricing meant going through a stack of forms — and shoppers could not see any of it.",
    approach:
      "Twelve parts of the system cover the list of goods, the official prices, the stores and the prices officers record in the field. When a price is saved, the system immediately compares it to the official price and marks it as within, above or below — worked out once and reused everywhere, so no screen can disagree with another. Access is checked twice on purpose: once for who is allowed to open a page, and again for whose records they are allowed to see. Either check on its own leaves a hole.",
    outcome:
      "All 71 planned features are finished and running on a live database, with 132 automated tests passing. The system predicts next week's prices and says how confident it is based on how steady the prices have been. Anyone can view current prices against the official ones without logging in — the openness the paper process never allowed is now the default.",

    highlights: [
      "Automatic SRP comparison at write time — compliance computed once, never redefined per screen.",
      "Two-layer authorization: route-level role guards plus unit-tested per-module scope helpers.",
      "ARIMA forecasting with confidence derived from volatility, data support and horizon.",
      "A public, unauthenticated transparency surface with no PUBLIC role in the permission model.",
    ],
    gallery: [
      {
        src: "/images/projects/presyo-serbisyo-gallery-1.webp",
        alt: "The admin market insights dashboard showing a 30-day market price trend line with a tooltip reading 82.15 pesos on August 29.",
        width: 1900,
        height: 911,
      },
      {
        src: "/images/projects/presyo-serbisyo-gallery-2.webp",
        alt: "Price trends and forecasts for one commodity, showing current price, latest SRP with an Above SRP status, and a forecast for next week.",
        width: 1901,
        height: 917,
      },
      {
        src: "/images/projects/presyo-serbisyo-gallery-3.webp",
        alt: "The commodity catalog listing 318 monitored goods across 33 categories, with filters for name, category and active status.",
        width: 1897,
        height: 912,
      },
    ],
  },
] satisfies Project[];
