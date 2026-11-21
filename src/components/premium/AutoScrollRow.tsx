'use client';

import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type AutoScrollRowProps<T> = {
  /** Items shown in the row (rendered twice internally so the loop is seamless). */
  items: T[];
  /** Stable key for an item. */
  getKey: (item: T) => string;
  /** Renders one card. `copy` is 0 or 1 (which of the two copies), `key` is unique per card. */
  renderItem: (item: T, copy: 0 | 1, key: string) => ReactNode;
  /** Card width and gap in px; one ‹ › press moves exactly itemWidth + gap. */
  itemWidth: number;
  gap: number;
  /** Auto-scroll speed in px per second. */
  speed: number;
  /** Accessible name of the row, e.g. "Client video testimonials". */
  label: string;
  /** Used in the button labels: "Previous video" / "Next video". */
  itemNoun: string;
  /** Extra external pause, e.g. while a video in the row is playing. */
  paused?: boolean;
  /** Called when the row scrolls out of view (e.g. to stop playing videos). */
  onLeaveView?: () => void;
  /** Padding around the cards (room for shadows and hover lift). */
  padding?: string;
};

/** After the visitor scrolls, drags, swipes or presses ‹ ›/arrow keys, wait before auto-scrolling. */
const RESUME_AFTER_MS = 3500;

/**
 * Horizontal row that scrolls on its own and can also be moved by hand.
 *
 * - Auto-scroll is real scrolling, so it also works with swipe (phones), trackpad/shift+wheel and
 *   click-and-drag (desktop); ‹ › buttons and the ← / → keys move exactly one card.
 * - Pauses while the visitor interacts (then resumes after a few seconds), while a mouse hovers
 *   over it, while `paused` is set, and whenever it is off screen; it starts again by itself when
 *   the visitor scrolls back to it. Visitors who prefer reduced motion get no auto-scroll.
 */
export default function AutoScrollRow<T>({
  items,
  getKey,
  renderItem,
  itemWidth,
  gap,
  speed,
  label,
  itemNoun,
  paused = false,
  onLeaveView,
  padding = '20px 0',
}: AutoScrollRowProps<T>) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0); // precise position (scrollLeft is rounded by some browsers)
  const pauseUntilRef = useRef(0);
  const hoverRef = useRef(false);
  const dragRef = useRef<{ x: number; left: number; moved: boolean; t: number } | null>(null);
  const suppressClickRef = useRef(false);
  const onLeaveViewRef = useRef(onLeaveView);
  const [inView, setInView] = useState(false);

  const step = itemWidth + gap;
  const loopWidth = items.length * step;
  const holdAutoScroll = (ms = RESUME_AFTER_MS) => {
    pauseUntilRef.current = performance.now() + ms;
  };

  useEffect(() => {
    onLeaveViewRef.current = onLeaveView;
  }, [onLeaveView]);

  // When `paused` is released (e.g. a video stops), give it a moment before moving again.
  useEffect(() => {
    if (!paused) pauseUntilRef.current = Math.max(pauseUntilRef.current, performance.now() + 2000);
  }, [paused]);

  // Track whether the row is on screen.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (!entry.isIntersecting) {
          // Scrolling the page doesn't fire "mouse left", so a stale hover could keep the row
          // paused when the visitor returns. A real hover is picked up again on the next move.
          hoverRef.current = false;
          dragRef.current = null;
          onLeaveViewRef.current?.();
        }
      },
      { rootMargin: '100px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-scroll loop: runs only while on screen and not paused.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || paused || !inView || loopWidth === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    posRef.current = el.scrollLeft;
    let last = performance.now();
    let raf = requestAnimationFrame(function tick(now) {
      const dt = Math.min(now - last, 100) / 1000;
      last = now;
      // A mouse press only counts as dragging once it moves. If the release never reaches us
      // (e.g. a click on a video swaps the button for the YouTube iframe, which then receives
      // the mouse-up), a press that hasn't moved stops counting after 0.8s.
      const drag = dragRef.current;
      if (drag && !drag.moved && now - drag.t > 800) dragRef.current = null;
      const dragging = !!dragRef.current;
      if (now > pauseUntilRef.current && !hoverRef.current && !dragging) {
        // Pick up any manual scrolling that happened while paused.
        if (Math.abs(el.scrollLeft - posRef.current) > 2) posRef.current = el.scrollLeft;
        posRef.current += speed * dt;
        // The second copy is identical, so jumping back one loop is invisible.
        if (posRef.current >= loopWidth) posRef.current -= loopWidth;
        el.scrollLeft = posRef.current;
      }
      raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [paused, inView, loopWidth, speed]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    holdAutoScroll();
    // Keep room to move both ways by jumping to the matching card in the other copy.
    if (!paused) {
      if (dir === -1 && el.scrollLeft < step) el.scrollLeft += loopWidth;
      else if (dir === 1 && el.scrollLeft > loopWidth) el.scrollLeft -= loopWidth;
    }
    const target = (Math.round(el.scrollLeft / step) + dir) * step;
    el.scrollTo({ left: target, behavior: 'smooth' });
    posRef.current = target;
  };

  // Keyboard ← / → while at least half of the row is on screen (not while typing).
  // Re-bound each render so it always sees the current state.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.defaultPrevented) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable='true']")) return;
      const r = scrollerRef.current?.getBoundingClientRect();
      if (!r || Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0) < r.height / 2) return;
      e.preventDefault();
      scrollByCard(e.key === 'ArrowRight' ? 1 : -1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  // A mouse release anywhere (or leaving the window) ends a drag, even if it didn't land on the row.
  useEffect(() => {
    const clear = () => {
      if (dragRef.current && !dragRef.current.moved) dragRef.current = null;
    };
    window.addEventListener('pointerup', clear);
    window.addEventListener('blur', clear);
    return () => {
      window.removeEventListener('pointerup', clear);
      window.removeEventListener('blur', clear);
    };
  }, []);

  // Click-and-drag scrolling for mouse users (touch devices scroll natively).
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    holdAutoScroll();
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    dragRef.current = { x: e.clientX, left: scrollerRef.current?.scrollLeft ?? 0, moved: false, t: performance.now() };
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
    if (dragRef.current?.moved) suppressClickRef.current = true; // a drag is not a click
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
      aria-label={label}
      style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
    >
      <div
        ref={scrollerRef}
        className="auto-scroll-row"
        // Let the browser handle sideways trackpad/wheel scrolling here (Lenis would intercept it).
        data-lenis-prevent
        onPointerLeave={() => {
          hoverRef.current = false;
        }}
        onPointerDown={onPointerDown}
        onPointerMove={(e) => {
          // Pause on hover only when the mouse actually moves over the row. When the page is
          // scrolled so the row slides under a still pointer, browsers report "enter"/"move"
          // with no movement; that shouldn't stop the row from scrolling on its own.
          if (e.pointerType === 'mouse' && (e.movementX !== 0 || e.movementY !== 0)) hoverRef.current = true;
          onPointerMove(e);
        }}
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
        style={{ display: 'flex', gap, padding, overflowX: 'auto', overflowY: 'hidden' }}
      >
        {([0, 1] as const).map((copy) =>
          items.map((item) => {
            const key = `${copy}-${getKey(item)}`;
            return <React.Fragment key={key}>{renderItem(item, copy, key)}</React.Fragment>;
          })
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 8 }}>
        <button type="button" aria-label={`Previous ${itemNoun}`} onClick={() => scrollByCard(-1)} style={arrowStyle}>
          <ChevronLeft size={22} />
        </button>
        <button type="button" aria-label={`Next ${itemNoun}`} onClick={() => scrollByCard(1)} style={arrowStyle}>
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
}
