import type { ReactNode } from "react";
import JsonLd from "@/components/JsonLd";
import { projects } from "@/data/projects";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbs, projectList } from "@/lib/schema";

export const metadata = pageMetadata({
  path: "/projects",
  title: "Our Farmland Projects",
  description:
    "Explore VanaTvam's nature communities in the Bangalore–Mysore–Chamarajanagar corridor, where nature, heritage and culture come together.",
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd
        data={[breadcrumbs([{ name: "Projects", path: "/projects" }]), projectList(projects)]}
      />
      {children}
    </>
  );
}
