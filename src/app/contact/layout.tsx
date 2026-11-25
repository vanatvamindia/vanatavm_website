import type { ReactNode } from "react";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbs, contactPage } from "@/lib/schema";

export const metadata = pageMetadata({
  path: "/contact",
  description:
    "Meet our team in person, explore project details and plan a guided site visit. VanaTvam's Bangalore office address, phone and enquiry form.",
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={[contactPage(), breadcrumbs([{ name: "Contact", path: "/contact" }])]} />
      {children}
    </>
  );
}
