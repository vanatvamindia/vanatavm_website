import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAuthenticated } from '@/lib/adminAuth';
import { writeClient, client } from '@/sanity/client';
import { contentBlocksToPortableText } from '@/lib/portableTextUtils';
import type { ContentBlock } from '@/data/blogs';

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const posts = await client.fetch(`*[_type == "post"] | order(_createdAt desc) {
      _id,
      title,
      "id": slug.current,
      category,
      date,
      author,
      img,
      coverImage,
      "coverImageUrl": coalesce(coverImage.asset->url, coverImage.url, null),
      excerpt,
      contentBlocks,
      body,
      _updatedAt
    }`);
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const {
      _id,
      title,
      id: rawSlug,
      category,
      date,
      author,
      excerpt,
      img,
      assetId,
      contentBlocks,
    } = data;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const slugCurrent = (rawSlug || title)
      .toLowerCase()
      .replace(/<[^>]*>/g, '')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    const docId = _id || `post-${slugCurrent}`;

    const rawBlocks = (contentBlocks as ContentBlock[]) || [];
    const formattedBlocks = rawBlocks.map((b, idx) => ({
      _key: b._key || `cb_${Date.now()}_${idx}`,
      _type: 'contentBlock',
      type: b.type || 'p',
      text: b.text || '',
      src: b.src || '',
      alt: b.alt || '',
      assetId: b.assetId || '',
    }));

    // Build genuine Sanity Portable Text blocks (preserving strong, em, underline, strike, links, lists)
    const bodyBlocks = contentBlocksToPortableText(rawBlocks);

    const doc: {
      _id: string;
      _type: string;
      title: string;
      slug: { _type: string; current: string };
      category: string;
      date: string;
      author: string;
      excerpt: string;
      img: string;
      contentBlocks: typeof formattedBlocks;
      body: typeof bodyBlocks;
      coverImage?: { _type: string; asset: { _type: string; _ref: string } };
    } = {
      _id: docId,
      _type: 'post',
      title,
      slug: {
        _type: 'slug',
        current: slugCurrent,
      },
      category: category || 'Philosophy',
      date:
        date ||
        new Date()
          .toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
          .toUpperCase(),
      author: author || 'VanaTvam Team',
      excerpt: excerpt || '',
      img: (img || '')
        .replace(/\/Blogs-content\/May(%20| )2022\//g, '/Blogs-content/May-2022/')
        .replace(/\/Blogs-content\/June(%20| )2022\//g, '/Blogs-content/June-2022/')
        .replace(/\/Event(%20| )images\//g, '/event-images/'),
      contentBlocks: formattedBlocks,
      body: bodyBlocks,
    };

    if (assetId) {
      doc.coverImage = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: assetId,
        },
      };
    }

    const saved = await writeClient.createOrReplace(doc);

    // Revalidate frontend & admin paths immediately
    revalidatePath('/blog');
    revalidatePath(`/blog/${slugCurrent}`);
    revalidatePath('/admin');

    return NextResponse.json({ success: true, post: saved });
  } catch (error) {
    console.error('Save blog error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
