import type { ReactNode } from "react";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbs } from "@/lib/schema";

export const metadata = pageMetadata({
  path: "/book-a-visit",
  description:
    "Schedule a private guided tour of VanaTvam's sustainable managed farmlands in Karnataka. Pick your community and our team will arrange the date.",
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Book a Site Visit", path: "/book-a-visit" }])} />
      {children}
    </>
  );
}
