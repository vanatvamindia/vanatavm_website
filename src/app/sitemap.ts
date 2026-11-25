import { MetadataRoute } from 'next';
import { getBlogs } from '@/data/blogs';
import { SITE_URL } from '@/lib/seo';
import { toIsoDate } from '@/lib/schema';

export const dynamic = 'force-static';

const staticRoutes: { path: string; priority: number }[] = [
  { path: '', priority: 1 },
  { path: '/about', priority: 0.8 },
  { path: '/projects', priority: 0.9 },
  { path: '/ishavana', priority: 0.9 },
  { path: '/anantavana', priority: 0.9 },
  { path: '/madhuvana', priority: 0.9 },
  { path: '/brindavana', priority: 0.9 },
  { path: '/investment', priority: 0.8 },
  { path: '/blog', priority: 0.7 },
  { path: '/contact', priority: 0.6 },
  { path: '/book-a-visit', priority: 0.6 },
  { path: '/privacy-policy', priority: 0.2 },
  { path: '/terms', priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Blog URLs come from the same source the blog pages are built from, so the
  // sitemap can never list a post that returns 404.
  const blogs = await getBlogs();

  const pages: MetadataRoute.Sitemap = staticRoutes.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: 'monthly',
    priority,
  }));

  const posts: MetadataRoute.Sitemap = blogs.map((b) => {
    const iso = toIsoDate(b.updatedAt) ?? toIsoDate(b.date);
    return {
      url: `${SITE_URL}/blog/${b.id}`,
      ...(iso && { lastModified: new Date(iso) }),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    };
  });

  return [...pages, ...posts];
}
