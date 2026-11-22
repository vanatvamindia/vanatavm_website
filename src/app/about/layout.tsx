import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/about",
  description:
    "Meet the team behind Vanatvam and our vision: living landscapes, restored biodiversity, and communities where people reconnect with nature.",
});

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
