import type { Metadata } from "next";

/** Production origin. Canonicals and og:url always use this, even on the testing host. */
export const SITE_URL = "https://www.vanatvam.com";

export const DEFAULT_OG_IMAGE =
  "/assets/project-images/Brindavana/sunny-tropical-banana-orchard.webp";

/**
 * Per-page metadata: description, canonical URL and matching Open Graph tags.
 * Titles are intentionally NOT set here, so each page keeps the title it already has.
 *
 * A route-level `openGraph` replaces the root layout's whole `openGraph` object (it is not
 * merged), so every field the root sets is repeated here.
 */
export function pageMetadata({
  path,
  title,
  description,
  image = DEFAULT_OG_IMAGE,
}: {
  path: string;
  /** Page title; the root layout adds " | VanaTvam". Omit to keep the site default. */
  title?: string;
  description: string;
  image?: string;
}): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: url },
    openGraph: {
      title: title ? `${title} | VanaTvam` : "Vanatvam | Sustainable Managed Farmland",
      description,
      url,
      siteName: "Vanatvam",
      locale: "en_IN",
      type: "website",
      images: [{ url: image, alt: "Vanatvam Nature Communities" }],
    },
  };
}
