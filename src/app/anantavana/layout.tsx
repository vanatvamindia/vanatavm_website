import type { ReactNode } from "react";
import JsonLd from "@/components/JsonLd";
import { getProject } from "@/data/projects";
import { anantavanaFaqs } from "@/data/faqs";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbs, faqPage, projectPlace } from "@/lib/schema";

const project = getProject("anantavana");

export const metadata = pageMetadata({
  path: project.path,
  description: project.description,
  image: project.image,
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd
        data={[
          projectPlace(project),
          breadcrumbs([
            { name: "Projects", path: "/projects" },
            { name: project.name, path: project.path },
          ]),
          faqPage(anantavanaFaqs),
        ]}
      />
      {children}
    </>
  );
}
