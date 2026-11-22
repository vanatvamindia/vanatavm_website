import React from 'react';
import { getBlogs } from '@/data/blogs';
import BlogClient from './components/BlogClient';
import { pageMetadata } from '@/lib/seo';

export const metadata = {
  title: 'Blog',
  ...pageMetadata({
    path: '/blog',
    description:
      'Insights, updates, and deep dives into ecological restoration, Vedic forest science, natural farm communities, and sustainable wealth creation.',
  }),
};

export const revalidate = 60; // Revalidate every minute

export default async function BlogPage() {
  const blogs = await getBlogs();

  return <BlogClient initialBlogs={blogs} />;
}
