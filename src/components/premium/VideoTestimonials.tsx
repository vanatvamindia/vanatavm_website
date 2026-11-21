'use client';

import React, { useCallback, useRef, useState } from 'react';
import { PlayCircle } from 'lucide-react';
import LiteYouTube from '@/components/ui/LiteYouTube';
import AutoScrollRow from '@/components/premium/AutoScrollRow';

type VideoTestimonialsProps = {
  /** YouTube video IDs, shown in this order. */
  videoIds: string[];
};

/**
 * "Voices of VanaTvam" video row, built on AutoScrollRow (auto-scroll, swipe/drag, ‹ › buttons,
 * ← / → keys, pause off screen).
 *
 * - Stops scrolling while a video is playing and resumes when it is paused or finishes.
 * - Scrolling away from the row stops any playing video, so it doesn't keep playing unseen and
 *   the row moves again when the visitor comes back.
 */
export default function VideoTestimonials({ videoIds }: VideoTestimonialsProps) {
  const playingRef = useRef(new Set<string>());
  const [anyPlaying, setAnyPlaying] = useState(false);
  /** Bumped to reset every video to its thumbnail (stops playback). */
  const [resetCount, setResetCount] = useState(0);

  const handlePlayingChange = useCallback((key: string, playing: boolean) => {
    if (playing) playingRef.current.add(key);
    else playingRef.current.delete(key);
    setAnyPlaying(playingRef.current.size > 0);
  }, []);

  const stopAllVideos = useCallback(() => {
    if (playingRef.current.size === 0) return;
    playingRef.current.clear();
    setAnyPlaying(false);
    setResetCount((n) => n + 1);
  }, []);

  return (
    <AutoScrollRow
      items={videoIds}
      getKey={(id) => id}
      itemWidth={360}
      gap={30}
      speed={32}
      label="Client video testimonials"
      itemNoun="video"
      paused={anyPlaying}
      onLeaveView={stopAllVideos}
      renderItem={(id, _copy, key) => (
        <div
          style={{
            width: 360,
            flexShrink: 0,
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            background: '#0A1510',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ aspectRatio: '16/9' }}>
            <LiteYouTube
              key={resetCount}
              videoId={id}
              title="Client Review"
              onPlayingChange={(playing) => handlePlayingChange(key, playing)}
            />
          </div>
          <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <PlayCircle size={16} style={{ color: 'var(--accent-gold)' }} />
            <span
              style={{
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Client Video Testimonial
            </span>
          </div>
        </div>
      )}
    />
  );
}
