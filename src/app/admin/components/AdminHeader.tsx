'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ExternalLink, LogOut, Plus, LayoutGrid } from 'lucide-react';

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const isDashboard = pathname === '/admin';
  const isNew = pathname === '/admin/posts/new';

  return (
    <header
      style={{
        borderBottom: '1px solid #E2E8F0',
        background: '#FFFFFF',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <Link
            href="/admin"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#0F172A' }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#15803D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '1rem',
              }}
            >
              V
            </div>
            <div>
              <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
                VanaTvam CMS
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                Editorial Dashboard
              </div>
            </div>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Link
              href="/admin"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: 600,
                textDecoration: 'none',
                background: isDashboard ? '#F1F5F9' : 'transparent',
                color: isDashboard ? '#0F172A' : '#475569',
              }}
            >
              <LayoutGrid size={15} />
              All Posts
            </Link>
            <Link
              href="/admin/posts/new"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: 600,
                textDecoration: 'none',
                background: isNew ? '#DCFCE7' : 'transparent',
                color: isNew ? '#15803D' : '#475569',
              }}
            >
              <Plus size={15} />
              Write Article
            </Link>
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link
            href="/blog"
            target="_blank"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#334155',
              textDecoration: 'none',
              fontSize: '0.82rem',
              fontWeight: 600,
            }}
          >
            <ExternalLink size={14} />
            Live Blog
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid #FECACA',
              background: '#FEF2F2',
              color: '#DC2626',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 600,
            }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
