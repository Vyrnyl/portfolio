import type { Education, Job } from "./types";

/* ---------------------------------------------------------------------------
   Source: public/resume.pdf, extracted 2026-08-22, plus the OpalusPH facts
   Vernel supplied the same day. Bullets are rewritten outcome-first per
   PORT-013's criterion; no claim was added that the resume does not make.

   Listed newest first. Sorting belongs to the accessors in PORT-015, not here.

   INFERRED, not stated — confirm in PORT-034:
     - jobs[0].start/end year ("2026")  Vernel gave "Feb" and "May" without a
       year. Feb-May immediately preceding a June 2026 graduation is the
       standard final-year OJT window, so 2026 is the reading. ONE WORD TO FIX
       if wrong, and the only inferred employment date in this file.
     - jobs[0].role   given as "frontend dev". If it was formally an internship
       the title should read "Frontend Developer Intern".
     - jobs[0].location   not supplied; "Philippines" is the safe floor.
     - jobs[1].location   the resume lists this only in the page header.
     - education.start ("2022-08")  the resume gives only the graduation date.

   PLACEHOLDER: jobs[0].bullets. The dates are real, the achievements are not
   written yet. Caught by the PORT-057 gate along with everything else marked
   "Placeholder" or "TBC" under src/content/.
--------------------------------------------------------------------------- */

export const jobs = [
  {
    company: "OpalusPH",
    role: "Frontend Developer",
    start: "2026-02",
    end: "2026-05",
    location: "Philippines",
    bullets: [
      "Placeholder — real bullet pending. This role produced the two OpalusPH sites listed under projects; what was actually achieved still needs writing.",
      "Placeholder — real bullet pending. Lead with the outcome, not the task.",
      "Placeholder — real bullet pending.",
    ],
  },
  {
    company: "Freelance",
    role: "Web Developer",
    start: "2024-08",
    end: "2024-12",
    location: "Catanduanes, Philippines",
    bullets: [
      "Delivered a full-stack web application solo and on schedule, owning it from database schema through to the interface.",
      "Shipped authentication with role-based access control, so each type of user reached only the data they were entitled to.",
      "Turned client requirements directly into working features, with no separate spec hand-off between design and build.",
      "Designed the database schema and the API contract together, which kept data consistent as new features were added on top.",
    ],
    stack: ["React.js", "Node.js", "Express.js", "MySQL"],
  },
] satisfies Job[];

export const education = [
  {
    institution: "Catanduanes State University",
    credential: "Bachelor of Science in Information Technology",
    start: "2022-08",
    end: "2026-06",
    note: "College of Information Technology. Relevant coursework: Web Development, Data Structures & Algorithms, Database Systems.",
  },
] satisfies Education[];
