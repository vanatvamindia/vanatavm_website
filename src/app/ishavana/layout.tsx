import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/ishavana",
  description:
    "Ishavana (aka Eeshavana): a nature-first Kaveri riverfront community near Shivanasamudra Falls, with homes designed around the land.",
  image: "/assets/project-images/Esahavana/EV.webp",
});

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
