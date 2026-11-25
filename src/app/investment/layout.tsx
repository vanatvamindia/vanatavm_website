import type { ReactNode } from "react";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbs } from "@/lib/schema";

export const metadata = pageMetadata({
  path: "/investment",
  description:
    "Curated, nature-first investment opportunities with VanaTvam. Diversify your portfolio with managed farmland in Karnataka.",
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Investment", path: "/investment" }])} />
      {children}
    </>
  );
}
