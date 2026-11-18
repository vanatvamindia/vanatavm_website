'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';

interface LiteYouTubeProps {
  videoId: string;
  title?: string;
  aspectRatio?: string;
  /**
   * Called with `true` when the video starts or resumes and `false` when it is paused or ends.
   * Lets a parent (e.g. an auto-scrolling row) stop moving while someone is watching.
   */
  onPlayingChange?: (playing: boolean) => void;
}

const YT_ORIGIN = 'https://www.youtube-nocookie.com';

/**
 * Lightweight YouTube embed: shows the thumbnail and only loads the real player when clicked.
 * Play state is read from the player's own postMessage events (enablejsapi=1), so YouTube's
 * large iframe API script is never downloaded.
 */
export default function LiteYouTube({
  videoId,
  title = 'Watch Vanatvam Video',
  aspectRatio = '16/9',
  onPlayingChange,
}: LiteYouTubeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const onChangeRef = useRef(onPlayingChange);
  useEffect(() => {
    onChangeRef.current = onPlayingChange;
  }, [onPlayingChange]);

  useEffect(() => {
    if (!isPlaying) return;
    // The player starts automatically after the click (autoplay=1).
    onChangeRef.current?.(true);

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== YT_ORIGIN || event.source !== iframeRef.current?.contentWindow) return;
      let data: unknown = event.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }
      const state = (data as { info?: { playerState?: number } } | null)?.info?.playerState;
      // YouTube player states: 1 playing, 3 buffering, 2 paused, 0 ended.
      if (state === 1 || state === 3) onChangeRef.current?.(true);
      else if (state === 2 || state === 0) onChangeRef.current?.(false);
    };
    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
      onChangeRef.current?.(false);
    };
  }, [isPlaying]);

  /** Ask the player to send state-change events to this page. */
  const subscribeToPlayer = () => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'listening', id: videoId, channel: 'widget' }),
      YT_ORIGIN
    );
  };

  if (isPlaying) {
    const origin = typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : '';
    return (
      <div style={{ position: 'relative', width: '100%', aspectRatio, background: '#000', borderRadius: 'inherit' }}>
        <iframe
          ref={iframeRef}
          onLoad={subscribeToPlayer}
          width="100%"
          height="100%"
          src={`${YT_ORIGIN}/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&enablejsapi=1&origin=${origin}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ border: 0, width: '100%', height: '100%', borderRadius: 'inherit' }}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsPlaying(true)}
      aria-label={`Play video: ${title}`}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio,
        background: '#0D1A13',
        border: 'none',
        padding: 0,
        margin: 0,
        cursor: 'pointer',
        display: 'block',
        overflow: 'hidden',
        borderRadius: 'inherit',
      }}
    >
      <img
        src={`https://i.ytimg.com/vi_webp/${videoId}/hqdefault.webp`}
        alt={title}
        loading="lazy"
        decoding="async"
        width="480"
        height="360"
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 0.4s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.04)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      />
      {/* Dark gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)',
          pointerEvents: 'none',
        }}
      />
      {/* Center Gold Play Button */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: 'rgba(198, 162, 101, 0.9)',
          color: '#122217',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          transition: 'transform 0.25s ease, background 0.25s ease',
          pointerEvents: 'none',
        }}
      >
        <Play size={22} fill="#122217" style={{ marginLeft: '3px' }} />
      </div>
    </button>
  );
}
