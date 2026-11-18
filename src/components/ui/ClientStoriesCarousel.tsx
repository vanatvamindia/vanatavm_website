'use client';

import React, { useRef, useState, useEffect } from 'react';
import { PlayCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import LiteYouTube from './LiteYouTube';

const VIDEO_IDS = [
  'oTd69o1SAkk',
  'rPMv_cggbH8',
  'HIuRfVHefz0',
  '5sDm6-yiMPs',
  '61PcdiIYtgs',
];

export default function ClientStoriesCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Track the specific unique card instance key that is playing
  const [activeCardKey, setActiveCardKey] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSectionInView, setIsSectionInView] = useState(true);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  // 3 duplicate sets allow seamless infinite loop
  const sets = [0, 1, 2];

  // 1. YouTube IFrame postMessage listener:
  // Automatically detects when user pauses or finishes a video inside the YouTube player
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data) return;
      let data: any = null;
      if (typeof e.data === 'string') {
        try {
          data = JSON.parse(e.data);
        } catch {
          return;
        }
      } else if (typeof e.data === 'object') {
        data = e.data;
      }

      if (!data) return;

      // When YouTube player reports initialDelivery or onReady, ping listening handshake
      if (data.event === 'initialDelivery' || data.event === 'onReady') {
        const iframes = document.querySelectorAll<HTMLIFrameElement>('iframe[src*="youtube"]');
        iframes.forEach((iframe) => {
          iframe.contentWindow?.postMessage(
            JSON.stringify({ event: 'listening' }),
            '*'
          );
        });
      }

      // Handle YouTube playback state changes
      if (data.event === 'onStateChange') {
        // info 2 = paused, info 0 = ended
        if (data.info === 2 || data.info === 0) {
          // When paused or ended, release active card so auto-scroll can resume when not hovering
          setActiveCardKey(null);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // 2. IntersectionObserver:
  // Detects when the Client Stories section is in or out of the viewport.
  // When scrolled out of active view, resets any active video so audio stops and auto-scroll resumes when back in view.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting && entry.intersectionRatio > 0.08;
        setIsSectionInView(inView);

        // When out of view, reset playing video and unpause
        if (!entry.isIntersecting) {
          setActiveCardKey(null);
          setIsHovered(false);
          setIsDragging(false);
        }
      },
      { threshold: [0, 0.1, 0.5] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 3. Auto-scroll loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastTime = performance.now();

    const tick = (now: number) => {
      const delta = Math.min(now - lastTime, 34);
      lastTime = now;

      // Auto-scroll resumes when:
      // 1. No video is currently playing (or video was paused)
      // 2. Mouse is not hovering the section
      // 3. Not dragging
      // 4. Section is in the active viewport
      const canScroll = activeCardKey === null && !isHovered && !isDragging && isSectionInView;

      if (canScroll && container) {
        const speed = (0.6 * delta) / 16;
        container.scrollLeft += speed;

        const singleSetWidth = container.scrollWidth / 3;
        if (container.scrollLeft >= singleSetWidth * 2) {
          container.scrollLeft -= singleSetWidth;
        } else if (container.scrollLeft <= 0) {
          container.scrollLeft += singleSetWidth;
        }
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [activeCardKey, isHovered, isDragging, isSectionInView]);

  const handlePlayCard = (key: string) => {
    setActiveCardKey(key);
  };

  const scrollLeftBy = (amount: number) => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  // Drag handlers for desktop mouse swipe
  const onMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeftStart(containerRef.current.scrollLeft);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.3;
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
    containerRef.current.scrollLeft = scrollLeftStart - walk;
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
    setIsHovered(false);
  };

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        overflow: 'hidden',
        padding: '20px 0',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={onMouseLeave}
    >
      {/* Desktop Floating Left Navigation Button */}
      <button
        type="button"
        onClick={() => scrollLeftBy(-390)}
        aria-label="Previous videos"
        className="client-stories-floating-arrow is-left"
        style={{
          position: 'absolute',
          left: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: 'rgba(10, 21, 16, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(198, 162, 101, 0.35)',
          color: 'var(--accent-gold, #C6A265)',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          transition: 'all 0.25s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--accent-gold, #C6A265)';
          e.currentTarget.style.color = '#122217';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(10, 21, 16, 0.85)';
          e.currentTarget.style.color = 'var(--accent-gold, #C6A265)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
        }}
      >
        <ChevronLeft size={22} strokeWidth={2.2} />
      </button>

      {/* Desktop Floating Right Navigation Button */}
      <button
        type="button"
        onClick={() => scrollLeftBy(390)}
        aria-label="Next videos"
        className="client-stories-floating-arrow is-right"
        style={{
          position: 'absolute',
          right: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: 'rgba(10, 21, 16, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(198, 162, 101, 0.35)',
          color: 'var(--accent-gold, #C6A265)',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          transition: 'all 0.25s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--accent-gold, #C6A265)';
          e.currentTarget.style.color = '#122217';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(10, 21, 16, 0.85)';
          e.currentTarget.style.color = 'var(--accent-gold, #C6A265)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
        }}
      >
        <ChevronRight size={22} strokeWidth={2.2} />
      </button>

      {/* Horizontally Scrollable Track */}
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        style={{
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          cursor: isDragging ? 'grabbing' : 'grab',
          padding: '10px 40px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '30px',
            flexShrink: 0,
            alignItems: 'center',
          }}
        >
          {sets.map((setIndex) =>
            VIDEO_IDS.map((id) => {
              const cardKey = `${id}-${setIndex}`;
              const isPlaying = activeCardKey === cardKey;

              return (
                <div
                  key={cardKey}
                  style={{
                    width: '360px',
                    flexShrink: 0,
                    borderRadius: '24px',
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
                      isPlaying={isPlaying}
                      onPlay={() => {
                        if (!hasDragged) {
                          handlePlayCard(cardKey);
                        }
                      }}
                      onClose={() => setActiveCardKey(null)}
                    />
                  </div>
                  <div
                    style={{
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <PlayCircle
                      size={16}
                      style={{
                        color: 'var(--accent-gold)',
                      }}
                    />
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
      </div>

      {/* Mobile Navigation Buttons (Placed neatly underneath the videos to prevent overlapping) */}
      <div className="client-stories-bottom-arrows">
        <button
          type="button"
          onClick={() => scrollLeftBy(-320)}
          aria-label="Previous video"
          className="client-stories-bottom-btn"
        >
          <ChevronLeft size={22} strokeWidth={2.2} />
        </button>
        <button
          type="button"
          onClick={() => scrollLeftBy(320)}
          aria-label="Next video"
          className="client-stories-bottom-btn"
        >
          <ChevronRight size={22} strokeWidth={2.2} />
        </button>
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }

        .client-stories-floating-arrow {
          display: flex;
        }

        .client-stories-bottom-arrows {
          display: none;
        }

        .client-stories-bottom-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(10, 21, 16, 0.9);
          border: 1px solid rgba(198, 162, 101, 0.35);
          color: var(--accent-gold, #C6A265);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
          transition: all 0.2s ease;
        }

        .client-stories-bottom-btn:active {
          transform: scale(0.94);
          background: var(--accent-gold, #C6A265);
          color: #122217;
        }

        @media (max-width: 768px) {
          .client-stories-floating-arrow {
            display: none !important;
          }

          .client-stories-bottom-arrows {
            display: flex !important;
            justify-content: center;
            align-items: center;
            gap: 20px;
            margin-top: 18px;
          }
        }
      `}</style>
    </div>
  );
}
