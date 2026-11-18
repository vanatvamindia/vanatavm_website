'use client';

import { useEffect, useState } from 'react';

const RELOAD_KEY = 'vt-error-auto-reload';
const RELOAD_WINDOW_MS = 30_000;

/**
 * Reloads the page once to recover from a client-side error. Returns false (no reload) if this
 * URL was already auto-reloaded in the last 30 seconds, so a persistent error can't loop.
 *
 * Why: every deploy on Zoho Catalyst deletes the previous build's JavaScript files. A tab opened
 * before a deploy then fails on its next in-site navigation (including the Back button), because
 * the files it asks for no longer exist. A full reload fetches the new build and the page works.
 */
function reloadOnce(): boolean {
  try {
    const last = JSON.parse(sessionStorage.getItem(RELOAD_KEY) || 'null') as { url: string; t: number } | null;
    if (last && last.url === window.location.href && Date.now() - last.t < RELOAD_WINDOW_MS) return false;
    sessionStorage.setItem(RELOAD_KEY, JSON.stringify({ url: window.location.href, t: Date.now() }));
  } catch {
    // Storage unavailable: reloading once is still the best recovery.
  }
  window.location.reload();
  return true;
}

/** Short, safe description of an error for display (no stack trace). */
function describeError(error: unknown): string {
  const e = error as { name?: string; message?: string; digest?: string } | null;
  const parts = [e?.name, e?.message?.slice(0, 160), e?.digest && `ref ${e.digest}`].filter(Boolean);
  return parts.length ? `Error: ${parts.join(' – ')}` : 'Error: unknown';
}

/**
 * Shared UI for app/error.tsx and app/global-error.tsx. Styled inline because global-error renders
 * without the site's stylesheet.
 */
export default function ErrorRecovery({ error }: { error: unknown }) {
  const [mode, setMode] = useState<'recovering' | 'failed'>('recovering');

  useEffect(() => {
    console.error(error);
    if (reloadOnce()) return;
    const frame = requestAnimationFrame(() => setMode('failed'));
    return () => cancelAnimationFrame(frame);
  }, [error]);

  const button: React.CSSProperties = {
    padding: '12px 26px',
    borderRadius: 999,
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: '1px solid rgba(198,162,101,0.7)',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: '#122217',
        color: '#F9F8F6',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
        textAlign: 'center',
      }}
    >
      {mode === 'failed' && (
        <div style={{ maxWidth: 440 }}>
          <h1 style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: '1.9rem', margin: '0 0 12px', fontWeight: 600 }}>
            This page couldn&apos;t load
          </h1>
          <p style={{ margin: '0 0 28px', color: 'rgba(249,248,246,0.75)', lineHeight: 1.6 }}>
            Please reload the page or go back. If it keeps happening, check your connection and try again in a moment.
          </p>
          {/* Technical detail, small, so a screenshot is enough to diagnose browser-specific errors. */}
          <p style={{ margin: '-14px 0 24px', fontSize: '0.72rem', color: 'rgba(249,248,246,0.45)', wordBreak: 'break-word' }}>
            {describeError(error)}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => window.location.reload()} style={{ ...button, background: '#C6A265', color: '#122217' }}>
              Reload
            </button>
            <button type="button" onClick={() => window.history.back()} style={{ ...button, background: 'transparent', color: '#F9F8F6' }}>
              Go back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
