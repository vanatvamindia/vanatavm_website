import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    // Embed CSS into the HTML <head> to collapse the HTML→CSS dependency chain
    // and remove the extra round-trip that was adding ~655ms to critical path latency.
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
    unoptimized: true,
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
