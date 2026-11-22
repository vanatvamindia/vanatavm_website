import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/madhuvana",
  description:
    "Madhuvana: 17 acres of quarter-acre farm plots off the Bangalore–Mysore highway, near Maddur and Mandya, surrounded by the River Kaveri and its canals.",
  image: "/assets/project-images/Maduvana/hero.webp",
});

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
