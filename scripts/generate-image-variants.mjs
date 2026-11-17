// Generates responsive copies of every raster image the site references, so each device
// downloads a size that fits its screen. (Zoho Catalyst does not run Next.js's on-demand
// image optimizer, so we prepare the sizes ahead of time instead.)
//
//   npm run images            # create/refresh variants + manifest (run after adding images)
//   npm run images -- --check # exit 1 if any referenced image is missing variants (for CI)
//
// Output (committed to git, so production builds need no image tooling):
//   public/_img/<image path, "." -> "_">/w<width>.webp   resized copies   (e.g. hero.webp -> hero_webp/w828.webp)
//   public/_img/<image path, "." -> "_">/p<width>.webp   portrait centre-crops (heroes only)
//   src/data/image-variants.json                                manifest read by src/lib/responsiveImage.ts
//
// Images without an entry in the manifest simply keep working with their original file.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const OUT_DIR = path.join(PUBLIC_DIR, "_img");
const SRC_DIR = path.join(ROOT, "src");
const MANIFEST = path.join(SRC_DIR, "data", "image-variants.json");

/** Target widths in CSS-independent pixels. Only widths clearly below the original are made. */
const WIDTHS = [480, 828, 1200, 1920, 2560];
/** Skip a width unless it saves at least this fraction versus the original width. */
const MIN_SHRINK = 0.85;
/** WebP quality for resized copies. High on purpose: clarity matters more than the last few KB. */
const QUALITY = 85;
/** Portrait hero crops are shown at full resolution on phones, so keep them near-lossless. */
const PORTRAIT_QUALITY = 90;

/**
 * Full-screen hero backgrounds. Phones show only a tall centre slice of these wide photos,
 * so we also cut a portrait crop at full resolution: phones get sharp pixels without
 * downloading the parts of the photo they never display.
 */
const HEROES = new Set([
  "/assets/project-images/Esahavana/EV.webp",
  "/assets/project-images/Ananthavana/hero-image-2.webp",
  "/assets/project-images/Maduvana/hero.webp",
  "/assets/project-images/Brindavana/brindavanaaa.webp",
  "/assets/project-images/Brindavana/sunny-tropical-banana-orchard.webp",
  "/assets/project-images/Brindavana/tropical-garden-pathway-tunnel.webp",
  "/assets/images/Investment.webp",
]);
/** Width ÷ height of the portrait crop. Wider than any phone screen, so `cover` still fills it. */
const PORTRAIT_ASPECT = 0.62;
const PORTRAIT_WIDTHS = [480, 828];

const REF_PATTERN = /\/(?:assets|event-images|Blogs-content)\/[^"'`\s)]+?\.(?:webp|jpe?g|png)/gi;

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (/\.(tsx?|jsx?|json|css)$/.test(name) && full !== MANIFEST) files.push(full);
  }
  return files;
}

/** Every image path referenced from source code, CSS or data files that exists in /public. */
function referencedImages() {
  const found = new Set();
  for (const file of walk(SRC_DIR)) {
    for (const match of readFileSync(file, "utf8").matchAll(REF_PATTERN)) found.add(match[0]);
  }
  return [...found].filter((p) => existsSync(path.join(PUBLIC_DIR, p))).sort();
}

/** Folder for an image's variants. Keeps the extension so a.png and a.webp never share a folder. */
const variantDir = (src) => src.replace(/\.([a-z0-9]+)$/i, "_$1");
const fingerprint = (buf) => createHash("sha1").update(buf).digest("hex").slice(0, 12);

async function writeVariant(input, outFile, pipeline, quality) {
  mkdirSync(path.dirname(outFile), { recursive: true });
  await pipeline(sharp(input)).webp({ quality, effort: 5, smartSubsample: true }).toFile(outFile);
}

/** Deletes variant files no longer produced (image removed or no longer referenced) and empty folders. */
function removeOrphans(dir, expected) {
  if (!existsSync(dir)) return 0;
  let removed = 0;
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) {
      removed += removeOrphans(full, expected);
      if (readdirSync(full).length === 0) rmSync(full, { recursive: true });
    } else if (!expected.has(full)) {
      rmSync(full);
      removed++;
    }
  }
  return removed;
}

async function main() {
  const checkOnly = process.argv.includes("--check");
  const previous = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};
  const manifest = {};
  let created = 0;
  const stale = [];
  const expected = new Set();

  for (const src of referencedImages()) {
    const input = readFileSync(path.join(PUBLIC_DIR, src));
    const { width, height } = await sharp(input).metadata();
    if (!width || !height || width <= WIDTHS[0]) continue;

    const hash = fingerprint(input);
    const entry = { w: width, h: height, hash, q: QUALITY, widths: WIDTHS.filter((w) => w <= width * MIN_SHRINK) };
    if (HEROES.has(src)) {
      const cropW = Math.min(width, Math.round(height * PORTRAIT_ASPECT));
      entry.portrait = { w: cropW, h: height, q: PORTRAIT_QUALITY, widths: [...PORTRAIT_WIDTHS.filter((w) => w <= cropW * MIN_SHRINK), cropW] };
    }

    const upToDate = previous[src]?.hash === hash && JSON.stringify(previous[src]) === JSON.stringify(entry);
    const outBase = path.join(OUT_DIR, variantDir(src));
    const files = [
      ...entry.widths.map((w) => ({ file: path.join(outBase, `w${w}.webp`), quality: QUALITY, make: (s) => s.resize({ width: w }) })),
      ...(entry.portrait?.widths ?? []).map((w) => ({
        file: path.join(outBase, `p${w}.webp`),
        quality: PORTRAIT_QUALITY,
        make: (s) =>
          s
            .extract({ left: Math.round((width - entry.portrait.w) / 2), top: 0, width: entry.portrait.w, height })
            .resize({ width: w }),
      })),
    ];

    if (checkOnly) {
      if (!upToDate || files.some((f) => !existsSync(f.file))) stale.push(src);
      manifest[src] = entry;
      continue;
    }
    for (const f of files) {
      expected.add(f.file);
      if (upToDate && existsSync(f.file)) continue;
      await writeVariant(input, f.file, f.make, f.quality);
      created++;
    }
    manifest[src] = entry;
  }

  if (checkOnly) {
    if (stale.length) {
      console.error(`Images missing responsive variants (run "npm run images"):\n  ${stale.join("\n  ")}`);
      process.exit(1);
    }
    console.log(`All ${Object.keys(manifest).length} referenced images have variants.`);
    return;
  }

  const removed = removeOrphans(OUT_DIR, expected);
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(
    `${Object.keys(manifest).length} images in manifest, ${created} variant files written, ${removed} stale files removed.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
