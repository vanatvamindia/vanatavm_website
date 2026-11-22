'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { JSONContent } from '@tiptap/react';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Upload,
  Eye,
  Edit3,
  ExternalLink,
  Trash2,
  Loader2,
  RefreshCw,
  Clock,
  BookOpen,
} from 'lucide-react';
import AdminHeader from './AdminHeader';
import TiptapArticleEditor from './TiptapArticleEditor';
import { resolvePostImage, normalizeBlogImagePath, SanityImageSource } from '@/sanity/image';
import { contentBlocksToHtml, tiptapJsonToContentBlocks } from '@/lib/tiptapUtils';
import type { ContentBlock } from '@/data/blogs';

export interface EditorPostData {
  _id?: string;
  id: string;
  title: string;
  category: string;
  date: string;
  author: string;
  img?: string;
  coverImage?: SanityImageSource | null;
  excerpt: string;
  contentBlocks?: ContentBlock[];
}

interface PostEditorProps {
  mode: 'create' | 'edit';
  initialPost?: EditorPostData;
}

const PRESET_CATEGORIES = [
  'Philosophy',
  'Living',
  'Investment',
  'Community',
  'Sustainability',
  'Wellness',
  'Guide',
  'Nature',
  'Lifestyle',
  'Family',
  'Heritage',
  'Education',
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function getTodayFormatted(): string {
  return new Date()
    .toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    .toUpperCase();
}

export default function PostEditor({ mode, initialPost }: PostEditorProps) {
  const router = useRouter();

  // Document fields
  const [title, setTitle] = useState(initialPost?.title || '');
  const [slug, setSlug] = useState(initialPost?.id || '');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === 'edit');
  const [category, setCategory] = useState(initialPost?.category || 'Philosophy');
  const [customCategoryMode, setCustomCategoryMode] = useState(
    Boolean(initialPost?.category && !PRESET_CATEGORIES.includes(initialPost.category))
  );
  const [date, setDate] = useState(initialPost?.date || getTodayFormatted());
  const [author, setAuthor] = useState(initialPost?.author || 'VanaTvam Team');
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '');

  const initialHeroImg = initialPost ? resolvePostImage(initialPost) : '';
  const [img, setImg] = useState(initialHeroImg);
  const [assetId, setAssetId] = useState<string | null>(
    (initialPost?.coverImage as { asset?: { _ref?: string } } | null)?.asset?._ref || null
  );

  // Content state (synced from Tiptap JSON)
  const initialBlocks = useMemo(() => {
    const raw = initialPost?.contentBlocks || [];
    return raw.map((b) => (b.type === 'img' && b.src ? { ...b, src: normalizeBlogImagePath(b.src) } : b));
  }, [initialPost]);
  const initialHtml = useMemo(() => contentBlocksToHtml(initialBlocks), [initialBlocks]);
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks);
  const [wordCount, setWordCount] = useState<number>(() => {
    const plain = initialBlocks
      .map((b) => (b.text || '').replace(/<[^>]*>/g, ' '))
      .join(' ')
      .trim();
    return plain ? plain.split(/\s+/).filter(Boolean).length : 0;
  });

  // UI state
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4500);
  };

  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugManuallyEdited) {
      setSlug(slugify(val));
    }
  };

  const uploadFileToSanity = async (file: File): Promise<{ url: string; assetId: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Image upload failed');
    return { url: data.url, assetId: data.assetId };
  };

  const handleHeroUpload = async (file: File) => {
    setUploadingHero(true);
    try {
      const { url, assetId: newAssetId } = await uploadFileToSanity(file);
      setImg(url);
      setAssetId(newAssetId);
      showToast('success', 'Cover image uploaded to Sanity CDN');
    } catch (err) {
      showToast('error', (err as Error).message);
    } finally {
      setUploadingHero(false);
    }
  };

  const handleEditorImageUpload = async (file: File): Promise<string> => {
    const { url } = await uploadFileToSanity(file);
    showToast('success', 'Image inserted into article');
    return url;
  };

  const handleEditorChange = (json: JSONContent, words: number) => {
    setBlocks(tiptapJsonToContentBlocks(json));
    setWordCount(words);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('error', 'Article title is required');
      return;
    }

    setSaving(true);
    try {
      const finalSlug = slug.trim() || slugify(title);
      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: initialPost?._id || `post-${finalSlug}`,
          title: title.trim(),
          id: finalSlug,
          category: category.trim() || 'Philosophy',
          date: date.trim() || getTodayFormatted(),
          author: author.trim() || 'VanaTvam Team',
          excerpt: excerpt.trim(),
          img: img.trim(),
          assetId,
          contentBlocks: blocks,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save blog');

      showToast('success', mode === 'create' ? 'Article published to Sanity!' : 'Changes published to Sanity!');

      if (mode === 'create' || finalSlug !== initialPost?.id) {
        router.push(`/admin/posts/${finalSlug}`);
      }
      router.refresh();
    } catch (err) {
      showToast('error', (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initialPost?._id) return;
    if (!confirm(`Delete "${title}" permanently from Sanity?`)) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/blogs/${encodeURIComponent(initialPost._id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Delete failed');
      }
      router.push('/admin');
      router.refresh();
    } catch (err) {
      showToast('error', (err as Error).message);
      setDeleting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', color: '#0F172A' }}>
      <AdminHeader />

      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 18px',
            borderRadius: '10px',
            background: '#FFFFFF',
            border: `1px solid ${toast.type === 'success' ? '#86EFAC' : '#FECACA'}`,
            color: toast.type === 'success' ? '#166534' : '#B91C1C',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
            fontSize: '0.88rem',
            fontWeight: 600,
          }}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 size={18} color="#16A34A" />
          ) : (
            <AlertCircle size={18} color="#DC2626" />
          )}
          {toast.message}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Secondary Action Toolbar */}
        <div
          style={{
            borderBottom: '1px solid #E2E8F0',
            background: '#FFFFFF',
            padding: '10px 24px',
          }}
        >
          <div
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link
                href="/admin"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  color: '#334155',
                  textDecoration: 'none',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                }}
              >
                <ArrowLeft size={15} />
                All Posts
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <BookOpen size={14} />
                  {wordCount} words
                </span>
                <span>·</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} />
                  {readTimeMinutes} min read
                </span>
              </div>
            </div>

            {/* Edit / Preview Toggle */}
            <div
              style={{
                display: 'inline-flex',
                padding: '3px',
                borderRadius: '8px',
                background: '#F1F5F9',
                border: '1px solid #E2E8F0',
              }}
            >
              <button
                type="button"
                onClick={() => setViewMode('edit')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: viewMode === 'edit' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'edit' ? '#0F172A' : '#64748B',
                  boxShadow: viewMode === 'edit' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                <Edit3 size={14} /> Write
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: viewMode === 'preview' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'preview' ? '#0F172A' : '#64748B',
                  boxShadow: viewMode === 'preview' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                <Eye size={14} /> Preview
              </button>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {mode === 'edit' && slug && (
                <Link
                  href={`/blog/${slug}`}
                  target="_blank"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#334155',
                    textDecoration: 'none',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                  }}
                >
                  <ExternalLink size={14} />
                  View Live
                </Link>
              )}

              {mode === 'edit' && initialPost?._id && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    color: '#DC2626',
                    cursor: 'pointer',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                  }}
                >
                  {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  Delete
                </button>
              )}

              <button
                type="submit"
                disabled={saving}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '9px 20px',
                  borderRadius: '8px',
                  background: '#15803D',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                {saving ? 'Publishing...' : mode === 'create' ? 'Publish Article' : 'Save & Publish'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Workspace */}
        <div
          className={viewMode === 'edit' ? 'admin-editor-grid' : undefined}
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            padding: '28px 24px 80px',
          }}
        >
          {viewMode === 'edit' ? (
            <>
              {/* LEFT: LinkedIn-style Document Writer */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Headline & Excerpt Paper */}
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '24px 28px',
                    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Article headline..."
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      fontSize: '1.85rem',
                      fontWeight: 700,
                      color: '#0F172A',
                      background: 'transparent',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.25,
                    }}
                  />
                  <textarea
                    rows={2}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Write a short summary or subtitle (shown on blog listing cards)..."
                    style={{
                      width: '100%',
                      border: 'none',
                      borderTop: '1px solid #F1F5F9',
                      paddingTop: '12px',
                      outline: 'none',
                      fontSize: '0.98rem',
                      color: '#475569',
                      background: 'transparent',
                      resize: 'none',
                      lineHeight: 1.5,
                    }}
                  />
                </div>

                {/* Single Unified Tiptap Article Editor */}
                <TiptapArticleEditor
                  initialHtml={initialHtml}
                  onChange={handleEditorChange}
                  onUploadImage={handleEditorImageUpload}
                />
              </div>

              {/* RIGHT SIDEBAR: Settings & Cover Image */}
              <aside style={{ display: 'flex', flexDirection: 'column', gap: '18px', position: 'sticky', top: '82px' }}>
                {/* Cover Image Panel */}
                <div style={panelStyle}>
                  <h3 style={panelTitleStyle}>Cover Image</h3>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const f = e.dataTransfer.files?.[0];
                      if (f && f.type.startsWith('image/')) handleHeroUpload(f);
                    }}
                    style={{
                      borderRadius: '10px',
                      border: '1px dashed #CBD5E1',
                      background: '#F8FAFC',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    {img ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={img}
                        alt="Cover preview"
                        onError={(e) => {
                          const target = e.currentTarget;
                          const fallback = initialPost?.img
                            ? normalizeBlogImagePath(initialPost.img)
                            : '/assets/project-images/Brindavana/sunny-tropical-banana-orchard.webp';
                          if (!target.src.includes('sunny-tropical-banana-orchard')) {
                            target.src = fallback;
                          }
                        }}
                        style={{
                          width: '100%',
                          aspectRatio: '16 / 10',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #E2E8F0',
                        }}
                      />
                    ) : (
                      <div style={{ padding: '24px 10px', color: '#94A3B8', fontSize: '0.82rem' }}>
                        Drag & drop a cover image here
                      </div>
                    )}

                    <label
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '7px',
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        color: '#0F172A',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                      }}
                    >
                      {uploadingHero ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                      {uploadingHero ? 'Uploading...' : 'Upload Cover Image'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleHeroUpload(f);
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>

                    <input
                      type="text"
                      value={img}
                      onChange={(e) => setImg(e.target.value)}
                      placeholder="Or paste image URL / path"
                      style={{ ...inputStyle, fontSize: '0.8rem', padding: '7px 10px' }}
                    />
                  </div>
                </div>

                {/* Metadata & Publishing Settings */}
                <div style={panelStyle}>
                  <h3 style={panelTitleStyle}>Article Details</h3>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                      <label style={{ ...labelStyle, marginBottom: 0 }}>URL Slug *</label>
                      <button
                        type="button"
                        onClick={() => {
                          setSlug(slugify(title));
                          setSlugManuallyEdited(false);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#15803D',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <RefreshCw size={11} /> Auto-generate
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => {
                        setSlug(e.target.value);
                        setSlugManuallyEdited(true);
                      }}
                      placeholder="my-article-slug"
                      style={inputStyle}
                    />
                    <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '4px', wordBreak: 'break-all' }}>
                      /blog/{slug || '...'}
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                      <label style={{ ...labelStyle, marginBottom: 0 }}>Category</label>
                      <button
                        type="button"
                        onClick={() => setCustomCategoryMode((v) => !v)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#15803D',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {customCategoryMode ? 'Use Preset' : '+ Custom'}
                      </button>
                    </div>
                    {customCategoryMode ? (
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Custom category..."
                        style={inputStyle}
                      />
                    ) : (
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ ...inputStyle, cursor: 'pointer' }}
                      >
                        {PRESET_CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={labelStyle}>Date</label>
                      <input
                        type="text"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        placeholder="NOV 11, 2026"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Author</label>
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="VanaTvam Team"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>
              </aside>
            </>
          ) : (
            /* LIVE SITE PREVIEW MODE */
            <div
              style={{
                background: '#F9F8F6',
                color: '#282C27',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)',
                border: '1px solid #E2E8F0',
                maxWidth: '880px',
                margin: '0 auto',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  padding: '56px 40px 44px',
                  background: '#0D1A10',
                  color: '#FFF',
                }}
              >
                {img && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={img}
                    alt={title}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.38,
                    }}
                  />
                )}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px' }}>
                    <span
                      style={{
                        background: '#C6A265',
                        color: '#122217',
                        padding: '4px 12px',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}
                    >
                      {category}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)' }}>
                      ⏱ {readTimeMinutes} min read
                    </span>
                  </div>
                  <h1
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '2.3rem',
                      lineHeight: 1.2,
                      color: '#FFF',
                      margin: '0 0 12px',
                    }}
                  >
                    {title || 'Untitled Article'}
                  </h1>
                  <div style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)' }}>
                    {author} · {date}
                  </div>
                </div>
              </div>

              <div style={{ padding: '40px' }} className="blog-content">
                {excerpt && (
                  <p style={{ fontSize: '1.14rem', color: '#4B554D', fontStyle: 'italic', marginBottom: '26px' }}>
                    {excerpt}
                  </p>
                )}

                {blocks.map((b, i) => {
                  if (b.type === 'h3') {
                    return (
                      <h3
                        key={b._key || i}
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.65rem',
                          color: '#122217',
                          marginTop: '32px',
                          marginBottom: '14px',
                        }}
                        dangerouslySetInnerHTML={{ __html: b.text || '' }}
                      />
                    );
                  }
                  if (b.type === 'h4') {
                    return (
                      <h4
                        key={b._key || i}
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.25rem',
                          color: '#72351C',
                          marginTop: '24px',
                          marginBottom: '10px',
                        }}
                        dangerouslySetInnerHTML={{ __html: b.text || '' }}
                      />
                    );
                  }
                  if (b.type === 'quote') {
                    return (
                      <blockquote
                        key={b._key || i}
                        style={{
                          borderLeft: '4px solid #C6A265',
                          background: '#F1EEE6',
                          padding: '18px 22px',
                          borderRadius: '0 12px 12px 0',
                          margin: '24px 0',
                          fontFamily: 'var(--font-serif)',
                          fontStyle: 'italic',
                          fontSize: '1.15rem',
                          color: '#122217',
                        }}
                        dangerouslySetInnerHTML={{ __html: b.text || '' }}
                      />
                    );
                  }
                  if (b.type === 'ul') {
                    return (
                      <ul
                        key={b._key || i}
                        style={{ paddingLeft: '24px', marginBottom: '20px', listStyleType: 'disc' }}
                        dangerouslySetInnerHTML={{ __html: b.text || '' }}
                      />
                    );
                  }
                  if (b.type === 'ol') {
                    return (
                      <ol
                        key={b._key || i}
                        style={{ paddingLeft: '24px', marginBottom: '20px', listStyleType: 'decimal' }}
                        dangerouslySetInnerHTML={{ __html: b.text || '' }}
                      />
                    );
                  }
                  if (b.type === 'hr') {
                    return (
                      <hr
                        key={b._key || i}
                        style={{ border: 'none', borderTop: '1px solid rgba(198,162,101,0.4)', margin: '28px auto', width: '60%' }}
                      />
                    );
                  }
                  if (b.type === 'img' && b.src) {
                    return (
                      <div key={b._key || i} style={{ margin: '24px 0', textAlign: 'center' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={b.src}
                          alt={b.alt || ''}
                          style={{ maxWidth: '100%', borderRadius: '12px', maxHeight: '460px', margin: '0 auto' }}
                        />
                      </div>
                    );
                  }
                  return (
                    <p
                      key={b._key || i}
                      style={{ marginBottom: '18px', fontSize: '1.08rem', lineHeight: 1.8 }}
                      dangerouslySetInnerHTML={{ __html: b.text || '' }}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

const panelStyle: React.CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid #E2E8F0',
  borderRadius: '12px',
  padding: '18px',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
};

const panelTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '0.92rem',
  fontWeight: 700,
  color: '#0F172A',
  paddingBottom: '10px',
  borderBottom: '1px solid #F1F5F9',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.78rem',
  fontWeight: 600,
  color: '#475569',
  marginBottom: '5px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 11px',
  borderRadius: '8px',
  background: '#FFFFFF',
  border: '1px solid #CBD5E1',
  color: '#0F172A',
  fontSize: '0.86rem',
  outline: 'none',
};
