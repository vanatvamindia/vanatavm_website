import React from 'react';

export const metadata = {
  title: 'Admin CMS | Vanatvam',
  description: 'Manage Vanatvam Blogs & Content',
  // Keep the CMS out of search results (overrides the site-wide index/follow default).
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="admin-root"
      style={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        color: '#0F172A',
      }}
    >
      {children}
    </div>
  );
}
