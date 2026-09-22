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
     grades-repository-system      cover + gallery + highlights, no role/duration
     cict-project-gate             gallery + highlights, NO cover (2026-09-20:
                                   it exercises the cover -> thumbnail fallback)
     gsp-mis                       gallery + highlights + role + duration, no cover
     presyo-serbisyo               gallery + highlights + role + duration, no cover
   Every optional field is still present on at least one entry, and `cover` is
   still absent on three — that is what forces every branch AND its fallback to
   stay built in PORT-021 / 031 / 032.

   TWO COVERAGE GAPS opened on 2026-09-22 when the OpalusPH entries went, and
   they are recorded rather than quietly accepted:
     - NO entry now has zero optional fields. construction-company-website was
       the minimum-Project case proving components render it without a stray
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
    slug: "gsp-mis",
    title: "GSP Management Information System",
    summary:
      "Role-based platform replacing the Girl Scouts council's paper records with one system.",
    year: 2026,
    status: "live",
    featured: true,
    tags: ["full-stack", "access-control", "dashboard"],
    stack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "Prisma",
      "PostgreSQL",
      "Chart.js",
      "Vitest",
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
      "The Girl Scouts of the Philippines Catanduanes Council tracks thousands of scouts across troops and schools — registrations, event attendance, badge progress, membership fees. Handled on paper and in spreadsheets, that work is slow to update, error-prone and nearly impossible to report on. A council officer asking which troops were falling behind on attendance had no way to answer without manually collating records.",
    approach:
      "Sixteen backend domain modules, each paired with its own screens: membership, events and attendance, badges, finance, reporting and analytics. Permissions are fully relational — roles come from a user_roles join table and capabilities from role_permissions, with no role column on the user record — so access is a question the data answers rather than a flag someone remembered to check. Every protected route carries RBAC middleware, and the dashboard reads its role from the session token server-side, never from a client parameter.",
    outcome:
      "All 21 planned features across four phases are complete end to end and deployed against a live PostgreSQL database, with 325 automated tests passing. Three roles are enforced server-side, and six report types export to real PDF and Excel with persisted history — so the attendance question that used to need manual collation is now a report.",

    role: "Solo developer",
    duration: "4 phases",

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
      "DTI Catanduanes monitors commodity prices across stores in the province — officers visit shops, write observed prices on paper forms, and someone later compares each figure by hand against the official Suggested Retail Price to spot violations. That work is slow, error-prone and produces no usable history. An officer asking which stores were overpricing, and by how much, had to collate a stack of forms by hand — and consumers had no visibility into any of it.",
    approach:
      "Twelve backend domain modules covering the commodity catalog, effective-dated SRP reference data, a store registry and field price capture. Price records run their SRP comparison at write time, so Compliant / Above SRP / Below SRP is computed once rather than re-derived per screen, and store compliance reads that same status instead of defining compliance a second way. Authorization is deliberately two-layer: route-level middleware gates who may call a route, while per-module scope helpers gate whose rows they see — a route guard alone leaks other officers' data, and scoping alone lets the wrong role reach the handler.",
    outcome:
      "All 71 planned features across eight phases are complete and deployed against a live PostgreSQL database, with 132 automated tests passing. ARIMA forecasting projects next-week prices with confidence scored from the series' own volatility and data support, and an unauthenticated public namespace exposes current prices against SRP — so the transparency the paper process could not offer is now the default view.",

    role: "Solo developer",
    duration: "8 phases",

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
