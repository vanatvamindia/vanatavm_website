'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import type Lenis from 'lenis';

const LenisContext = createContext<React.RefObject<Lenis | null> | null>(null);

/** Returns a ref whose `.current` is the Lenis instance once mounted (or null before/if disabled). */
export function useLenis() {
  return useContext(LenisContext);
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

    // Skip custom smooth scroll on reduced motion or touch devices so mobile devices use native 120Hz/60Hz hardware scrolling
    if (prefersReduced || isCoarsePointer) return;

    // Lenis is only downloaded where it will actually run (not on phones / reduced motion).
    let cancelled = false;
    let rafId = 0;
    let instance: Lenis | null = null;

    import('lenis').then(({ default: LenisClass }) => {
      if (cancelled) return;
      instance = new LenisClass({
        duration: 1.15,
        smoothWheel: true,
        wheelMultiplier: 1,
      });
      lenisRef.current = instance;
      rafId = requestAnimationFrame(function raf(time: number) {
        instance?.raf(time);
        rafId = requestAnimationFrame(raf);
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      instance?.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
}
