"use client";

import { variantForWidth } from "@/lib/responsiveImage";

/**
 * Custom next/image loader (configured in next.config.ts via `images.loaderFile`).
 *
 * Zoho Catalyst does not run Next.js's built-in image optimizer (/_next/image returns HTTP 500),
 * so instead of resizing on request this maps each requested width to:
 *  - Sanity CDN images: Sanity's own resizing parameters (?w=&q=&auto=format).
 *  - Local images: the closest pre-generated copy in /public/_img (falls back to the original).
 *
 * @returns The URL the browser should load for this width.
 */
export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (src.startsWith("https://cdn.sanity.io/")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 75));
    url.searchParams.set("auto", "format");
    return url.toString();
  }
  return variantForWidth(src, width);
}
