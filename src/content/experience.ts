import type { Education, Job } from "./types";

/* ---------------------------------------------------------------------------
   Source: public/resume.pdf, extracted 2026-08-22. Bullets are rewritten
   outcome-first per PORT-013's criterion; no claim was added that the resume
   does not already make.

   Two values are INFERRED, not read — replace them in PORT-034:
     - education.start ("2022-08") — the resume gives only the graduation date.
       A four-year BSIT starting in the August intake is the assumption.
     - jobs[0].location — the resume lists this only in the page header.

   KNOWN GAP: the OpalusPH internship is not here, because it is not on the
   resume and no dates exist for it. Employment dates are the one thing not
   being placeheld — a wrong one is caught in a background check. Four facts
   add it: company name, role title, start "YYYY-MM", end "YYYY-MM".
--------------------------------------------------------------------------- */

export const jobs = [
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
