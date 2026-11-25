import type { ReactNode } from "react";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbs } from "@/lib/schema";

export const metadata = pageMetadata({
  path: "/about",
  description:
    "Meet the team behind VanaTvam and our vision: living landscapes, restored biodiversity, and communities where people reconnect with nature.",
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "About", path: "/about" }])} />
      {children}
    </>
  );
}
