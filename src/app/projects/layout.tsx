import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/projects",
  description:
    "Explore Vanatvam's nature communities in the Bangalore–Mysore–Chamarajanagar corridor, where nature, heritage and culture come together.",
});

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
