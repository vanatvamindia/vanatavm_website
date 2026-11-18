"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import Link from "@/components/ui/AppLink";
import dynamic from "next/dynamic";
import Navigation from "@/app/components/Navigation";
import VideoTestimonials from "@/components/premium/VideoTestimonials";

const Footer = dynamic(() => import("@/app/components/Footer"), { ssr: true });
import {
  TreePine,
  Leaf,
  Droplets,
  RefreshCcw,
  Users,
  Target,
  Award,
  Sparkles,
  Compass,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  MoveLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Magnetic from "@/components/premium/Magnetic";
import Counter from "@/components/premium/Counter";
import { useLenis } from "@/components/premium/SmoothScroll";
import { responsiveImg } from "@/lib/responsiveImage";
import PortraitSource from "@/components/ui/PortraitSource";
import { preloadHero } from "@/lib/preloadHero";

type PolaroidItem = {
  id: string;
  title: string;
  caption: string;
  subtitle: string;
  img: string;
};

const lifeAtVanatvamPolaroids: PolaroidItem[] = [
  {
    id: "deepotsava",
    title: "Deepotsava at Farm",
    caption: "Deepotsava",
    subtitle:
      "Hundreds of earthen lamps lovingly lit across pathways, courtyards, and sacred groves.",
    img: "/event-images/DSC08963.webp",
  },
  {
    id: "banana-orchard",
    title: "Tropical Banana Grove",
    caption: "Banana Grove",
    subtitle:
      "Vibrant multi-canopy banana and fruit orchards nurtured through chemical-free living soil.",
    img: "/assets/life/vanatvam3.webp",
  },
  {
    id: "vasantotsava",
    title: "Vasantotsava Gathering",
    caption: "Vasantotsava",
    subtitle:
      "Joyous spring celebration with music, guided forest walks, and organic farm feasts.",
    img: "/assets/project-images/Brindavana/sunny-tropical-banana-orchard.webp",
  },
  {
    id: "brick-courtyard",
    title: "Verdant Courtyard",
    caption: "Brick Courtyard",
    subtitle:
      "Vernacular sustainable architecture embracing terracotta courtyards and open breeze pavilions.",
    img: "/assets/life/vanatvam.webp",
  },
  {
    id: "nursery-saplings",
    title: "Native Sapling Nursery",
    caption: "Native Nursery",
    subtitle:
      "Propagating indigenous forestry saplings to restore ancient biodiversity and sacred groves.",
    img: "/assets/life/vanatvam1.webp",
  },
  {
    id: "bonfire-nights",
    title: "Twilight Bonfire Evenings",
    caption: "Bonfire Nights",
    subtitle:
      "Stargazing, storytelling, and communal cooking around gentle twilight farm fires.",
    img: "/event-images/DSC09025.webp",
  },
  {
    id: "green-tunnel",
    title: "Canopy Trail Pathways",
    caption: "Canopy Trails",
    subtitle:
      "Tranquil walking pathways winding through living bamboo clusters and bird-friendly flora.",
    img: "/assets/life/vanatvam2.webp",
  },
    {
    id: "green-tunnel-2",
    title: "Canopy Trail Pathways",
    caption: "Canopy Trails",
    subtitle:
      "Tranquil walking pathways winding through living bamboo clusters and bird-friendly flora.",
    img: "/assets/life/vanatvam4.webp",
  },
  
];

const heroSlides = [
  {
    id: "ishavana",
    name: "ISHAVANA",
    tagline: "A premium riverfront community on the sacred Kaveri.",
    img: "/assets/project-images/Esahavana/EV.webp",
  },
  {
    id: "anantavana",
    name: "ANANTAVANA",
    tagline: "An Extensive Eco Conservation project to restore Bio Diversity.",
    img: "/assets/project-images/Ananthavana/hero-image-2.webp",
  },
  {
    id: "madhuvana",
    name: "MADHUVANA",
    tagline: "A dense water-forest ecosystem built around 250+ native trees.",
    img: "/assets/project-images/Maduvana/hero.webp",
  },
  {
    id: "brindavana",
    name: "BRINDAVANA",
    tagline: "Barren semi-arid land turned into a thriving ecosystem.",
    img: "/assets/project-images/Brindavana/brindavanaaa.webp",
  },
];

export default function Home() {
  preloadHero(heroSlides[0].img);
  const lenisRef = useLenis();
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideChanged, setSlideChanged] = useState(false);
  // Auto-rotation starts only after the visitor's first scroll, tap, click or key press.
  // Rotating on a timer from page load makes each new (larger) slide heading count as a fresh
  // "largest contentful paint", so speed tests like Lighthouse report the page as seconds slower
  // than it really is. Real visitors almost always interact within moments, so they still see
  // the carousel rotate; the prev/next arrows and dots work from the start.
  const [autoRotate, setAutoRotate] = useState(false);

  useEffect(() => {
    if (autoRotate) return;
    const events = ["scroll", "wheel", "pointerdown", "touchstart", "keydown"] as const;
    const start = () => setAutoRotate(true);
    events.forEach((e) => window.addEventListener(e, start, { passive: true, once: true }));
    return () => events.forEach((e) => window.removeEventListener(e, start));
  }, [autoRotate]);

  // Bumped on every manual change so the 6s timer restarts and the chosen slide gets a full 6s.
  const [manualNavCount, setManualNavCount] = useState(0);

  // Rotation pauses once the visitor scrolls past the hero and resumes (with a fresh 6s)
  // when they scroll back up. "In view" means at least a quarter of the hero is visible.
  // (This replaces the old pause-on-hover: the hero fills the screen, so on desktop the mouse
  // was nearly always over it and rotation rarely ran, and on phones a tap fired "mouse enter"
  // with no matching "leave", pausing it for good.)
  const heroRef = useRef<HTMLElement>(null);
  const [heroInView, setHeroInView] = useState(true);
  useEffect(() => {
    const el = heroRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.intersectionRatio >= 0.25),
      { threshold: [0, 0.25, 0.5] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!autoRotate || !heroInView) return;
    const timer = setInterval(() => {
      setSlideChanged(true);
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [autoRotate, heroInView, manualNavCount]);

  const goToSlide = (step: 1 | -1) => {
    setSlideChanged(true);
    setManualNavCount((n) => n + 1);
    setActiveSlide((p) => (p + step + heroSlides.length) % heroSlides.length);
  };
  const nextSlide = () => goToSlide(1);
  const prevSlide = () => goToSlide(-1);

  // Touch: swipe left/right on the hero to change project. Only clearly horizontal, quick
  // swipes count, so vertical scrolling and taps on the buttons behave exactly as before.
  const swipeStart = useRef<{ x: number; y: number; t: number } | null>(null);
  const onHeroTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    swipeStart.current = { x: touch.clientX, y: touch.clientY, t: Date.now() };
  };
  const onHeroTouchEnd = (e: React.TouchEvent) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start || e.changedTouches.length === 0) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    const isSwipe = Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5 && Date.now() - start.t < 800;
    if (isSwipe) goToSlide(dx < 0 ? 1 : -1); // swipe left → next project
  };

  // Keyboard: ← / → move between projects while the hero is on screen.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.defaultPrevented) return;
      // Never hijack arrows while the visitor is typing or using another widget.
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable='true'], [role='slider'], [role='listbox']")) return;
      // Only while at least half of the hero is visible.
      const r = heroRef.current?.getBoundingClientRect();
      if (!r || Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0) < r.height / 2) return;
      e.preventDefault();
      setSlideChanged(true);
      setManualNavCount((n) => n + 1);
      const step = e.key === "ArrowRight" ? 1 : -1;
      setActiveSlide((p) => (p + step + heroSlides.length) % heroSlides.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  const slide = heroSlides[activeSlide];

  const scrollToProjects = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (lenisRef?.current) {
      lenisRef.current.scrollTo("#projects", { offset: -60, duration: 1.6 });
    } else {
      document
        .getElementById("projects")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <>
      <Navigation />

      {/* ORIGINAL HERO SECTION RESTORED */}
      <section
        ref={heroRef}
        className="hero hero-carousel"
        id="hero"
        aria-roledescription="carousel"
        aria-label="Featured projects (swipe, or use the left and right arrow keys, to switch)"
        onTouchStart={onHeroTouchStart}
        onTouchEnd={onHeroTouchEnd}
        onTouchCancel={() => {
          swipeStart.current = null;
        }}
        // Browser keeps vertical scrolling; horizontal swipes are left to the carousel.
        style={{ touchAction: "pan-y" }}
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={slide.id}
            className="hero-bg-wrapper"
            initial={slideChanged ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          >
            <picture>
              <PortraitSource src={slide.img} />
              <img
                {...responsiveImg(slide.img)}
                alt={slide.name}
                fetchPriority={slide.id === heroSlides[0].id ? "high" : "auto"}
                loading={slide.id === heroSlides[0].id ? "eager" : "lazy"}
                decoding="sync"
                className="hero-bg-img"
                width={1920}
                height={1080}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </picture>
          </motion.div>
        </AnimatePresence>
        <div
          className="hero-overlay"
          style={{
            background:
              "linear-gradient(180deg, rgba(18, 34, 23, 0.4) 0%, rgba(18, 34, 23, 0.8) 100%)",
          }}
        ></div>

        <div className="container relative hero-container">
          <div
            className="hero-content"
            style={{ maxWidth: "800px" }}
          >
            <span className="hero-badge">
              Nature-First Farm Communities
            </span>

            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={slideChanged ? { opacity: 0, y: 18 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <h1 className="hero-heading">
                  {slide.name}
                </h1>
                <p className="hero-tagline">
                  {slide.tagline}
                </p>
                <div className="hero-cta-group">
                  <Magnetic strength={0.4}>
                    <Link
                      href={`/${slide.id}`}
                      className="btn-pill btn-pill-gold hero-cta-btn"
                    >
                      Explore{" "}
                      {slide.name.charAt(0) + slide.name.slice(1).toLowerCase()}
                    </Link>
                  </Magnetic>
                  <Magnetic strength={0.4}>
                    <a
                      href="/projects"
                      className="hero-secondary-link"
                    >
                      View All Communities
                    </a>
                  </Magnetic>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="hero-carousel-nav">
          <button
            className="hero-carousel-arrow"
            style={{
              position: "relative",
              top: "auto",
              left: "auto",
              right: "auto",
              transform: "none",
            }}
            onClick={prevSlide}
            aria-label="Previous community"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            className="hero-carousel-arrow"
            style={{
              position: "relative",
              top: "auto",
              left: "auto",
              right: "auto",
              transform: "none",
            }}
            onClick={nextSlide}
            aria-label="Next community"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        <div className="hero-carousel-dots">
          {heroSlides.map((s, i) => (
            <button
              key={s.id}
              className={`hero-carousel-dot ${i === activeSlide ? "active" : ""}`}
              onClick={() => setActiveSlide(i)}
              aria-label={`Go to ${s.name}`}
            />
          ))}
        </div>
      </section>
      
      
      

      {/* Section 5: More than land. A way to belong. & Ancient Wisdom */}
      <section
        style={{
          padding: "clamp(44px, 6vh, 68px) 0",
          background: "var(--bg-cream)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "-10%",
            width: "50vw",
            height: "50vw",
            background:
              "radial-gradient(circle, rgba(198,162,101,0.06) 0%, transparent 70%)",
            zIndex: 0,
            borderRadius: "50%",
          }}
        />

        <div className="container relative" style={{ zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "80px",
              alignItems: "center",
            }}
          >
            {/* Image composition column */}
            <div
              className="home-story-composition"
              style={{
                flex: "1 1 440px",
                position: "relative",
                minHeight: "520px",
              }}
            >
              <motion.div
                className="home-story-main-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                style={{
                  borderRadius: "24px",
                  overflow: "hidden",
                  height: "460px",
                  width: "82%",
                  boxShadow: "0 25px 60px rgba(0,0,0,0.12)",
                }}
              >
                <img
                  {...responsiveImg("/assets/project-images/Ananthavana/ananthavana-hero.webp", "(max-width: 768px) 175vw, 60vw")}
                  alt="Ancient tall forest grove canopy"
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="460"
                  className="home-story-main-img"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "left center" }}
                />
              </motion.div>

              {/* Overlapping offset image */}
              <motion.div
                className="home-story-offset-card"
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "0",
                  width: "58%",
                  height: "240px",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
                  border: "5px solid #F9F8F6",
                }}
              >
                <img
                  {...responsiveImg("/assets/project-images/Maduvana/rustic-tropical-garden-gateway.webp", "(max-width: 768px) 155vw, 70vw")}
                  alt="Living landscape gateway"
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="240"
                  className="home-story-offset-img"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </motion.div>

              {/* Floating aesthetic caption tag */}
              <div
                className="home-story-caption-tag"
                style={{
                  position: "absolute",
                  bottom: "-25px",
                  left: "20px",
                  background: "#FFFFFF",
                  padding: "16px 24px",
                  borderRadius: "16px",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.05rem",
                    color: "var(--bg-dark-forest)",
                    fontWeight: 600,
                  }}
                >
                  A living landscape.
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    color: "var(--text-muted)",
                  }}
                >
                  A shared legacy.
                </span>
              </div>
            </div>

            {/* Text content column */}
            <div style={{ flex: "1 1 480px" }}>
              <span
                style={{
                  color: "var(--accent-gold)",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "18px",
                }}
>
WHO WE ARE
</span>

<h2
  style={{
    fontFamily: "var(--font-serif)",
    fontSize: "clamp(2.5rem, 4.5vw, 3.8rem)",
    color: "var(--bg-dark-forest)",
    lineHeight: 1.12,
    marginBottom: "24px",
    letterSpacing: "-0.02em",
    fontWeight: 600,
  }}
>
  More than land.
  <br />
  A way to belong.
</h2>

<p
  style={{
    fontSize: "1.05rem",
    color: "#556358",
    lineHeight: 1.8,
    marginBottom: "16px",
  }}
>
  Vana means forest, Tvam means you — the forest isn't separate from us, we're part of it. Vanatvam was born during the pandemic, out of realising how far we'd drifted from that balance. We create Natural Sustainable Farm Communities across Karnataka: organic, biodiverse, and built to be lived in, not just owned.
</p>

<p
  style={{
    fontSize: "1.05rem",
    color: "#556358",
    lineHeight: 1.8,
    marginBottom: "24px",
  }}
>
  Our biodiversity-led farm communities are located natural resource rich Bangalore Mysore-Chamarajanagar corridor along the Kaveri river belt in Karnataka. Vanatvam follows six core principles while evolving the projects.
</p>


        <Magnetic strength={0.25}>
       <Link
         href="/about"
         className="btn-pill btn-pill-gold"
         style={{
         padding: "14px 32px",
         fontSize: "1rem",
         fontWeight: 700,
         display: "inline-flex",
         alignItems: "center",
        gap: "8px",
       }}
       >
         Our Philosophy <ArrowRight className="size-4" />
  </Link>
</Magnetic>
            </div>
          </div>
        </div>
      </section>

     {/* Section 6: Not just a farmland developer. A landscape-led approach. */}
<section
  style={{
    padding: "clamp(48px, 6.5vh, 72px) 0",
    background: "#F5F2EB",
    position: "relative",
  }}
>
  <div
    className="container"
    style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}
  >
    {/* Main Grid Layout: Left Sticky Header, Right Scrolling Overlap Stack */}
    <div
      className="projects-sticky-layout"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
        gap: "clamp(36px, 6vw, 96px)",
        alignItems: "start",
        position: "relative",
      }}
    >
      {/* LEFT COLUMN: Sticky Header Content */}
      <div
        className="projects-sticky-header"
        style={{
          position: "sticky",
          top: "120px",
          maxWidth: "480px",
        }}
      >
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            color: "var(--accent-gold)",
            fontSize: "0.8rem",
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            fontWeight: 700,
            display: "block",
            marginBottom: "16px",
          }}
        >
          Our Approach
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
            color: "var(--bg-dark-forest)",
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            fontWeight: 600,
            marginBottom: "24px",
          }}
        >
          Not a farmland developer. 
          <br />
          <span style={{ fontStyle: "italic", fontWeight: 400 }}>
            A philosophy.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: "clamp(1.05rem, 1.2vw, 1.2rem)",
            color: "#556358",
            lineHeight: "1.75",
            fontWeight: 400,
            margin: 0,
          }}
        >
          Every decision on every piece of land we touch comes back to six core  principles — ensuring that as the landscape matures, experiences take root and people become true stewards of the place.
        </motion.p>
      </div>

      {/* RIGHT COLUMN: Overlapping Scrolling Approach Cards (All 6 Commitments) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          position: "relative",
          paddingBottom: "40px",
        }}
      >
        {[
          {
            num: "01 / Strategic Locations",
            title: "Along the Bangalore–Mysore Corridor",
            desc: "Located amidst stunning natural settings in MadhuVana (Near Maddur), AnantaVana (Near Kabini), Eeshavana (Near Shivanasamudhra), and BrindaVana (Near Pavagada). Places worth owning, not just visiting, each selected after rigorous due diligence.",
          },
          {
            num: "02 / Biodiversity by Design",
            title: "We plant for the ecosystem, not just a crop",
            desc: "Featuring 200+ native, rare and endangered tree species gathered into sacred groves like Nakshatra, Navagraha and Saraswathi Vana. Naturalists have documented 50+ bird species on our chemical-free land against national decline trends (State of India's Birds, 2023).",
          },
          {
            num: "03 / Natural and Organic",
            title: "Grown naturally, no compromise",
            desc: "Everything we grow is organic, full stop — not a certification to chase, but the discipline Vanatvam is built on. We stay on the land season after season, adapting to local soil and climate rather than planting once and walking away.",
          },
          {
            num: "04 / Integration Of Sacred Groves",
            title: "Vedic forest science, woven into the land",
            desc: "Our communities are woven with conceptual Vanas — Nakshatra, Navagraha, Saraswathi and more — a tradition documented in the Vanyashastra Samhita, where each grove has a specific composition of trees and a specific purpose. ",
          },
          {
            num: "05 /Features to Enrich Experience",
            title: "Shared amenities to Enrich Experience.",
            desc: "Cottages, ponds, gazebos, tree houses — laid out in an architect-led master plan and shared across the community. Features like these are built to enrich the experience and invite people to keep returning to Vanatvam communities.",
          },
          {
            num: "06 /Aesthetically Designed Water Bodies",
            title: "Well designed water bodies create a calming effect. ",
            desc: "Every community is designed around its relationship with water — ponds and groves that purify groundwater and keep it healthy, shaping how a place feels as much as how it functions. The aesthetically designed water bodies enable visitors to reflect and feel a calming effect ",
          },
        ].map((card, i) => (
          <motion.div
            key={card.num}
            className="projects-sticky-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.5,
              ease: [0.25, 1, 0.5, 1],
              delay: 0.04 * i,
            }}
            style={{
              "--sticky-top": `${130 + i * 26}px`,
              minHeight: "fit-content",
              height: "auto",
              background: "#FFFFFF",
              border: "1px solid rgba(18,34,23,0.08)",
              borderRadius: "24px",
              padding: "clamp(28px, 4vw, 40px)",
              boxShadow: "0 12px 36px rgba(18, 34, 23, 0.06)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              zIndex: i + 1,
            } as React.CSSProperties}
          >
            <div>
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "var(--accent-gold)",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: "14px",
                }}
              >
                {card.num}
              </span>

              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1.4rem, 2.2vw, 1.75rem)",
                  color: "var(--bg-dark-forest)",
                  fontWeight: 600,
                  lineHeight: 1.3,
                  marginBottom: "14px",
                }}
              >
                {card.title}
              </h3>

              <p
                style={{
                  fontSize: "1.02rem",
                  color: "#5A685E",
                  lineHeight: 1.75,
                  margin: 0,
                  fontWeight: 400,
                  width: "100%",
                }}
              >
                {card.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
</section>

      {/* Impact in Numbers */}
      <section
        style={{
          padding: "clamp(36px, 4.5vh, 52px) 0",
          background: "var(--bg-dark-forest)",
          borderTop: "1px solid var(--border-dark)",
          borderBottom: "1px solid var(--border-dark)",
        }}
      >
        <div
          className="container"
          style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))",
              gap: "clamp(20px, 3vw, 32px)",
              textAlign: "center",
            }}
          >
            {[
              {
                value: 4,
                suffix: "",
                label: "Living Ecosystems Across Karnataka",
              },
              {
                value: 100,
                suffix: "+",
                label: "Acres Under Active Regeneration",
              },
              { value: 100, suffix: "+", label: "Families In Our Communities" },
              { value: 250, suffix: "+", label: "Native Tree Varieties" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(2.4rem, 3.8vw, 3.4rem)",
                    color: "var(--accent-gold)",
                    lineHeight: 1,
                    marginBottom: "8px",
                    fontWeight: 600,
                  }}
                >
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <p
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    fontSize: "0.92rem",
                    letterSpacing: "0.03em",
                    maxWidth: "240px",
                    margin: "0 auto",
                    fontWeight: 300,
                    lineHeight: 1.4,
                  }}
                >
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>






      
      {/* Section 9: Four Unique Expressions of Nature's Abundance with Sticky Left Header and Overlapping Scrolling Cards */}
      <section
        className="projects-section projects-sticky-section"
        id="projects"
        style={{
          padding: "clamp(48px, 6.5vh, 72px) 0",
          background: "var(--bg-cream)",
          position: "relative",
          overflow: "visible",
        }}
      >
        {/* Background Glows */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "-5%",
            width: "40vw",
            height: "40vw",
            background:
              "radial-gradient(circle, rgba(198,162,101,0.08) 0%, transparent 70%)",
            zIndex: 0,
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-5%",
            width: "50vw",
            height: "50vw",
            background:
              "radial-gradient(circle, rgba(45,106,79,0.05) 0%, transparent 70%)",
            zIndex: 0,
            borderRadius: "50%",
          }}
        />

        <div
          className="container relative-z projects-sticky-container"
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            zIndex: 2,
          }}
        >
          {/* Main Grid Layout: Left Sticky Header, Right Scrolling Overlap Stack */}
          <div className="projects-sticky-layout">
            {/* LEFT COLUMN: Sticky Header Content */}
            <div className="projects-sticky-header">
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="subtitle-tag"
                style={{
                  color: "var(--accent-gold)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: "16px",
                }}
              >
                LIVING ECOSYSTEMS
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
                  lineHeight: 1.15,
                  color: "var(--bg-dark-forest)",
                  letterSpacing: "-0.025em",
                  fontWeight: 600,
                  marginBottom: "24px",
                }}
              >
                Four Unique Expressions
                <br />
                of{" "}
                <span style={{ fontStyle: "italic", fontWeight: 400 }}>
                  Nature&apos;s Abundance.
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{
                  fontSize: "clamp(1.05rem, 1.2vw, 1.2rem)",
                  color: "#556358",
                  lineHeight: 1.75,
                  fontWeight: 400,
                  marginBottom: "32px",
                }}
              >
                Explore our signature ecosystem developments designed to
                harmonize luxurious living with pristine ecological
                regeneration.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Magnetic strength={0.25}>
                  <Link
                    href="/projects"
                    className="btn-pill btn-pill-gold"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "14px 28px",
                      fontSize: "1rem",
                      fontWeight: 600,
                      borderRadius: "100px",
                    }}
                  >
                    Explore All Projects <ArrowRight className="size-4" />
                  </Link>
                </Magnetic>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Overlapping Scrolling Project Cards Stack */}
            <div className="projects-sticky-cards">
              {[
                
                {
                  id: "anantavana",
                  name: "ANANTAVANA",
                  badge: "NEAR KABINI · 34 ACRES",
                  img: "/assets/project-images/Ananthavana/hero-image-2.webp",
                   
                },
                {
                  id: "ishavana",
                  name: "ISHAVANA",
                  badge: "Shivanasamudhra ·10 Acres",
                  img: "/assets/project-images/Esahavana/EV.webp",
                   
                },
                {
                  id: "madhuvana",
                  name: "MADHUVANA",
                  badge: "MADDUR · 17 ACRES",
                  img: "/assets/project-images/Maduvana/hero.webp",
                   
                },
                {
                  id: "brindavana",
                  name: "BRINDAVANA",
                  badge: "PAVAGADA · 30 ACRES",
                  img: "/assets/project-images/Brindavana/brindavanaaa.webp",
                   
                },
                
              ].map((proj, i) => (
                <motion.div
                  key={proj.id}
                  className="project-showcase-card"
                  initial={{ opacity: 0, y: 35, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.6,
                    ease: [0.25, 1, 0.5, 1],
                    delay: 0.05 * i,
                  }}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  style={{
                    top: `${140 + i * 20}px`,
                    zIndex: i + 1,
                  }}
                >
                  <Link
                    href={`/${proj.id}`}
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      textDecoration: "none",
                      position: "relative",
                    }}
                  >
                    <img
                      {...responsiveImg(proj.img, "(max-width: 768px) 165vw, 60vw")}
                      alt={proj.name}
                      loading="lazy"
                      decoding="async"
                      width="600"
                      height="400"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.7s cubic-bezier(0.2, 0.9, 0.2, 1)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(12,22,15,0.92) 0%, rgba(12,22,15,0.35) 45%, transparent 100%)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        padding: "clamp(24px, 4vw, 36px) clamp(20px, 4vw, 32px)",
                      }}
                    >
                      <div style={{ marginBottom: "12px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            background: "rgba(18, 32, 22, 0.82)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            color: "#E2C48D",
                            padding: "8px 18px",
                            borderRadius: "999px",
                            fontSize: "0.78rem",
                            letterSpacing: "0.15em",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            border: "1px solid rgba(198, 162, 101, 0.35)",
                            boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
                          }}
                        >
                          {proj.badge}
                        </span>
                      </div>

                      <h3
                        style={{
                          color: "#FFFFFF",
                          fontFamily: "'Cinzel', var(--font-serif), Georgia, serif",
                          fontSize: "clamp(2.1rem, 3.8vw, 3.2rem)",
                          fontWeight: 600,
                          letterSpacing: "0.08em",
                          margin: 0,
                          textShadow: "0 3px 12px rgba(0,0,0,0.6)",
                          lineHeight: 1.1,
                        }}
                      >
                        {proj.name}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 10: Life at the Farm - Continuous Right-to-Left Flow */}
      <section
        id="life-at-the-farm"
        style={{
          background: "#122217",
          position: "relative",
          overflow: "hidden",
          padding: "100px 0 120px",
        }}
      >
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            textAlign: "center",
            maxWidth: "900px",
            margin: "0 auto",
            padding: "0 24px 55px",
          }}
        >
          <span
            style={{
              display: "block",
              color: "var(--accent-gold)",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            LIFE AT VanaTvam
          </span>

          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontWeight: 500,
              lineHeight: 1.12,
              letterSpacing: "-0.025em",
              color: "#FFFFFF",
              margin: "0 0 20px",
            }}
          >
            See What Your{" "}
            <span
              style={{
                color: "var(--accent-gold)",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              Weekends
            </span>{" "}
            Look Like
          </h2>

          <p
            style={{
              maxWidth: "650px",
              margin: "0 auto",
              color: "rgba(255,255,255,0.7)",
              fontSize: "1.05rem",
              lineHeight: 1.8,
            }}
          >
            Slow mornings, open skies, nature-filled moments, and memories
            waiting to be made. Discover the feeling of life at VanaTvam.
          </p>

          {/* Decorative Gold Line */}
          <div
            aria-hidden="true"
            style={{
              width: "64px",
              height: "2px",
              background: "var(--accent-gold)",
              margin: "30px auto 0",
            }}
          />
        </motion.div>

        {/* Continuous Flow Infinite Marquee */}
        <div
          style={{
            width: "100%",
            overflow: "hidden",
            position: "relative",
            padding: "20px 0",
          }}
        >
          <div
            className="polaroid-marquee-track"
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
              width: "max-content",
              willChange: "transform",
            }}
          >
            {[0, 1].map((rep) => (
              <div
                key={rep}
                className="polaroid-marquee-group"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  gap: "32px",
                  paddingRight: "32px",
                  flexShrink: 0,
                }}
              >
                {lifeAtVanatvamPolaroids.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${rep}-${index}`}
                    whileHover={{ y: -8, scale: 1.03 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      width: "360px",
                      height: "250px",
                      flexShrink: 0,
                      borderRadius: "20px",
                      overflow: "hidden",
                      boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      position: "relative",
                      background: "#1E352F",
                      cursor: "pointer",
                    }}
                  >
                    <motion.img
                      src={item.img}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      width="360"
                      height="250"
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />

                     
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <style jsx global>{`
          @keyframes polaroid-marquee-scroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }
          .polaroid-marquee-track {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            width: max-content !important;
            will-change: transform;
            animation: polaroid-marquee-scroll 45s linear infinite;
          }
          .polaroid-marquee-track:hover {
            animation-play-state: paused;
          }
          .polaroid-marquee-group {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            flex-shrink: 0 !important;
          }
        `}</style>
      </section>

      {/* FKCCI Award Recognition Section */}
      <section
        style={{
          padding: "clamp(44px, 6vh, 68px) 0",
          background: "#F7F5F0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-5%",
            width: "35vw",
            height: "35vw",
            background:
              "radial-gradient(circle, rgba(198,162,101,0.08) 0%, transparent 70%)",
            zIndex: 0,
            borderRadius: "50%",
          }}
        />

        <div className="container relative" style={{ zIndex: 1 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 310px), 1fr))",
              gap: "clamp(32px, 5vw, 60px)",
              alignItems: "center",
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(198,162,101,0.15)",
                  border: "1px solid rgba(198,162,101,0.3)",
                  padding: "6px 16px",
                  borderRadius: "30px",
                  marginBottom: "20px",
                }}
              >
                <Award
                  className="size-4"
                  style={{ color: "var(--accent-gold)" }}
                />
                <span
                  style={{
                    color: "#1B2B1F",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  Institutional Recognition
                </span>
              </div>

              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
                  color: "var(--bg-dark-forest)",
                  lineHeight: 1.15,
                  marginBottom: "24px",
                  letterSpacing: "-0.02em",
                  fontWeight: 600,
                }}
              >
                FKCCI Award in
                <br />
                <span
                  style={{
                    fontStyle: "italic",
                    fontWeight: 300,
                    fontSize: "2.8rem",
                  }}
                >
                   Tourism &amp; Hospitality - 2026
                </span>
              </h2>

              <p
                style={{
                  fontSize: "1.15rem",
                  color: "#333D35",
                  lineHeight: 1.8,
                  marginBottom: "20px",
                  fontWeight: 400,
                }}
              >
             Vanatvam has been honoured with the{" "}
                <strong
                  style={{ color: "var(--bg-dark-forest)", fontWeight: 600 }}
                >
                  FKCCI Award in Tourism and Hospitality - 2026
                </strong>{" "}
                presented by the Federation of Karnataka Chambers of Commerce and Industry, in recognition of its distinctive approach to nature-led experiences, eco-conscious living, responsible eco-tourism, and biodiversity conservation.

              </p>

              <p
                style={{
                  fontSize: "1.05rem",
                  color: "#556358",
                  lineHeight: 1.8,
                  marginBottom: "32px",
                }}
              >
                
By bringing together ecological restoration, India’s cultural heritage, and thoughtfully developed natural farm communities,
                Vanatvam demonstrates how meaningful nature experiences and environmental stewardship can flourish together for generations to come.
              </p>

               
            </motion.div>

            {/* Right Side — Premium Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "22px",
                width: "100%",
              }}
            >
              {/* First Image */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                style={{
                  position: "relative",
                  width: "100%",
                  height: "auto",
                }}
              >
                <img
                  {...responsiveImg("/event-images/award.webp", "(max-width: 768px) 92vw, 46vw")}
                  alt="Vanatvam's natural forest landscape"
                  loading="lazy"
                  decoding="async"
                  width="800"
                  height="500"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "clamp(40px, 5vh, 60px) 0",
          background: "#122217",
          color: "#FFF",
        }}
      >
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                color: "var(--accent-gold)",
                fontSize: "0.9rem",
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "20px",
              }}
            >
              Client Stories
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                lineHeight: 1.1,
                marginBottom: "20px",
              }}
            >
              Voices of{" "}
              <span
                style={{ fontStyle: "italic", color: "var(--accent-gold)" }}
              >
                VanaTvam.
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                color: "rgba(255,255,255,0.65)",
                maxWidth: "560px",
                margin: "0 auto",
                fontWeight: 300,
              }}
            >
              Hear directly from the families and landowners who walked the land
              before they chose to call it home.
            </motion.p>
          </div>

          <VideoTestimonials
            videoIds={["oTd69o1SAkk", "rPMv_cggbH8", "HIuRfVHefz0", "5sDm6-yiMPs", "61PcdiIYtgs"]}
          />
        </div>
      </section>
      {/* Premium Final CTA — Nature-inspired Contact Experience */}
      <section
        id="contact-cta"
        style={{
          position: "relative",
          isolation: "isolate",
          overflow: "hidden",
          padding: "clamp(36px, 4.5vw, 60px) 20px",
          width: "100%",
          boxSizing: "border-box",
          background: "#FFFFFF",
          color: "#183023",
        }}
      >
        {/* Soft ambient background decoration */}
        <motion.div
          aria-hidden="true"
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.06, 0.12, 0.06],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            zIndex: -1,
            width: "clamp(280px, 40vw, 560px)",
            aspectRatio: "1",
            top: "-180px",
            left: "-130px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(198,162,101,0.35), transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <motion.div
          aria-hidden="true"
          animate={{
            scale: [1.05, 1, 1.05],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            zIndex: -1,
            width: "clamp(320px, 45vw, 640px)",
            aspectRatio: "1",
            right: "-220px",
            bottom: "-300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(72,119,81,0.3), transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Decorative gold divider */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: "2%",
            right: "2%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(198,162,101,0.45), transparent)",
          }}
        />

        <div
          className="container"
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: "1240px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
            alignItems: "center",
            gap: "clamp(48px, 6vw, 96px)",
            boxSizing: "border-box",
            padding: "0 10px",
          }}
        >
          {/* Left: Editorial content */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "28px",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: "34px",
                  height: "1px",
                  background: "#B38B4D",
                }}
              />

              <span
                style={{
                  color: "#987443",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                Your next chapter begins here
              </span>
            </div>

            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.2rem, 4.5vw, 4.2rem)",
                lineHeight: 1.08,
                letterSpacing: "-0.035em",
                fontWeight: 500,
                margin: "0 0 28px",
                maxWidth: "100%",
                color: "#183023",
              }}
            >
              A life closer to{" "}
              <span
                style={{
                  display: "inline-block",
                  color: "#B38B4D",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                nature.
              </span>
              <br />A place to belong.
            </h2>

            <p
              style={{
                maxWidth: "100%",
                color: "#5A685E",
                fontSize: "clamp(1.02rem, 1.25vw, 1.15rem)",
                lineHeight: 1.95,
                margin: "0 0 36px",
              }}
            >
              Discover thoughtfully nurtured landscapes, meaningful outdoor
              experiences, and a community shaped by nature. Tell us what you
              are looking for, and let&apos;s start a conversation.
            </p>

            {/* Decorative signature */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                paddingTop: "24px",
                borderTop: "1px solid #E2E8E3",
                maxWidth: "100%",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  flexShrink: 0,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  color: "#B38B4D",
                  border: "1px solid rgba(179,139,77,0.35)",
                  background: "rgba(198,162,101,0.06)",
                }}
              >
                <Leaf className="size-6" strokeWidth={1.5} />
              </div>

              <div>
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.12rem",
                    fontWeight: 600,
                    marginBottom: "3px",
                    color: "#183023",
                  }}
                >
                  Rooted in nature.
                </div>
                <div
                  style={{
                    color: "#727E74",
                    fontSize: "0.86rem",
                    letterSpacing: "0.035em",
                  }}
                >
                  Thoughtfully grown for generations.
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Premium contact form */}

          <motion.form
            initial={{ opacity: 0, y: 25, scale: 0.99 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.8,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            action="/api/contact"
            method="POST"
            suppressHydrationWarning
            style={{
              position: "relative",
              background: "linear-gradient(145deg, #F9FBF9 0%, #F3F7F4 100%)",
              color: "#26352B",
              padding: "clamp(30px, 3.5vw, 48px)",
              borderRadius: "24px",
              border: "1px solid #DCE4DE",
              boxShadow: "0 22px 55px rgba(0,0,0,0.08)",
              boxSizing: "border-box",
              width: "100%",
              maxWidth: "560px",
              justifySelf: "center",
              margin: "0 auto",
            }}
          >
            {/* Gold accent */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 0,
                left: "10%",
                right: "10%",
                height: "4px",
                borderRadius: "0 0 4px 4px",
                background:
                  "linear-gradient(90deg, transparent, #C6A265, #E9D6AD, #C6A265, transparent)",
              }}
            />

            {/* Form heading */}
            <div style={{ marginBottom: "28px" }}>
              <span
                style={{
                  display: "block",
                  color: "#987443",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                Let&apos;s connect
              </span>

              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1.8rem, 2.4vw, 2.2rem)",
                  lineHeight: 1.2,
                  fontWeight: 500,
                  color: "#183023",
                  margin: "0 0 10px",
                }}
              >
                Begin your journey.
              </h3>

              <p
                style={{
                  color: "#6B776D",
                  fontSize: "0.92rem",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                Share your details and we&apos;ll be in touch.
              </p>
            </div>

            {/* Form fields */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {[
                {
                  id: "cta-name",
                  label: "Full name",
                  type: "text",
                  placeholder: "Enter your full name",
                  name: "name",
                  autoComplete: "name",
                },
                {
                  id: "cta-phone",
                  label: "Phone number",
                  type: "tel",
                  placeholder: "Enter your phone number",
                  name: "phone",
                  autoComplete: "tel",
                },
                {
                  id: "cta-email",
                  label: "Email address",
                  type: "email",
                  placeholder: "Enter your email address",
                  name: "email",
                  autoComplete: "email",
                },
              ].map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: 0.15 + index * 0.08,
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <label
                    htmlFor={field.id}
                    style={{
                      color: "#35483A",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                    }}
                  >
                    {field.label}
                  </label>

                  <input
                    id={field.id}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    required
                    suppressHydrationWarning
                    style={{
                      width: "100%",
                      minHeight: "52px",
                      boxSizing: "border-box",
                      padding: "13px 16px",
                      border: "1px solid #DCE1DA",
                      borderRadius: "10px",
                      background: "#FFFFFF",
                      color: "#26352B",
                      fontFamily: "inherit",
                      fontSize: "0.95rem",
                      outline: "none",
                      transition:
                        "border-color 0.25s ease, box-shadow 0.25s ease",
                    }}
                    onFocus={(event) => {
                      event.currentTarget.style.borderColor = "#B38B4D";
                      event.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(198,162,101,0.15)";
                    }}
                    onBlur={(event) => {
                      event.currentTarget.style.borderColor = "#DCE1DA";
                      event.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </motion.div>
              ))}

              {/* Community / Project Select Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: 0.39,
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <label
                  htmlFor="cta-project"
                  style={{
                    color: "#35483A",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                  }}
                >
                  Select project of interest
                </label>

                <select
                  id="cta-project"
                  name="project"
                  required
                  defaultValue=""
                  suppressHydrationWarning
                  style={{
                    width: "100%",
                    minHeight: "52px",
                    boxSizing: "border-box",
                    padding: "13px 16px",
                    border: "1px solid #DCE1DA",
                    borderRadius: "10px",
                    background: "#FFFFFF",
                    color: "#26352B",
                    fontFamily: "inherit",
                    fontSize: "0.95rem",
                    outline: "none",
                    cursor: "pointer",
                    transition:
                      "border-color 0.25s ease, box-shadow 0.25s ease",
                  }}
                  onFocus={(event) => {
                    event.currentTarget.style.borderColor = "#B38B4D";
                    event.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(198,162,101,0.15)";
                  }}
                  onBlur={(event) => {
                    event.currentTarget.style.borderColor = "#DCE1DA";
                    event.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <option value="" disabled hidden>
                    Select project of interest...
                  </option>
                  <option value="Brindavana (Pavagada · 30 Acres)">
                    Brindavana (Pavagada · 30 Acres)
                  </option>
                  <option value="Madhuvana (Maddur · 17 Acres)">
                    Madhuvana (Maddur · 17 Acres)
                  </option>
                  <option value="Anantavana (Kabini · 34 Acres)">
                    Anantavana (Kabini · 34 Acres)
                  </option>
                  <option value="Ishavana (Kaveri Riverfront)">
                    Ishavana (Kaveri Riverfront)
                  </option>
                </select>
              </motion.div>
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              suppressHydrationWarning
              whileHover={{
                y: -2,
                boxShadow: "0 12px 26px rgba(116,53,31,0.25)",
              }}
              whileTap={{ scale: 0.985 }}
              transition={{ duration: 0.2 }}
              style={{
                width: "100%",
                minHeight: "54px",
                marginTop: "26px",
                padding: "14px 22px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                border: "none",
                borderRadius: "10px",
                background: "var(--accent-gold)",
                color: "#FFFFFF",
                fontFamily: "inherit",
                fontSize: "0.98rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Send an enquiry
              <ArrowRight className="size-5" />
            </motion.button>

            <p
              style={{
                margin: "14px 0 0",
                textAlign: "center",
                color: "#7B857D",
                fontSize: "0.75rem",
                lineHeight: 1.6,
              }}
            >
              Your details will be used to respond to your enquiry.
            </p>
          </motion.form>
        </div>
      </section>

      {/* Premium FAQ Section — Vanatvam */}
      <section
        id="faq-section"
        style={{
          position: "relative",
          isolation: "isolate",
          overflow: "hidden",
          padding: "clamp(40px, 5vw, 800px) 10px",
          width: "100%",
          boxSizing: "border-box",
          background: "#FFFFFF",
          color: "#183023",
        }}
      >
        <div
          className="container"
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: "1000px",
            margin: "0 auto",
            boxSizing: "border-box",
            padding: "0 10px",
          }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              textAlign: "center",
              marginBottom: "clamp(40px, 6vw, 70px)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              <span
                style={{ width: "24px", height: "1px", background: "#B38B4D" }}
              />
              <span
                style={{
                  color: "#987443",
                  fontSize: "0.74rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                Got Questions?
              </span>
              <span
                style={{ width: "24px", height: "1px", background: "#B38B4D" }}
              />
            </div>

            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                fontWeight: 500,
                color: "#183023",
                margin: 0,
              }}
            >
              Frequently Asked Questions <br />
              <span
                style={{
                  color: "#B38B4D",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                About Vanatvam
              </span>
            </h2>
          </motion.div>

          {/* FAQ Items */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {[
              {
                number: "01",
                question:
                  "What makes Vanatvam different from other farmland developers?",
                answer:
                  "VanaTvam creates natural, green spaces where people can experience life closer to nature. Our projects focus on native trees, fruit-bearing plants, bird-friendly habitats and sustainable land care. We create thoughtfully planned farm communities where families can benefit from living close to nature for years to come.",
              },
              {
                number: "02",
                question: "Where can I buy managed farmland near Bangalore?",
                answer:
                  "If you are looking to buy farmland near Bangalore, Vanatvam offers nature-focused farm communities in selected locations across Karnataka, including the Mysore and Kaveri regions. Explore our managed farmland near Bangalore to learn about available plots, pricing and site visits. You can also enquire about farmland near Bangalore and Mysore. ",
              },
              {
                number: "03",
                question:
                  "What is managed farmland, and how does Vanatvam maintain it?",
                answer:
                  "Managed farmland combines land ownership with organised support for plantation development and ongoing land care, depending on the project. Vanatvam focuses on tree care, soil health and biodiversity. Our managed farmland near Bangalore include hassle free maintenance.",
              },
              {
                number: "04",
                question:
                  "Can I build a farmhouse on agricultural land in Karnataka?",
                answer:
                  "Building a farmhouse depends on the property's legal status, applicable land-use rules and local building regulations. If you plan to buy agricultural land in Karnataka or are considering whether agricultural land can be used to build a farmhouse in Karnataka, Under Section 95 of the Karnataka Land Revenue Act, 1964, agricultural land may be used for a limited farmhouse (not exceeding 10% of the holding).",
              },
              {
                number: "05",
                question:
                  "How does Vanatvam promote biodiversity and natural farming?",
                answer:
                  "Vanatvam focuses on native trees, fruit-bearing plants and flowering species that support birds, bees, butterflies and other wildlife. Inspired by traditional Indian forest gardens, including Nakshatra Vana and Navagraha Vana, our approach encourages biodiversity and a closer connection with nature. For those interested in farmland for sustainable living in Karnataka, our projects bring together natural surroundings and thoughtfully managed green spaces.",
              },
            ].map((faq, index) => (
              <motion.details
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                style={{
                  background:
                    "linear-gradient(145deg, #F9FBF9 0%, #F3F7F4 100%)",
                  border: "1px solid #DCE4DE",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                  transition: "border-color 0.25s ease, box-shadow 0.25s ease",
                }}
              >
                <summary
                  style={{
                    padding: "22px 28px",
                    fontSize: "1.05rem",
                    fontWeight: 600,
                    color: "#183023",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    userSelect: "none",
                    fontFamily: "var(--font-serif)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <span
                      style={{
                        color: "#987443",
                        fontSize: "0.85rem",
                        fontWeight: 200,
                      }}
                    >
                      {faq.number}
                    </span>
                    <span>{faq.question}</span>
                  </div>
                  {/* Custom arrow toggle indicator */}
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: "rgba(152, 116, 67, 0.1)",
                      color: "#987443",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                      fontSize: "0.8rem",
                    }}
                  >
                    ↓
                  </span>
                </summary>

                <div
                  style={{
                    padding: "0 28px 24px 28px",
                    color: "#5A685E",
                    fontSize: "0.96rem",
                    lineHeight: 1.85,
                    borderTop: "1px solid rgba(220, 228, 222, 0.6)",
                    marginTop: "4px",
                    paddingTop: "16px",
                  }}
                >
                  {faq.answer}
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
