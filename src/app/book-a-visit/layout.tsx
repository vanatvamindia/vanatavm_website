import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/book-a-visit",
  description:
    "Schedule a private guided tour of Vanatvam's sustainable managed farmlands in Karnataka. Pick your community and our team will arrange the date.",
});

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
