"use client";
import { useState, type CSSProperties, type ReactNode } from "react";
import { useLeadForm } from "@/lib/useLeadForm";
import LeadFormStatus from "@/components/LeadFormStatus";
import { riseStyle } from "@/lib/rise";
import {
  m as motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import Link from "@/components/ui/AppLink";
import BrochureModal from "@/components/premium/LazyBrochureModal";
import StickyMasterPlanGallery from "@/components/premium/StickyMasterPlanGallery";
import { ArrowRight, ArrowUpRight, Droplets, Leaf, MapPin, Mountain, PawPrint, Ship, Trees, Waves } from "lucide-react";
import { responsiveImg } from "@/lib/responsiveImage";
import PortraitSource from "@/components/ui/PortraitSource";
import { preloadHero } from "@/lib/preloadHero";

const EASE = [0.2, 0.9, 0.2, 1] as const;

/* ---------- Reusable animation helpers ---------- */
const GOLD = "var(--accent-gold)";
const FOREST = "var(--bg-dark-forest)";

function Words({
  text,
  delay = 0,
  style,
}: {
  text: string;
  delay?: number;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion() ?? false;
  const centered = style?.textAlign === "center";
  return (
    <h2
      aria-label={text}
      style={{
        ...style,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: centered ? "center" : "flex-start",
        columnGap: "0.28em",
      }}
    >
      {text.split(" ").map((w, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            display: "inline-block",
            overflow: "hidden",
            paddingBottom: "0.14em",
          }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            initial={reduce ? false : { y: "110%", rotate: 4 }}
            whileInView={{ y: "0%", rotate: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: delay + i * 0.07, ease: EASE }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

function Reveal({
  children,
  delay = 0,
  x = 0,
  y = 36,
  style,
}: {
  children: ReactNode;
  delay?: number;
  x?: number;
  y?: number;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion() ?? false;
  return (
    <motion.div
      style={style}
      initial={reduce ? false : { opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function Kicker({
  children,
  color = GOLD,
  center = false,
}: {
  children: ReactNode;
  color?: string;
  center?: boolean;
}) {
  return (
    <Reveal
      y={16}
      style={{ marginBottom: "20px", textAlign: center ? "center" : "left" }}
    >
      <span
        style={{
          color,
          fontSize: "0.85rem",
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        {children}
      </span>
    </Reveal>
  );
}

export default function Anantavana() {
  const lead = useLeadForm("anantavana-form");
  preloadHero("/assets/project-images/Ananthavana/hero-image-2.webp");
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], ["0%", "15%"], {
    clamp: true,
  });
  const heroScale = useTransform(scrollY, [0, 1000], [1, 1.15], {
    clamp: true,
  });
  const reduce = useReducedMotion() ?? false;

  return (
    <>
      <Navigation />

      {/* ================= HERO (animated) ================= */}
      <section
        className="hero"
        id="hero"
        style={{
          height: "100vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Background: parallax wrapper → Ken Burns drift → image + overlay */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            top: "-15%",
            height: "130%",
            y: heroY,
            scale: heroScale,
            transformOrigin: "center center",
          }}
        >
          <motion.div
            style={{ position: "absolute", inset: 0 }}
            animate={
              reduce
                ? undefined
                : { scale: [1, 1.18], x: ["0%", "-1.3%"], y: ["0%", "1%"] }
            }
            transition={{
              duration: 28,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <picture>
              <PortraitSource src="/assets/project-images/Ananthavana/hero-image-2.webp" />
              <img
                {...responsiveImg("/assets/project-images/Ananthavana/hero-image-2.webp")}
                alt="ANANTAVANA"
                fetchPriority="high"
                loading="eager"
                decoding="sync"
                width={1920}
                height={1080}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </picture>
          </motion.div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.45) 100%)",
            }}
          />
        </motion.div>

        <div
          className="container relative hero-container"
          style={{
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            height: "100%",
            paddingTop: "80px",
            paddingBottom: "clamp(8px, 1vh, 14px)",
            paddingLeft: "24px",
            paddingRight: "24px",
          }}
        >
          <div
            className="hero-content"
            style={{ maxWidth: "800px" }}
          >
            <span
              className="hero-badge vt-rise"
              style={riseStyle(0, { y: "20px" })}
            >
              Nature-First Farm Communities
            </span>

            <h1
              className="hero-heading vt-rise"
              style={riseStyle(0.2, { y: "30px" })}
            >
              ANANTAVANA
            </h1>

            <p
              className="hero-tagline vt-rise"
              style={riseStyle(0.4, { y: "30px" })}
            >
              An extensive eco-conservation project to restore biodiversity.
            </p>

            <div
              className="hero-cta-group vt-rise"
              style={riseStyle(0.6, { y: "30px" })}
            >
              <button
                type="button"
                onClick={() => setIsBrochureOpen(true)}
                className="btn-pill btn-pill-gold hero-cta-btn"
                style={{
                  boxShadow: "0 8px 30px rgba(198, 162, 101, 0.4)",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  backgroundColor: "var(--accent-gold)",
                  color: "#0d0d0d",
                }}
              >
                Download brochure <span aria-hidden="true">↓</span>
              </button>
              <Link
                href="/contact"
                className="hero-secondary-link"
              >
                Plan a site visit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= THE ANANTAVANA IDEA ================= */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "clamp(36px, 4.5vh, 56px) 0",
          background: "var(--bg-cream)",
        }}
      >
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "70px",
              alignItems: "center",
            }}
          >
            <div style={{ flex: "1.1 1 420px" }}>
              <Kicker>The Anantavana</Kicker>
              <Words
                text="Kabini – The land of spectacular landscapes."
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2.2rem, 4.2vw, 4rem)",
                  lineHeight: 1.1,
                  color: FOREST,
                  marginBottom: "28px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                  color: "var(--text-dark)",
                  fontSize: "1.08rem",
                  lineHeight: 1.8,
                  textAlign: "justify",
                }}
              >
                <Reveal delay={0.1}>
                  <p style={{ margin: 0 }}>
                    The rustle of leaves blowing in the wind, the deep silence of the forest, the chirping of birds and the calmness of River Kabini, all whisper the breathtaking beauty of this most wonderful land. Everyone, from a wildlife enthusiast to the nature lover, and the average citizen has a reason to love Kabini, known as one of the country’s richest biodiversity spots.
                  </p>
                </Reveal>
                <Reveal delay={0.2}>
                  <p style={{ margin: 0 }}>
                    Anantavana is a sustainable natural reforestation project in Kabini for nature lovers. Here, VanaTvam in association with Indus Herbs has developed a niche community of land owners who understand, appreciate, and consciously participate in sustaining the unique biosphere of Kabini. This limited edition project is a personal nature retreat that one can plug into to recharge the body and spirit! 
                  </p>
                </Reveal>
                <Reveal delay={0.3}>
                  <p style={{ margin: 0 }}>
                    Native trees, natural ponds, herbal gardens and thoughtfully
                    created places to pause bring a sense of calm to the
                    surroundings. Walking paths and spaces for quiet reflection
                    encourage residents to spend more time outdoors and
                    appreciate the rhythms of the natural world.
                  </p>
                </Reveal>
                <Reveal delay={0.3}>
                  <p style={{ margin: 0 }}>
                    At its heart, Anantavana is about more than a place to stay.
                    It is about conscious community, natural farming and a
                    deeper appreciation of the living landscape.
                  </p>
                </Reveal>
                <Reveal delay={0.3}>
                  <p style={{ margin: 0 }}>
                    The wider Kabini region is renowned for its birdlife and
                    diverse mammals, adding to the natural character of the
                    setting. This regional biodiversity is part of the larger
                    landscape story, rather than a verified species count for
                    the Anantavana property itself.
                  </p>
                </Reveal>
              </div>
              
            </div>

            <div
              style={{
                flex: "1 1 340px",
                width: "100%",
                maxWidth: "100%",
                minWidth: 0,
                position: "relative",
              }}
            >
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: EASE }}
                style={{
                  borderRadius: "28px",
                  overflow: "hidden",
                  aspectRatio: "4 / 5",
                  boxShadow: "0 30px 60px rgba(18,34,23,0.18)",
                  border: "1px solid rgba(198, 162, 101, 0.25)",
                  position: "relative",
                  width: "100%",
                }}
              >
                <img
                  {...responsiveImg("/assets/project-images/Ananthavana/golden-treehouse-garden-retreat-1.webp", "(max-width: 768px) 92vw, 44vw")}
                  alt="Native forest landscape at Anantavana"
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={1000}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                {/* Floating Acreage Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
                  style={{
                    position: "absolute",
                    left: 14,
                    bottom: 24,
                    background: FOREST,
                    color: "#FFF",
                    padding: "16px 22px",
                    borderRadius: "18px",
                    border: "1px solid rgba(198, 162, 101, 0.35)",
                    boxShadow: "0 20px 40px rgba(18,34,23,0.3)",
                    zIndex: 3,
                  }}
                >
                  <strong
                    style={{
                      display: "block",
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.8rem",
                      lineHeight: 1,
                      marginBottom: "4px",
                    }}
                  >
                    34 Acres
                  </strong>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: GOLD,
                      fontWeight: 600,
                    }}
                  >
                    Near Kabini
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= THE LAND IN NUMBERS ================= */}
      <section
        style={{
          padding: "clamp(28px, 3.5vh, 44px) 0",
          background: FOREST,
        }}
      >
        <div className="container">
          <div
            className="anantavana-stats-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
              gap: "clamp(16px, 2.5vw, 24px)",
              alignItems: "start",
            }}
          >
            {[
              {
                value: "34",
                suffix: "acres",
                label: "Project area",
              },
              {
                value: "80%+",
                suffix: "*",
                label: "Forest cover",
              },
              {
                value: "250+",
                suffix: "*",
                label: "Native tree varieties",
              },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                className={i === 2 ? "anantavana-stat-last" : undefined}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.65,
                  delay: reduce ? 0 : i * 0.12,
                  ease: EASE,
                }}
                style={{
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "center",
                    gap: 8,
                    flexWrap: "wrap",
                    marginBottom: 6,
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(2rem, 3.5vw, 3rem)",
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  <span
                    style={{
                      color: GOLD,
                    }}
                  >
                    {s.value}
                  </span>
                  <span
                    style={{
                      fontSize: s.suffix === "*" ? "0.5em" : "0.3em",
                      fontWeight: 600,
                      color: GOLD,
                      letterSpacing: s.suffix === "*" ? 0 : "0.14em",
                      textTransform: "uppercase",
                    }}
                  >
                    {s.suffix}
                  </span>
                </div>

                <h3
                  style={{
                    maxWidth: 280,
                    margin: "0 auto",
                    color: "rgba(255,255,255,0.88)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "clamp(1.92rem, 2.3vw, 2.05rem)",
                    fontWeight: 400,
                    lineHeight: 1.55,
                  }}
                >
                  {s.label}
                </h3>
              </motion.div>
            ))}
          </div>


        </div>
      </section>

       

      

   {/* ================= CONCEPT MASTER PLAN ================= */}
<section
  id="master-plan"
  style={{
    padding: "clamp(36px, 4.5vh, 56px) 0",
    background: "#F4F1EA",
    position: "relative",
    overflow: "clip", // "hidden" would break position: sticky
  }}
>
  <div
    className="container"
    style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}
  >
    {/* CENTERED HEADING */}
    <div style={{ textAlign: "center", marginBottom: "clamp(40px, 6vh, 64px)" }}>
      <motion.span
        initial={reduce ? false : { opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          color: "var(--accent-gold, #C6A265)",
          fontSize: "0.8rem",
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          fontWeight: 700,
          display: "block",
          marginBottom: "14px",
        }}
      >
        Master Plan
      </motion.span>

      <motion.h2
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
          color: FOREST,
          lineHeight: 1.1,
          letterSpacing: "-0.025em",
          fontWeight: 600,
          margin: "0 auto 18px",
          textAlign: "center",
        }}
      >
        Concept Layout
        <br />
        <span style={{ fontStyle: "italic", fontWeight: 400 }}>
          & Master Plan
        </span>
      </motion.h2>

      <motion.p
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          fontSize: "clamp(1rem, 1.1vw, 1.1rem)",
          color: "var(--text-muted)",
          lineHeight: 1.75,
          maxWidth: "720px",
          margin: "0 auto",
        }}
      >
        Explore the 34-acre master plan featuring farm parcels starting from
        12,000+ sq. ft., tree-lined roads, natural ponds, heritage cottages,
        and tree house retreats near Kabini.
      </motion.p>
    </div>

    {/* MAIN GRID: Left = scrolling stacked cards, Right = sticky master plan */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
        gap: "clamp(28px, 4vw, 60px)",
        alignItems: "start",
        position: "relative",
      }}
    >
      {/* LEFT COLUMN: Overlapping Scrolling Amenity Photo Cards */}
      <StickyMasterPlanGallery
        eyebrow="Master Plan Highlights"
        title="Common Amenities (A – F)"
        items={[
          {
            id: "entrance",
            name: "A – Entrance Gateway",
            img: "/assets/project-images/Ananthavana/Enterance.webp",
          },
          {
            id: "herbal",
            name: "B – Herbal & Healing Flora",
            img: "/assets/project-images/Ananthavana/Herbal.webp",
          },
          {
            id: "cottage",
            name: "C – Community Cottage",
            img: "/assets/project-images/Ananthavana/Common.webp",
          },
          {
            id: "ponds",
            name: "D – Natural Ponds",
            img: "/assets/project-images/Ananthavana/NaturalPonds.webp",
          },
          {
            id: "tree-house",
            name: "E – Tree House Deck",
            img: "/assets/project-images/Ananthavana/av-tree-house.webp",
          },
          {
            id: "roads",
            name: "F – Broad Internal Roads",
            img: "/assets/project-images/Ananthavana/Tree-Lined.webp",
          },
        ]}
      />

      {/* RIGHT COLUMN: Sticky Master Plan Image */}
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
        style={{
          position: "sticky",
          top: "90px",
          width: "100%",
        }}
      >
        <div
          style={{
            borderRadius: "20px",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <img
            src="/assets/images/c-1.webp"
            alt="Anantavana Concept Master Plan Layout"
            loading="lazy"
            decoding="async"
            width={1400}
            height={900}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "clamp(550px, 88vh, 960px)",
              objectFit: "contain",
              display: "block",
              borderRadius: "20px",
              boxShadow: "0 20px 50px rgba(18, 34, 23, 0.15)",
            }}
          />
        </div>

        <a
          href="https://photos.app.goo.gl/dJaNg8zYHyjvxHnN6"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pill btn-pill-gold"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginTop: "18px",
            backgroundColor: "var(--accent-gold)",
            color: "#0d0d0d",
            fontWeight: 600,
            fontSize: "0.95rem",
            width: "100%",
          }}
        >
          Anantavana Gallery{" "}
          <ArrowUpRight size={18} strokeWidth={2} aria-hidden="true" />
        </a>
      </motion.div>
    </div>
  </div>
</section>
      {/* ================= NEARBY DESTINATIONS ================= */}
      <section
        style={{
          position: "relative",
          isolation: "isolate",
          padding: "clamp(36px, 4.5vh, 56px) 0",
          background: "linear-gradient(180deg, #FBF9F5 0%, #F4F1E8 100%)",
          overflow: "hidden",
        }}
      >
        {/* Soft background ambient glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "20%",
            left: "-10%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(198,162,101,0.08), transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "10%",
            right: "-10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(24,48,35,0.05), transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <style>{`
          .av-nearby-grid {
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
            gap: clamp(28px, 4.5vw, 56px);
            align-items: stretch;
            max-width: 1240px;
            margin: 0 auto;
          }
          .av-nearby-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            padding: 16px 20px;
            border: 1px solid rgba(18, 34, 23, 0.08);
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(12px);
            box-shadow: 0 4px 18px rgba(18, 34, 23, 0.03);
            transition: all 300ms cubic-bezier(0.2, 0.9, 0.2, 1);
            position: relative;
            overflow: hidden;
          }
          .av-nearby-card::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 3px;
            background: var(--accent-gold);
            opacity: 0;
            transition: opacity 300ms ease;
          }
          .av-nearby-card:hover {
            transform: translateX(6px);
            border-color: rgba(198, 162, 101, 0.4);
            background: #FFFFFF;
            box-shadow: 0 12px 32px rgba(18, 34, 23, 0.08);
          }
          .av-nearby-card:hover::before {
            opacity: 1;
          }
          .av-nearby-card:hover .av-nearby-icon {
            background: var(--accent-gold);
            color: #122217;
            transform: scale(1.05);
          }
          .av-nearby-icon {
            display: grid;
            width: 48px;
            height: 48px;
            place-items: center;
            border-radius: 14px;
            color: var(--bg-dark-forest);
            background: rgba(198, 162, 101, 0.15);
            flex-shrink: 0;
            transition: all 300ms ease;
          }
          .av-nearby-name {
            color: var(--bg-dark-forest);
            font-family: var(--font-serif);
            font-size: clamp(1.05rem, 1.4vw, 1.25rem);
            font-weight: 600;
            line-height: 1.25;
            margin-bottom: 2px;
          }
          .av-nearby-desc {
            color: var(--text-muted);
            font-size: 0.8rem;
            line-height: 1.3;
            margin: 0;
          }
          .av-nearby-badge {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            flex-shrink: 0;
          }
          .av-nearby-distance {
            display: flex;
            align-items: baseline;
            gap: 3px;
            color: var(--bg-dark-forest);
          }
          .av-nearby-distance strong {
            font-family: var(--font-serif);
            font-size: 1.4rem;
            font-weight: 700;
            color: var(--bg-dark-forest);
          }
          .av-nearby-distance span {
            color: var(--text-muted);
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.05em;
          }
          .av-nearby-time {
            font-size: 0.74rem;
            color: #987443;
            font-weight: 600;
            background: rgba(198, 162, 101, 0.12);
            padding: 2px 8px;
            border-radius: 20px;
            margin-top: 4px;
            white-space: nowrap;
          }
          .av-nearby-map {
            position: relative;
            min-height: 580px;
            height: 100%;
            overflow: hidden;
            isolation: isolate;
            border: 1px solid rgba(198, 162, 101, 0.4);
            border-radius: 28px;
            background: #E5E8E0;
            box-shadow: 0 24px 60px rgba(18, 34, 23, 0.12);
          }
          .av-nearby-map iframe {
            position: absolute;
            inset: -220px 0 0 0; /* pushes Google's own info card out of view; the custom button is used instead */
            width: 100% !important;
            height: calc(100% + 220px) !important;
            aspect-ratio: auto !important;
            border: 0;
          }
          .av-nearby-map-header {
            position: absolute;
            top: 20px;
            left: 20px;
            z-index: 2;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 18px;
            border-radius: 999px;
            background: rgba(18, 34, 23, 0.88);
            border: 1px solid rgba(198, 162, 101, 0.35);
            backdrop-filter: blur(12px);
            color: #FFF;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          }
          .av-nearby-map-header .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #B38B4D;
            box-shadow: 0 0 10px #B38B4D;
            animation: pulse-dot 2s infinite;
          }
          @keyframes pulse-dot {
            0% { transform: scale(0.95); opacity: 0.8; }
            50% { transform: scale(1.3); opacity: 1; }
            100% { transform: scale(0.95); opacity: 0.8; }
          }
          .av-nearby-map-link {
            position: absolute;
            top: 20px;
            right: 20px;
            z-index: 2;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 11px 18px;
            border: 1px solid rgba(198, 162, 101, 0.5);
            border-radius: 999px;
            color: #122217;
            background: #F3E3C0;
            box-shadow: 0 8px 24px rgba(18, 34, 23, 0.16);
            font-size: 0.8rem;
            font-weight: 700;
            letter-spacing: 0.04em;
            transition: all 250ms ease;
            text-decoration: none;
          }
          .av-nearby-map-link:hover {
            transform: translateY(-2px);
            background: #FFFFFF;
            box-shadow: 0 12px 30px rgba(18, 34, 23, 0.22);
          }
          .av-nearby-map-label {
            position: absolute;
            bottom: 20px;
            left: 20px;
            right: 20px;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            border: 1px solid rgba(198, 162, 101, 0.35);
            border-radius: 20px;
            color: #FFF;
            background: rgba(18, 34, 23, 0.92);
            box-shadow: 0 12px 32px rgba(18, 34, 23, 0.25);
            backdrop-filter: blur(12px);
          }
          .av-nearby-map-label strong {
            display: block;
            color: #F3E3C0;
            font-family: var(--font-serif);
            font-size: 1.15rem;
            line-height: 1.2;
          }
          .av-nearby-map-label span {
            display: block;
            margin-top: 3px;
            color: rgba(255, 255, 255, 0.75);
            font-size: 0.8rem;
          }
          @media (max-width: 900px) {
            .av-nearby-grid {
              grid-template-columns: minmax(0, 1fr);
            }
            .av-nearby-map {
              min-height: 480px;
            }
          }
          @media (max-width: 520px) {
            .av-nearby-card {
              padding: 14px 16px;
            }
            .av-nearby-icon {
              width: 42px;
              height: 42px;
            }
            .av-nearby-map {
              min-height: 380px;
              height: 380px;
              border-radius: 20px;
            }
            .av-nearby-map-header {
              top: 14px;
              left: 14px;
              padding: 8px 14px;
              font-size: 0.75rem;
            }
            .av-nearby-map-link {
              top: 56px;
              left: 14px;
              right: auto;
              padding: 8px 14px;
              font-size: 0.75rem;
            }
            .av-nearby-map-label {
              bottom: 14px;
              left: 14px;
              right: 14px;
              padding: 12px 16px;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .av-nearby-card, .av-nearby-map-link {
              transition: none;
            }
          }
        `}</style>

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{
              maxWidth: 820,
              margin: "0 auto clamp(36px, 5vw, 56px)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "14px",
              }}
            >
              <span
                style={{
                  width: "24px",
                  height: "1px",
                  background: "var(--accent-gold)",
                }}
              />
              <span
                style={{
                  color: "var(--accent-gold)",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                Nearby destinations
              </span>
              <span
                style={{
                  width: "24px",
                  height: "1px",
                  background: "var(--accent-gold)",
                }}
              />
            </div>

            <h2
              style={{
                margin: 0,
                color: "var(--bg-dark-forest)",
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
                fontWeight: 500,
                letterSpacing: "-0.035em",
                lineHeight: 1.12,
                textWrap: "balance",
              }}
            >
              Beautifully located.
              <br />
              <span style={{ color: "#987443", fontStyle: "italic", fontWeight: 400 }}>
                Conveniently connected
              </span>
            </h2>
          </motion.div>

          <div className="av-nearby-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                {
                  name: "Bheemanakolli",
                  desc: "Scenic riverfront & backwaters",
                  km: 6,
                  time: "~10 mins",
                  icon: Waves,
                },
                {
                  name: "Boating in Gandatoor",
                  desc: "Tranquil boat rides & water views",
                  km: 7,
                  time: "~12 mins",
                  icon: Ship,
                },
                {
                  name: "Kabini Dam",
                  desc: "Historic reservoir & bird sanctuary",
                  km: 11,
                  time: "~18 mins",
                  icon: Droplets,
                },
                {
                  name: "Kakankote Safari",
                  desc: "Famous elephant & jungle safari",
                  km: 27,
                  time: "~35 mins",
                  icon: PawPrint,
                },
                {
                  name: " Mysore",
                  desc: " Royal heritage city & palaces",
                  km: 80,
                  time: "~1.5 hrs",
                  icon: Trees,
                },
                {
                  name: "Bangalore",
                  desc: " Cosmopolitan city & tech hub",
                  km: 220,
                  time: "~4 hrs",
                  icon: Mountain,
                },
              ].map(({ name, desc, km, time, icon: Icon }, i) => (
                <motion.div
                  key={name}
                  className="av-nearby-card"
                  initial={reduce ? false : { opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    duration: 0.5,
                    delay: reduce ? 0 : i * 0.08,
                    ease: EASE,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span className="av-nearby-icon" aria-hidden="true">
                      <Icon size={22} strokeWidth={1.8} />
                    </span>
                    <div>
                      <h3 className="av-nearby-name">{name}</h3>
                      <p className="av-nearby-desc">{desc}</p>
                    </div>
                  </div>

                  <div className="av-nearby-badge">
                    <div className="av-nearby-distance">
                      <strong>{km}</strong>
                      <span>km</span>
                    </div>
                    <span className="av-nearby-time">{time}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="av-nearby-map"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: reduce ? 0 : 0.15, ease: EASE }}
            >
              <div className="av-nearby-map-header">
                <span className="dot" aria-hidden="true" />
                <span style={{ fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.03em" }}>
                  Anantavana Location
                </span>
              </div>

              <iframe
                title="Google Maps showing Anantavana near Kabini"
                src="https://www.google.com/maps?q=AnantaVana,+N+Begur+Rd,+Katwalu,+Begurjungle,+Karnataka+571116&ll=11.9128648,76.3000445&z=13&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />

              <a
                className="av-nearby-map-link"
                href="https://www.google.com/maps/search/?api=1&query=AnantaVana%2C%20N%20Begur%20Rd%2C%20Katwalu%2C%20Begurjungle%2C%20Karnataka%20571116"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps
                <ArrowUpRight size={16} strokeWidth={2.2} aria-hidden="true" />
              </a>

              <div className="av-nearby-map-label">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      background: "rgba(198,162,101,0.18)",
                      color: "#F3E3C0",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <MapPin size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <strong>Anantavana Sanctuary</strong>
                    <span>Near Kabini, Mysore Region, Karnataka</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
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
                Your Kabini Sanctuary Awaits
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
              Experience{" "}
              <span
                style={{
                  display: "inline-block",
                  color: "#B38B4D",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                Anantavana.
              </span>
              <br />A space to live with nature.
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
              Discover 34 acres of forest-inspired managed farmland near Kabini. Nurture your connection with nature through native tree canopies, organic farming, natural ponds, and a conscious community. Schedule a site visit or connect with our team to explore available farmland plots.
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
                  Anantavana at Kabini
                </div>
                <div
                  style={{
                    color: "#727E74",
                    fontSize: "0.86rem",
                    letterSpacing: "0.035em",
                  }}
                >
                  34 Acres · Managed Natural Farmland
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Premium larger contact form */}

          <motion.form
            initial={{ opacity: 0, y: 25, scale: 0.99 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.8,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            onSubmit={lead.onSubmit}
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
                Plan Your Visit
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
                Enquire About Anantavana.
              </h3>

              <p
                style={{
                  color: "#6B776D",
                  fontSize: "0.92rem",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                Fill out your details below to receive plot details, brochure &amp; site visit availability.
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
                  defaultValue="Anantavana (Kabini · 34 Acres)"
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
              disabled={lead.status === "submitting"}
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
              Request Anantavana Details
              <ArrowRight className="size-5" />
            </motion.button>

            <LeadFormStatus status={lead.status} />

            <p
              style={{
                margin: "14px 0 0",
                textAlign: "center",
                color: "#7B857D",
                fontSize: "0.75rem",
                lineHeight: 1.6,
              }}
            >
              Your information is private and will only be used to answer your enquiry.
            </p>
          </motion.form>
        </div>
      </section>

      {/* Premium FAQ Section — VanaTvam */}
      <section
        id="faq-section"
        style={{
          position: "relative",
          isolation: "isolate",
          overflow: "hidden",
          padding: "clamp(28px, 3.5vw, 44px) 10px",
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
                About Anantavana
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
                question: "Where is Anantavana located?",
                answer: (
                  <>
                    N Begur Rd, Katwalu, Begurjungle, Karnataka 571116
                    <br />
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=AnantaVana%2C%20N%20Begur%20Rd%2C%20Katwalu%2C%20Begurjungle%2C%20Karnataka%20571116"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#B38B4D",
                        textDecoration: "underline",
                        marginTop: "6px",
                        display: "inline-block",
                      }}
                    >
                      Open Anantavana Location in Google Maps ↗
                    </a>
                  </>
                ),
              },
              {
                number: "02",
                question: "What is Anantavana at Kabini?",
                answer:
                  "Anantavana is a nature-oriented managed farmland community by VanaTvam, envisioned as a forest-inspired retreat rooted in sustainable land management, biodiversity, and a deeper connection with nature. Designed to offer a peaceful escape into the natural world, the community brings together organic farming, green landscapes, and nature-conscious living. The project features 10,000+ trees of 250+ native and rare varieties, internal roads, common areas, themed gardens, water bodies, and a cottage.",
              },
              {
                number: "03",
                question:
                  "What are the available plot sizes at Anantavana managed farmland near Kabini?",
                answer: (
                  <>
                    Plot sizes at Anantavana, a natural managed farmland
                    community by VanaTvam near Kabini, Karnataka, start from{" "}
                    <strong>12,000 sq. ft.</strong> Designed for nature-inspired
                    living and organic farming, Anantavana offers a peaceful,
                    forest-style retreat surrounded by natural landscapes. Contact
                    the VanaTvam team for the latest farmland plot availability,
                    exact plot measurements, and pricing.
                  </>
                ),
              },
              {
                number: "04",
                question:
                  "What makes Anantavana a unique managed farmland community near Kabini?",
                answer:
                  "Anantavana by VanaTvam is envisioned as a nature-inspired farmland community that combines organic farming, biodiversity, and forest-style retreat living. Beyond agricultural plots, the proposed master plan includes common spaces, themed garden areas, and a water body, creating opportunities to connect with nature. Contact the VanaTvam team to learn more about the project and confirm which features are completed or proposed.",
              },
              {
                number: "05",
                question: "What amenities are planned at Anantavana?",
                answer:
                  "The project brief highlights over 20% of land reserved for common spaces, tree-lined roads and native landscapes, natural ponds and biodiversity spaces, pergolas, heritage cottages and mud houses, a tree house, herbal gardens inspired by ancient wisdom, and fire-camp and outdoor tent spaces.",
              },
              {
                number: "06",
                question:
                  "Will I earn guaranteed income from my Anantavana plot?",
                answer:
                  "Anantavana is in an Eco-Sensitive Zone (ESZ) and is governed by the ESZ norms. No commercial activity is permitted within the ESZ. Consider the land for its ownership and nature-oriented experience rather than assuming assured returns.",
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

    

      <BrochureModal
        isOpen={isBrochureOpen}
        onClose={() => setIsBrochureOpen(false)}
        projectName="Anantavana"
        brochureUrl="/assets/project-images/AnantaVana-Brochure.pdf"
      />

      <Footer />
    </>
  );
}
