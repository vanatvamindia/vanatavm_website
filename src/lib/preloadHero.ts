import { preload } from "react-dom";
import { portraitSrcSetFor, srcSetFor } from "@/lib/responsiveImage";

/** Must match the `media` used by <PortraitSource>. */
const PORTRAIT_MEDIA = "(max-aspect-ratio: 3/4)";
const LANDSCAPE_MEDIA = "(min-aspect-ratio: 3/4)";

/**
 * Asks the browser to start downloading a page's hero image from the document `<head>`,
 * before it reaches the `<img>` deep in the HTML. Call it during render in the page that shows
 * the hero (never in the root layout, or every page pays for one page's image).
 *
 * It mirrors the hero markup (`<PortraitSource>` + `responsiveImg(src)`), so the browser preloads
 * exactly the file the `<picture>` will pick: the portrait crop on phones, the matching width
 * elsewhere. React de-duplicates repeated calls.
 *
 * @param src Hero image path, e.g. "/assets/project-images/Esahavana/EV.webp".
 */
export function preloadHero(src: string): void {
  const portrait = portraitSrcSetFor(src);
  const landscape = srcSetFor(src);

  preload(src, {
    as: "image",
    fetchPriority: "high",
    imageSrcSet: landscape,
    imageSizes: landscape ? "100vw" : undefined,
    media: portrait ? LANDSCAPE_MEDIA : undefined,
  });

  if (portrait) {
    // href is required by the API; browsers that support imagesrcset use the srcset instead.
    const largest = portrait.split(", ").pop()!.split(" ")[0];
    preload(largest, {
      as: "image",
      fetchPriority: "high",
      imageSrcSet: portrait,
      imageSizes: "75vh",
      media: PORTRAIT_MEDIA,
    });
  }
}
