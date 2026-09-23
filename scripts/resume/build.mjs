/**
 * Regenerates public/Vernel-Aquino-Resume.pdf from resume.html.
 *
 *   npx playwright@1.63 install chromium   # once, if not already cached
 *   node scripts/resume/build.mjs
 *
 * The resume is authored as HTML here rather than in a word processor so the
 * document that ships is diffable and rebuildable. Content is kept in step
 * with src/content/ by hand — this script does not read the content layer,
 * because the resume orders and trims those facts for a different audience.
 *
 * Playwright is NOT a project dependency (the site does not need it at
 * runtime), so this resolves it from wherever npx cached it and says what to
 * run if it is missing.
 */
import { pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";

const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"));
const src = path.join(here, "resume.html");
const out = path.resolve(here, "../../public/Vernel-Aquino-Resume.pdf");

async function loadChromium() {
  try {
    return (await import("playwright")).chromium;
  } catch {
    /* not a project dependency — fall through to the npx cache */
  }

  const cache = path.join(os.homedir(), "AppData/Local/npm-cache/_npx");
  if (fs.existsSync(cache)) {
    for (const dir of fs.readdirSync(cache)) {
      const entry = path.join(cache, dir, "node_modules/playwright/index.mjs");
      if (fs.existsSync(entry)) return (await import(pathToFileURL(entry).href)).chromium;
    }
  }
  throw new Error(
    "playwright not found. Run:  npx playwright@1.63 install chromium",
  );
}

const chromium = await loadChromium();
const browser = await chromium.launch();
const page = await browser.newPage();

// networkidle so any webfont settles before the print snapshot; a PDF taken
// mid-load lays out against fallback metrics and silently reflows.
await page.goto(pathToFileURL(src).href, { waitUntil: "networkidle" });

await page.pdf({
  path: out,
  format: "Letter",
  printBackground: true,
  // Margins live in @page. Passing them here as well would compound them.
  preferCSSPageSize: true,
});

await browser.close();

/*
 * Verify against the PDF, never against the HTML's scrollHeight. An earlier
 * pass measured 959px against a 960px box, called it a fit, and shipped two
 * lines of Skills onto page two: scrollHeight rounds to integers while the
 * PDF renderer lays out in points, so a single-pixel margin is inside the
 * error bar. The page count below is read out of the generated file.
 */
const text = fs.readFileSync(out);
const pages = (text.toString("latin1").match(/\/Type\s*\/Page\b(?!s)/g) ?? []).length;

console.log(`wrote ${path.relative(process.cwd(), out)} (${(text.length / 1024).toFixed(0)}KB)`);
if (pages > 1) {
  console.error(`WARNING: ${pages} pages. This resume is meant to fit on one.`);
  process.exitCode = 1;
} else {
  console.log("one page ✔");
}
