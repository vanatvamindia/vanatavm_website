'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

export default function FloatingController() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });

    // Cache threshold so layout is not read on every scroll event.
    let threshold = window.innerHeight ? window.innerHeight * 0.65 : 400;
    const computeThreshold = () => {
      const hero = document.getElementById('hero') || document.querySelector('.hero');
      threshold = hero
        ? (hero.offsetTop + hero.offsetHeight) * 0.75
        : (window.innerHeight ? window.innerHeight * 0.65 : 400);
    };
    computeThreshold();
    window.addEventListener('resize', computeThreshold, { passive: true });

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      setScrolled(scrollY > threshold);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('resize', computeThreshold);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {scrolled && (
        <motion.div
          key="enquire-tab"
          className="floating-enquire-tab"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          style={{
            position: "fixed",
            right: 0,
            top: isMobile ? "50%" : "38%",
            transform: "translateY(-50%)",
            zIndex: 9990,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Link
            href="/contact"
            aria-label="Enquire Now"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: isMobile ? "4px" : "8px",
              background: "linear-gradient(135deg, #F39C12, #D67E0E)",
              color: "#FFFFFF",
              padding: isMobile ? "12px 8px" : "16px 12px",
              borderRadius: "10px 0 0 10px",
              boxShadow: "-4px 6px 20px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.2)",
              textDecoration: "none",
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              fontFamily: "var(--font-sans, system-ui, sans-serif)",
              fontSize: isMobile ? "0.8rem" : "0.92rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "transform 0.25s ease, background 0.25s ease",
              userSelect: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateX(-4px)";
              e.currentTarget.style.background = "linear-gradient(135deg, #E67E22, #C0392B)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateX(0px)";
              e.currentTarget.style.background = "linear-gradient(135deg, #F39C12, #D67E0E)";
            }}
          >
            <Calendar size={16} style={{ transform: "rotate(90deg)" }} />
            <span>Enquire Now</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
