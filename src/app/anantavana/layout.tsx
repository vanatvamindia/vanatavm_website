import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/anantavana",
  description:
    "Anantavana is a sustainable reforestation community on the River Kabini for nature lovers, developed by Vanatvam with Indus Herbs.",
  image: "/assets/project-images/Ananthavana/hero-image-2.webp",
});

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
