import { portraitSrcSetFor } from "@/lib/responsiveImage";

/**
 * `<source>` for full-screen hero `<picture>` elements on portrait screens (phones).
 *
 * A wide hero photo drawn with `object-fit: cover` on a tall phone screen only shows a narrow
 * centre slice. This serves a pre-cut centre crop at full resolution instead of a shrunken copy
 * of the whole photo, so the visible part is sharp and no hidden pixels are downloaded.
 * Renders nothing when the image has no portrait crop (the `<img>` fallback is used).
 *
 * `sizes="75vh"`: in a portrait viewport the crop (≈0.62 wide per unit of height) is scaled to
 * at most 75% of the viewport height in width, so this never under-requests pixels.
 *
 * @example
 * <picture>
 *   <PortraitSource src={hero} />
 *   <img {...responsiveImg(hero)} alt="…" />
 * </picture>
 */
export default function PortraitSource({ src }: { src: string }) {
  const srcSet = portraitSrcSetFor(src);
  if (!srcSet) return null;
  return <source media="(max-aspect-ratio: 3/4)" srcSet={srcSet} sizes="75vh" type="image/webp" />;
}
