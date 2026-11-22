import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/contact",
  description:
    "Meet our team in person, explore project details and plan a guided site visit. Vanatvam's Bengaluru office address, phone and enquiry form.",
});

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
