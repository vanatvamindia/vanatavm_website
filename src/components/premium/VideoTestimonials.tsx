'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';
import LiteYouTube from '@/components/ui/LiteYouTube';

type VideoTestimonialsProps = {
  /** YouTube video IDs, shown in this order. */
  videoIds: string[];
};

const CARD_WIDTH = 360;
const GAP = 30;
const STEP = CARD_WIDTH + GAP;
/** Auto-scroll speed in px per second (matches the old 60s-per-loop marquee). */
const SPEED = 32;
/** After the visitor scrolls, drags or uses the arrows, wait this long before auto-scrolling again. */
const RESUME_AFTER_MS = 3500;

/**
 * "Voices of VanaTvam" video row.
 *
 * - Scrolls slowly on its own, as real scrolling, so it can also be moved by hand: swipe on
 *   phones, trackpad/shift+wheel or click-and-drag on desktop, and the ‹ › buttons.
 * - Stops while a video is playing and resumes when it is paused or finishes.
 * - Also stops while the visitor is interacting with it, while the mouse is over it, when it is
 *   off screen, and entirely for visitors who prefer reduced motion.
 * - The list is rendered twice so the auto-scroll can loop seamlessly.
 */
export default function VideoTestimonials({ videoIds }: VideoTestimonialsProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0); // precise scroll position (scrollLeft is rounded by some browsers)
  const pauseUntilRef = useRef(0);
  const hoverRef = useRef(false);
  const playingRef = useRef(new Set<string>());
  const [anyPlaying, setAnyPlaying] = useState(false);
  const [inView, setInView] = useState(false);
  const dragRef = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const suppressClickRef = useRef(false);

  const loopWidth = videoIds.length * STEP;
  const holdAutoScroll = (ms = RESUME_AFTER_MS) => {
    pauseUntilRef.current = performance.now() + ms;
  };

  const handlePlayingChange = useCallback((key: string, playing: boolean) => {
    if (playing) playingRef.current.add(key);
    else playingRef.current.delete(key);
    setAnyPlaying(playingRef.current.size > 0);
    if (!playing) holdAutoScroll(2000);
  }, []);

  // Only animate while on screen.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: '100px 0px',
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-scroll loop.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || anyPlaying || !inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    posRef.current = el.scrollLeft;
    let last = performance.now();
    let raf = requestAnimationFrame(function tick(now) {
      const dt = Math.min(now - last, 100) / 1000;
      last = now;
      const idle = now > pauseUntilRef.current && !hoverRef.current && !dragRef.current;
      if (idle) {
        // Pick up any manual scrolling that happened while paused.
        if (Math.abs(el.scrollLeft - posRef.current) > 2) posRef.current = el.scrollLeft;
        posRef.current += SPEED * dt;
        // The second copy is identical, so jumping back by one loop is invisible.
        if (posRef.current >= loopWidth) posRef.current -= loopWidth;
        el.scrollLeft = posRef.current;
      }
      raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [anyPlaying, inView, loopWidth]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    holdAutoScroll();
    // Keep room to move in both directions by jumping to the matching card in the other copy.
    if (!anyPlaying) {
      if (dir === -1 && el.scrollLeft < STEP) el.scrollLeft += loopWidth;
      else if (dir === 1 && el.scrollLeft > loopWidth) el.scrollLeft -= loopWidth;
    }
    // Snap to card boundaries so each press shows the next whole video.
    const target = (Math.round(el.scrollLeft / STEP) + dir) * STEP;
    el.scrollTo({ left: target, behavior: 'smooth' });
    posRef.current = target;
  };

  // Click-and-drag scrolling for mouse users (touch devices scroll natively).
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    holdAutoScroll();
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    dragRef.current = { x: e.clientX, left: scrollerRef.current?.scrollLeft ?? 0, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const el = scrollerRef.current;
    if (!drag || !el) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) < 6) return;
    if (!drag.moved) el.setPointerCapture(e.pointerId);
    drag.moved = true;
    el.scrollLeft = drag.left - dx;
  };
  const endDrag = () => {
    if (dragRef.current?.moved) suppressClickRef.current = true; // a drag is not a click on a video
    dragRef.current = null;
    holdAutoScroll();
  };

  const arrowStyle: React.CSSProperties = {
    width: 48,
    height: 48,
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.35)',
    background: 'rgba(255,255,255,0.06)',
    color: '#fff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Client video testimonials"
      style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
    >
      <div
        ref={scrollerRef}
        className="video-testimonials-scroller"
        // Let the browser handle sideways trackpad/wheel scrolling here (Lenis would intercept it).
        data-lenis-prevent
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') hoverRef.current = true;
        }}
        onPointerLeave={() => {
          hoverRef.current = false;
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={() => holdAutoScroll()}
        onTouchStart={() => holdAutoScroll()}
        onClickCapture={(e) => {
          if (suppressClickRef.current) {
            suppressClickRef.current = false;
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        style={{ display: 'flex', gap: GAP, padding: '20px 0', overflowX: 'auto', overflowY: 'hidden' }}
      >
        {[0, 1].map((copy) =>
          videoIds.map((id) => {
            const key = `${copy}-${id}`;
            return (
              <div
                key={key}
                style={{
                  width: CARD_WIDTH,
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
            );
          })
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 8 }}>
        <button type="button" aria-label="Previous video" onClick={() => scrollByCard(-1)} style={arrowStyle}>
          <ChevronLeft size={22} />
        </button>
        <button type="button" aria-label="Next video" onClick={() => scrollByCard(1)} style={arrowStyle}>
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
}
