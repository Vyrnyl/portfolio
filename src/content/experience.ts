import type { Education, Job } from "./types";

/* ---------------------------------------------------------------------------
   Source: public/resume.pdf, extracted 2026-08-22, plus the OpalusPH facts
   Vernel supplied that day and the achievements he supplied 2026-08-25.
   Bullets are rewritten outcome-first per PORT-013's criterion; no claim was
   added that the resume, or Vernel, does not make.

   Listed newest first. Sorting belongs to the accessors in PORT-015, not here.

   CONFIRMED 2026-08-25, ahead of PORT-034 — all four were previously inferred:
     - jobs[0] year "2026"          correct.
     - jobs[0].role                 formally an internship; title corrected to
                                    "Frontend Developer Intern".
     - jobs[0].location             "Philippines" stands; no city supplied.
     - education.start "2022-08"    correct.

   jobs[0] carries TWO bullets where the other role carries four, and that is
   deliberate. The work was frontend-only, to designs authored by someone
   else, across parts of two sites — a third bullet would have had to invent
   something. Nothing here is quantified, because no measurable outcome was
   available; the work is described instead.

   jobs[1].location comes from the resume's page header, the only place it
   appears.
--------------------------------------------------------------------------- */

export const jobs = [
  {
    company: "OpalusPH",
    role: "Frontend Developer Intern",
    start: "2026-02",
    end: "2026-05",
    location: "Philippines",
    bullets: [
      "Built assigned sections of two company websites in Next.js, turning handed-over designs into working pages.",
      "Delivered frontend-only work inside an existing team, implementing designs authored by someone else rather than making the visual decisions.",
    ],
    stack: ["Next.js"],
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
