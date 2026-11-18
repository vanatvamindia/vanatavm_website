'use client';

import React, { useState } from 'react';
import { Play, X } from 'lucide-react';

interface LiteYouTubeProps {
  videoId: string;
  title?: string;
  aspectRatio?: string;
  isPlaying?: boolean;
  onPlay?: () => void;
  onClose?: () => void;
}

export default function LiteYouTube({
  videoId,
  title = 'Watch Vanatvam Video',
  aspectRatio = '16/9',
  isPlaying: controlledIsPlaying,
  onPlay,
  onClose,
}: LiteYouTubeProps) {
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const isPlaying = controlledIsPlaying !== undefined ? controlledIsPlaying : internalIsPlaying;

  const handleStartPlay = () => {
    if (controlledIsPlaying === undefined) {
      setInternalIsPlaying(true);
    }
    onPlay?.();
  };

  const handleStopPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (controlledIsPlaying === undefined) {
      setInternalIsPlaying(false);
    }
    onClose?.();
  };

  if (isPlaying) {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&enablejsapi=1${origin ? `&origin=${encodeURIComponent(origin)}` : ''}`;

    return (
      <div style={{ position: 'relative', width: '100%', aspectRatio, background: '#000', borderRadius: 'inherit' }}>
        <iframe
          id={`yt-${videoId}`}
          width="100%"
          height="100%"
          src={src}
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
      onClick={handleStartPlay}
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

