import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/brindavana",
  description:
    "A reforestation community at Krishnapura, Pavagada, turning dry, thorny land into green shade. Explore Brindavana's plots, plans and brochure.",
  image: "/assets/project-images/Brindavana/sunny-tropical-banana-orchard.webp",
});

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
