import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/investment",
  description:
    "Curated, nature-first investment opportunities with Vanatvam. Diversify your portfolio with managed farmland in Karnataka.",
});

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
