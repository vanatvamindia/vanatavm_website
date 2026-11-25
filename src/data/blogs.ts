import blogsRaw from '@/data/blogsData.json';
import { client } from '@/sanity/client';
import { postsQuery, postBySlugQuery, postSlugsQuery } from '@/sanity/queries';
import type { SanityImageSource } from '@/sanity/image';
import { portableTextToContentBlocks, PortableTextBlock } from '@/lib/portableTextUtils';

export interface ContentBlock {
  _key?: string;
  type: 'p' | 'h3' | 'h4' | 'quote' | 'img' | 'ul' | 'ol' | 'hr';
  text?: string;
  src?: string;
  alt?: string;
  assetId?: string;
}

export interface BlogPostItem {
  id: string;
  title: string;
  date: string;
  author: string;
  /** ISO timestamp from Sanity (_updatedAt); absent for local fallback data. */
  updatedAt?: string;
  img: string;
  coverImage?: SanityImageSource;
  coverImageUrl?: string;
  category: string;
  excerpt: string;
  body?: unknown[];
  contentBlocks: ContentBlock[];
}

export const blogsData: BlogPostItem[] = blogsRaw as BlogPostItem[];

export async function getBlogs(): Promise<BlogPostItem[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const sanityPosts = await client.fetch<BlogPostItem[]>(
      postsQuery,
      {},
      {
        signal: controller.signal,
        next: { revalidate: 60 },
      }
    );
    clearTimeout(timeout);

    if (sanityPosts && sanityPosts.length > 0) {
      return sanityPosts;
    }
  } catch (error) {
    console.warn('Sanity fetch bypassed, using local blogs data:', (error as Error).message);
  }
  return blogsData;
}

export async function getBlogById(id: string): Promise<BlogPostItem | undefined> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const post = await client.fetch<BlogPostItem | null>(
      postBySlugQuery,
      { slug: id },
      {
        signal: controller.signal,
        next: { revalidate: 60 },
      }
    );
    clearTimeout(timeout);

    if (post) {
      if ((!post.contentBlocks || post.contentBlocks.length === 0) && Array.isArray(post.body)) {
        post.contentBlocks = portableTextToContentBlocks(post.body as PortableTextBlock[]);
      }
      if (!post.contentBlocks) {
        post.contentBlocks = [];
      }
      return post;
    }
  } catch (error) {
    console.warn(`Sanity fetch for "${id}" bypassed, using local data:`, (error as Error).message);
  }
  return blogsData.find((b) => b.id === id);
}

export async function getAllBlogIds(): Promise<string[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const slugs = await client.fetch<string[]>(
      postSlugsQuery,
      {},
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (slugs && slugs.length > 0) {
      return slugs;
    }
  } catch (error) {
    console.warn('Sanity slugs fetch bypassed, using local IDs:', (error as Error).message);
  }
  return blogsData.map((b) => b.id);
}
