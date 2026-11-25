import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only set for the Catalyst AppSail build (NEXT_OUTPUT=standalone); Slate/OpenNext builds are unaffected.
  ...(process.env.NEXT_OUTPUT === "standalone" ? { output: "standalone" as const } : {}),
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    // Put the (small, Tailwind-based) CSS inside the HTML instead of a separate file.
    // On Zoho Catalyst every extra request waits ~1.5-3s for the server, and the stylesheet
    // blocks rendering, so first-time visitors see the page much sooner. Trade-off: ~30 KB more
    // per HTML page for returning visitors. Remove this flag on a fast CDN host such as Vercel.
    inlineCss: true,
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "clsx",
      "tailwind-merge",
    ],
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  allowedDevOrigins: [
    "192.168.1.13",
    "10.139.56.82",
    "10.170.23.82",
    "127.0.0.1",
    "localhost",
  ],
  images: {
    // Zoho Catalyst does not run the built-in optimizer (/_next/image returns 500), so a custom
    // loader serves pre-generated sizes from /public/_img instead (see src/lib/imageLoader.ts and
    // scripts/generate-image-variants.mjs). Sanity images use Sanity's own CDN resizing.
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/eeshavana",
        destination: "/ishavana",
        permanent: true,
      },
      {
        // The Founder's Statement page was retired (it was not linked anywhere, its chapter
        // photos were missing, and its content is covered by the founder section on /about).
        source: "/founders-statement",
        destination: "/about",
        permanent: true,
      },
      // Old WordPress URLs (vanatvam.com migration). Keep for 6-12 months so Google can re-index.
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/project-madhuvana", destination: "/madhuvana", permanent: true },
      { source: "/our-purpose", destination: "/about", permanent: true },
      { source: "/project-eeshavana", destination: "/ishavana", permanent: true },
      { source: "/project-ananta-vana", destination: "/anantavana", permanent: true },
      { source: "/project-brindavana", destination: "/brindavana", permanent: true },
      {
        source: "/Blogs-content/May%202022/:path*",
        destination: "/Blogs-content/May-2022/:path*",
        permanent: true,
      },
      {
        source: "/Blogs-content/June%202022/:path*",
        destination: "/Blogs-content/June-2022/:path*",
        permanent: true,
      },
      {
        source: "/Event%20images/:path*",
        destination: "/event-images/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/Blogs-content/May%202022/:path*",
        destination: "/Blogs-content/May-2022/:path*",
      },
      {
        source: "/Blogs-content/June%202022/:path*",
        destination: "/Blogs-content/June-2022/:path*",
      },
      {
        source: "/Event%20images/:path*",
        destination: "/event-images/:path*",
      },
      {
        source: "/assets/images/question.png",
        destination: "/assets/images/question.webp",
      },
      {
        source: "/assets/images/Strategic.png",
        destination: "/assets/images/strategic.webp",
      },
      {
        source: "/assets/images/strategic.png",
        destination: "/assets/images/strategic.webp",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/event-images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/Blogs-content/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
