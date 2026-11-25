/**
 * schema.org JSON-LD builders. Pure functions (no React) so they are easy to test.
 * Render with <JsonLd /> from "@/components/JsonLd".
 *
 * Every node uses a stable @id so other nodes can reference it instead of repeating it.
 */
import { SITE_URL } from "@/lib/seo";
import type { ContentBlock } from "@/data/blogs";
import { projects, type Project } from "@/data/projects";

const CONTEXT = "https://schema.org";

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const FOUNDER_ID = `${SITE_URL}/about#deepak-kasthuri`;

export const LOGO_URL = `${SITE_URL}/assets/images/vanatvamlogo.webp`;

export const SOCIAL_PROFILES = [
  "https://www.instagram.com/vanatvamindia",
  "https://www.facebook.com/vanatvamfarms",
  "https://www.youtube.com/@VanaTvam",
  "https://www.linkedin.com/company/vanatvam-farms",
];

export const absoluteUrl = (pathOrUrl: string): string =>
  /^https?:\/\//i.test(pathOrUrl)
    ? pathOrUrl
    : `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;

/** Sitewide graph: Organization (also a RealEstateAgent), its founder, and the WebSite. */
export function siteGraph() {
  return {
    "@context": CONTEXT,
    "@graph": [
      {
        "@type": ["Organization", "RealEstateAgent"],
        "@id": ORG_ID,
        name: "VanaTvam Private Limited",
        alternateName: "VanaTvam",
        legalName: "VanaTvam Private Limited",
        url: `${SITE_URL}/`,
        logo: { "@type": "ImageObject", url: LOGO_URL },
        image: LOGO_URL,
        description:
          "VanaTvam Private Limited is a Bangalore-based company developing Natural Sustainable Farm Communities across Karnataka.",
        telephone: "+91 80 4709 5111",
        email: "info@vanatvam.com",
        foundingDate: "2022-03",
        founder: { "@id": FOUNDER_ID },
        address: {
          "@type": "PostalAddress",
          streetAddress: "#5, Anjanadri Plaza, 2nd Floor, Girinagar 1st Phase",
          addressLocality: "Bangalore",
          addressRegion: "Karnataka",
          postalCode: "560085",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 12.9410767,
          longitude: 77.5454691,
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "09:30",
          closes: "18:30",
        },
        identifier: "CIN: U01100KA2022PTC159587",
        areaServed: { "@type": "AdministrativeArea", name: "Karnataka" },
        sameAs: SOCIAL_PROFILES,
        knowsAbout: [
          "Managed farmland",
          "Natural and organic farming",
          "Vedic forest science",
          "Native biodiversity restoration",
          "Farm communities near Bangalore",
        ],
        // What the company offers: one service per community. No prices are published, so none are claimed.
        makesOffer: projects.map((p) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: `${p.name} managed farmland plots`,
            serviceType: "Managed farmland community plots",
            url: `${SITE_URL}${p.path}`,
            description: p.description,
            areaServed: { "@type": "Place", name: p.locality },
            provider: { "@id": ORG_ID },
          },
        })),
      },
      {
        "@type": "Person",
        "@id": FOUNDER_ID,
        name: FOUNDER_NAME,
        jobTitle: "Founder & Managing Director",
        url: `${SITE_URL}/about`,
        worksFor: { "@id": ORG_ID },
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: `${SITE_URL}/`,
        name: "VanaTvam",
        inLanguage: "en-IN",
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

export interface Crumb {
  name: string;
  /** Path such as "/projects". Omit for the current page only if you want it unlinked. */
  path: string;
}

/** BreadcrumbList. "Home" is added automatically as the first item. */
export function breadcrumbs(trail: Crumb[]) {
  const items: Crumb[] = [{ name: "Home", path: "/" }, ...trail];
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.path === "/" ? `${SITE_URL}/` : absoluteUrl(c.path),
    })),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

/** FAQPage. Returns null when there is nothing to mark up. */
export function faqPage(items: FaqItem[]) {
  const valid = items.filter((i) => i.question.trim() && i.answer.trim());
  if (valid.length === 0) return null;
  return {
    "@context": CONTEXT,
    "@type": "FAQPage",
    mainEntity: valid.map((i) => ({
      "@type": "Question",
      name: i.question.trim(),
      acceptedAnswer: { "@type": "Answer", text: i.answer.trim() },
    })),
  };
}

const stripHtml = (s: string): string =>
  s
    .replace(/<\/(li|p|div)>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Blog FAQ convention: an h3 "Frequently Asked Questions", then repeated
 * h4 (question) + p/ul/ol (answer) blocks, until the next h3.
 */
export function extractBlogFaqs(blocks: ContentBlock[]): FaqItem[] {
  const start = blocks.findIndex(
    (b) => b.type === "h3" && /frequently asked questions/i.test(b.text ?? ""),
  );
  if (start === -1) return [];

  const out: FaqItem[] = [];
  let current: { question: string; parts: string[] } | null = null;
  const flush = () => {
    if (current) out.push({ question: current.question, answer: current.parts.join(" ").trim() });
    current = null;
  };

  for (const b of blocks.slice(start + 1)) {
    if (b.type === "h3") break;
    if (b.type === "h4") {
      flush();
      const q = stripHtml(b.text ?? "");
      if (q) current = { question: q, parts: [] };
    } else if (current && (b.type === "p" || b.type === "ul" || b.type === "ol")) {
      const t = stripHtml(b.text ?? "");
      if (t) current.parts.push(t);
    }
  }
  flush();
  return out.filter((f) => f.answer);
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** Accepts ISO dates or the display format used in the blog data ("OCT 25, 2026"). */
export function toIsoDate(input?: string | null): string | undefined {
  if (!input) return undefined;
  const iso = input.match(/^(\d{4}-\d{2}-\d{2})/);
  if (iso) return iso[1];
  const m = input.match(/([A-Za-z]{3})[A-Za-z]*\.?\s+(\d{1,2}),?\s+(\d{4})/);
  if (!m) return undefined;
  const month = MONTHS.indexOf(m[1].toLowerCase());
  if (month === -1) return undefined;
  return new Date(Date.UTC(Number(m[3]), month, Number(m[2]))).toISOString().slice(0, 10);
}

export interface BlogSchemaInput {
  id: string;
  title: string;
  excerpt: string;
  category?: string;
  date?: string;
  updatedAt?: string;
  author?: string;
  imageUrl: string;
  wordCount?: number;
}

export const FOUNDER_NAME = "Deepak Kasthuri";

/** Sanity authors like "VanaTvam" / "VanaTvam Team" name the company, not a person. */
const isOrgAuthor = (name: string) => /vanatvam|team|editorial|admin/i.test(name);

/** Display name for a post's author: a real person's name, otherwise the founder. */
export function postAuthorName(raw?: string | null): string {
  const name = raw?.trim();
  return name && !isOrgAuthor(name) ? name : FOUNDER_NAME;
}

export function blogPosting(post: BlogSchemaInput) {
  const url = `${SITE_URL}/blog/${post.id}`;
  const published = toIsoDate(post.date);
  const modified = toIsoDate(post.updatedAt) ?? published;
  const name = postAuthorName(post.author);
  const author = name === FOUNDER_NAME ? { "@id": FOUNDER_ID } : { "@type": "Person", name };

  return {
    "@context": CONTEXT,
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: post.title,
    description: post.excerpt,
    image: [absoluteUrl(post.imageUrl)],
    ...(published && { datePublished: published }),
    ...(modified && { dateModified: modified }),
    author,
    publisher: { "@id": ORG_ID },
    ...(post.category && { articleSection: post.category }),
    ...(post.wordCount && { wordCount: post.wordCount }),
    inLanguage: "en-IN",
  };
}

/** Place node for a project. `geo` is only emitted once real coordinates are filled in. */
export function projectPlace(p: Project) {
  const url = `${SITE_URL}${p.path}`;
  return {
    "@context": CONTEXT,
    "@type": "Place",
    "@id": `${url}#place`,
    name: p.name,
    ...(p.alternateName && { alternateName: p.alternateName }),
    description: p.description,
    url,
    image: absoluteUrl(p.image),
    address: {
      "@type": "PostalAddress",
      addressLocality: p.locality,
      addressRegion: "Karnataka",
      ...(p.postalCode && { postalCode: p.postalCode }),
      addressCountry: "IN",
    },
    ...(p.coordinates && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: p.coordinates.lat,
        longitude: p.coordinates.lng,
      },
    }),
    ...(p.mapUrl && { hasMap: p.mapUrl }),
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Project area",
        value: p.acres,
        unitCode: "ACR",
        unitText: "acres",
      },
    ],
    ...(p.amenities.length > 0 && {
      amenityFeature: p.amenities.map((name) => ({
        "@type": "LocationFeatureSpecification",
        name,
        value: true,
      })),
    }),
  };
}

/** ItemList of every project, for the /projects index. */
export function projectList(projects: Project[]) {
  return {
    "@context": CONTEXT,
    "@type": "ItemList",
    name: "VanaTvam natural farm communities",
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}${p.path}`,
      name: p.name,
    })),
  };
}
