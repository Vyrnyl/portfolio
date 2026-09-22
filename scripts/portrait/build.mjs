/**
 * Reprocesses the profile portrait.
 *
 *   node scripts/portrait/build.mjs <source-image> [output]
 *
 * Defaults the output to public/images/profile.webp. Playwright is NOT a
 * project dependency (the site does not need it at runtime), so this resolves
 * it from wherever npx cached it, the same way scripts/resume/build.mjs does.
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { pathToFileURL } from "node:url";

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
  throw new Error("playwright not found. Run:  npx playwright@1.63 install chromium");
}

const chromium = await loadChromium();

/*
 * Warm-monochrome portrait, processed in a real browser canvas.
 *
 * The site's --ink is oklch(0.251 0.014 164) and --ground is
 * oklch(0.985 0.004 91): a green-biased near-black on a warm off-white. So a
 * NEUTRAL greyscale would actually sit slightly cold against this palette.
 * The duotone below maps black -> the ink hue and white -> the ground hue,
 * which is why it reads as "the site's" monochrome rather than a filter.
 *
 * Luminance uses Rec.709 coefficients, not a flat average: a flat average
 * renders skin and a mid-green as the same grey and flattens the face.
 */
const SRC = process.argv[2];
const OUT =
  process.argv[3] ??
  path.resolve(
    path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")),
    "../../public/images/profile.webp",
  );

if (!SRC) {
  console.error("usage: node scripts/portrait/build.mjs <source-image> [output]");
  process.exit(1);
}

/*
 * No fixed target ratio and NO baked padding: the photo keeps its own shape
 * and AboutIntro's box supplies the 4:5 frame, the surface ground and the
 * inset via `aspect-portrait` + `object-contain` + `p-3`.
 *
 * That split is deliberate. Padding baked into the file would double up with
 * the CSS padding, and a differently-shaped replacement photo would need the
 * file regenerated to match the box. With the framing in CSS, a new source
 * just drops in.
 *
 * Long edge is capped so the file stays small; the source is ~1535x2048.
 */
const MAX_EDGE = 1400;

/*
 * NO crop and NO pad — the whole frame, at its own ratio, only resized.
 *
 * Two earlier versions got this wrong in opposite directions: one cropped a
 * 4:5 window and spent two attempts hunting for coordinates that did not cut
 * off the subject's head, the other baked the padding into the file. Both put
 * layout decisions in an image. The box in AboutIntro owns the ratio, the
 * ground and the inset, so this script only has to convert colour.
 */
const browser = await chromium.launch();
const page = await browser.newPage();

const b64 = fs.readFileSync(SRC).toString("base64");

const out = await page.evaluate(
  async ({ dataUrl, MAX_EDGE }) => {
    const img = new Image();
    img.src = dataUrl;
    await img.decode();

    const scale = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
    const TARGET_W = Math.round(img.naturalWidth * scale);
    const TARGET_H = Math.round(img.naturalHeight * scale);

    const c = document.createElement("canvas");
    c.width = TARGET_W;
    c.height = TARGET_H;
    const ctx = c.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, TARGET_W, TARGET_H);

    const id = ctx.getImageData(0, 0, TARGET_W, TARGET_H);
    const d = id.data;

    // Duotone endpoints sampled from the site tokens, converted to sRGB.
    // shadow = --ink, highlight = --ground.
    const SHADOW = [46, 62, 55];
    const HIGH = [251, 250, 245];

    for (let i = 0; i < d.length; i += 4) {
      // Rec.709 luma keeps facial modelling that a flat average destroys.
      let l = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;

      /*
       * The store lighting is bright and flat, so the FIRST attempt washed
       * out: a symmetric S-curve lifted highlights that were already near the
       * top and the face lost its modelling. This instead pulls the whole
       * range DOWN before adding contrast.
       *
       * 1. gamma > 1 darkens midtones (the overexposed background recedes)
       * 2. contrast around a pivot BELOW 0.5, so the lift lands on the
       *    subject rather than on the already-blown ceiling
       */
      l = Math.pow(l, 1.35);
      const PIVOT = 0.42;
      l = PIVOT + (l - PIVOT) * 1.28;
      l = Math.max(0, Math.min(1, l));
      l = 0.06 + l * 0.9; // keep off pure black/white so it sits on --ground

      d[i] = SHADOW[0] + (HIGH[0] - SHADOW[0]) * l;
      d[i + 1] = SHADOW[1] + (HIGH[1] - SHADOW[1]) * l;
      d[i + 2] = SHADOW[2] + (HIGH[2] - SHADOW[2]) * l;
    }
    ctx.putImageData(id, 0, 0);

    const blob = await new Promise((r) => c.toBlob(r, "image/webp", 0.92));
    const buf = new Uint8Array(await blob.arrayBuffer());
    let s = "";
    for (const byte of buf) s += String.fromCharCode(byte);
    return { b64: btoa(s), w: c.width, h: c.height };
  },
  { dataUrl: `data:image/jpeg;base64,${b64}`, MAX_EDGE },
);

fs.writeFileSync(OUT, Buffer.from(out.b64, "base64"));
console.log(`${OUT}  ${out.w}x${out.h}  ${(fs.statSync(OUT).size / 1024).toFixed(0)}KB`);

await browser.close();
