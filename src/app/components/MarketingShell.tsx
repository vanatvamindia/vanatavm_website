'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { LazyMotion } from 'framer-motion';
import FloatingController from '@/components/premium/FloatingController';
import FloatingWhatsApp from '@/components/premium/FloatingWhatsApp';
import GrainOverlay from '@/components/premium/GrainOverlay';
import SmoothScroll from '@/components/premium/SmoothScroll';

export default function MarketingShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) {
      document.body.classList.add('admin-mode');
      const botElements = document.querySelectorAll(
        '[id*="kenyt"], [class*="kenyt"], iframe[src*="kenyt"]'
      );
      botElements.forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const threshold = 80;

      if (scrollY <= threshold) {
        document.body.classList.add('in-hero-section');
      } else {
        document.body.classList.remove('in-hero-section');
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Clean up Kenyt's duplicate WhatsApp icon and speech bubble popups so only the clean launcher and our native FloatingWhatsApp render
    const cleanKenytElements = () => {
      document.querySelectorAll(
        '#bubbleTail, [id*="bubbleTail"], #messageWrapperBox, .chatWithUsMessageWrapper, [id*="kenyt-greeting"], .kenyt-greeting, #kenytBubbleContainer .kchannel-icon, #kenytChatBubble [class*="whatsapp"], #kenytChatBubble a[href*="wa.me"]'
      ).forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.setProperty('display', 'none', 'important');
        htmlEl.style.setProperty('visibility', 'hidden', 'important');
        htmlEl.style.setProperty('pointer-events', 'none', 'important');
      });
    };
    cleanKenytElements();
    const cleanTimer = setInterval(cleanKenytElements, 600);

    return () => {
      clearInterval(cleanTimer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      document.body.classList.remove('in-hero-section');
    };
  }, [pathname, isAdmin]);

  const loadMotionFeatures = () => import('@/lib/motionFeatures').then((mod) => mod.default);

  if (isAdmin) {
    return <LazyMotion features={loadMotionFeatures}>{children}</LazyMotion>;
  }

  return (
    <LazyMotion features={loadMotionFeatures}>
      <FloatingController />
      <FloatingWhatsApp />

      {/* Kenyt Chat AI Embed Script placed directly under the WhatsApp floating icon */}
      <Script
        src="https://india.kenyt.ai/botapp/ChatbotUI/dist/js/bot-loader.js"
        strategy="lazyOnload"
        data-bot="116027152"
      />

      <GrainOverlay />
      <SmoothScroll>{children}</SmoothScroll>
    </LazyMotion>
  );
}
