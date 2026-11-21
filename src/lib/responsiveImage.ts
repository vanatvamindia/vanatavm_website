import manifest from "@/data/image-variants.json";

/**
 * Responsive image helpers backed by pre-generated variants (see scripts/generate-image-variants.mjs).
 *
 * Zoho Catalyst cannot resize images on request the way Vercel does, so every referenced image
 * is resized ahead of time into public/_img/. These helpers build `srcSet`/`sizes` so the browser
 * downloads the size that fits the screen. Any image without variants falls back to its original
 * file, so a missing manifest entry can never break an image.
 */

type VariantSet = { w: number; h: number; widths: number[] };
type ManifestEntry = VariantSet & { hash: string; portrait?: VariantSet };

const VARIANTS = manifest as Record<string, ManifestEntry>;
const VARIANT_ROOT = "/_img";

/** Props to spread onto an `<img>` (or `motion.img`). `srcSet`/`sizes` are omitted when no variants exist. */
export type ResponsiveImgProps = { src: string; srcSet?: string; sizes?: string };

/** Variant folder for an image: "/a/b.webp" → "/_img/a/b_webp". Mirrors variantDir() in the generator. */
function variantDir(src: string): string {
  return VARIANT_ROOT + src.replace(/\.([a-z0-9]+)$/i, "_$1");
}

function entryFor(src: string | undefined | null): ManifestEntry | undefined {
  if (!src || !src.startsWith("/")) return undefined;
  return VARIANTS[src.split(/[?#]/)[0]];
}

/**
 * `srcSet` string for a local image: every resized copy plus the original at its real width.
 * @returns e.g. "/_img/…/w480.webp 480w, /_img/…/w828.webp 828w, /assets/…/hero.webp 1768w",
 *          or `undefined` for remote URLs and images without variants.
 */
export function srcSetFor(src: string | undefined | null): string | undefined {
  const entry = entryFor(src);
  if (!entry || !src) return undefined;
  const dir = variantDir(src.split(/[?#]/)[0]);
  return [...entry.widths.map((w) => `${dir}/w${w}.webp ${w}w`), `${src} ${entry.w}w`].join(", ");
}

/**
 * `srcSet` for the portrait centre-crop of a full-screen hero image (phones in portrait).
 * @returns The srcSet string, or `undefined` when the image has no portrait crop.
 */
export function portraitSrcSetFor(src: string | undefined | null): string | undefined {
  const portrait = entryFor(src)?.portrait;
  if (!portrait || !src) return undefined;
  const dir = variantDir(src.split(/[?#]/)[0]);
  return portrait.widths.map((w) => `${dir}/p${w}.webp ${w}w`).join(", ");
}

/**
 * Spreadable `<img>` props: `src` plus `srcSet`/`sizes` when variants exist.
 *
 * @param src   Image path as used today, e.g. "/assets/project-images/Maduvana/hero.webp".
 * @param sizes How wide the image is drawn, as a CSS `sizes` value. Defaults to full viewport width.
 *              When `object-fit: cover` crops a wide image into a tall box, describe the width the
 *              image is scaled to, not the box (see the hero usages).
 *
 * @example <img {...responsiveImg(proj.img, "(max-width: 768px) 92vw, 33vw")} alt={proj.name} />
 */
export function responsiveImg(src: string, sizes = "100vw"): ResponsiveImgProps {
  const srcSet = srcSetFor(src);
  return srcSet ? { src, srcSet, sizes } : { src };
}

/**
 * Smallest prepared copy at least `width` pixels wide (falls back to the original file).
 * Used by the next/image custom loader.
 */
export function variantForWidth(src: string, width: number): string {
  const entry = entryFor(src);
  if (!entry) return src;
  const clean = src.split(/[?#]/)[0];
  const match = entry.widths.find((w) => w >= width);
  return match ? `${variantDir(clean)}/w${match}.webp` : src;
}
