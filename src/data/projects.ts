/**
 * Single source of truth for the four communities. Used for page metadata and
 * schema.org Place markup (src/lib/schema.ts).
 *
 * TODO(coordinates): fill `coordinates` for each project from its `mapUrl` (open the link,
 * copy the @lat,lng from the expanded URL). `geo` is only emitted in the schema once set,
 * so nothing is guessed in the meantime.
 */
export interface Project {
  slug: string;
  name: string;
  alternateName?: string;
  path: string;
  locality: string;
  postalCode?: string;
  acres: number;
  description: string;
  image: string;
  /** Amenities named on the project's own page. Do not list anything not shown there. */
  amenities: string[];
  /** Google Maps link supplied by VanaTvam. */
  mapUrl: string;
  coordinates?: { lat: number; lng: number };
}

export const projects: Project[] = [
  {
    slug: "ishavana",
    name: "Ishavana",
    alternateName: "Eeshavana",
    path: "/ishavana",
    locality: "Shivanasamudra",
    postalCode: "571440",
    acres: 10,
    description:
      "Ishavana (aka Eeshavana): a nature-first Kaveri riverfront community near Shivanasamudra Falls, with homes designed around the land.",
    image: "/assets/project-images/Esahavana/EV.webp",
    amenities: ["Walk by the River", "Bio Pool", "Amphitheatre", "Outdoor Mandir"],
    mapUrl: "https://maps.app.goo.gl/kzezBNr2kTU51kaJ7",
  },
  {
    slug: "anantavana",
    name: "Anantavana",
    path: "/anantavana",
    locality: "Katwalu, Begurjungle (near Kabini)",
    postalCode: "571116",
    acres: 34,
    description:
      "Anantavana is a sustainable reforestation community on the River Kabini for nature lovers, developed by VanaTvam with Indus Herbs.",
    image: "/assets/project-images/Ananthavana/hero-image-2.webp",
    amenities: [
      "Entrance Gateway",
      "Herbal & Healing Flora",
      "Community Cottage",
      "Natural Ponds",
      "Tree House Deck",
      "Broad Internal Roads",
    ],
    mapUrl: "https://maps.app.goo.gl/9omsgb2nxVaWXma5A",
  },
  {
    slug: "madhuvana",
    name: "Madhuvana",
    path: "/madhuvana",
    locality: "V. Ballekere (near Maddur)",
    postalCode: "571419",
    acres: 17,
    description:
      "Madhuvana: 17 acres of quarter-acre farm plots off the Bangalore–Mysore highway, near Maddur and Mandya, surrounded by the River Kaveri and its canals.",
    image: "/assets/project-images/Maduvana/hero.webp",
    amenities: [
      "Entrance",
      "Children's Pool",
      "Vinayaka Vana",
      "Gazebo",
      "Tree House Deck",
      "Cottage",
      "Pond",
    ],
    mapUrl: "https://maps.app.goo.gl/qJFB12wyXhihFgVF9",
  },
  {
    slug: "brindavana",
    name: "Brindavana",
    path: "/brindavana",
    locality: "Krishnapura, Pavagada",
    postalCode: "561202",
    acres: 30,
    description:
      "A reforestation community at Krishnapura, Pavagada, turning dry, thorny land into green shade. Explore Brindavana's plots, plans and brochure.",
    image: "/assets/project-images/Brindavana/sunny-tropical-banana-orchard.webp",
    amenities: [],
    mapUrl: "https://maps.app.goo.gl/vFp5jtEZe3aoReVs5",
  },
];

export const getProject = (slug: string): Project => {
  const p = projects.find((x) => x.slug === slug);
  if (!p) throw new Error(`Unknown project: ${slug}`);
  return p;
};
