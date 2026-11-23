"use client";
import Footer from "@/app/components/Footer";
import Navigation from "@/app/components/Navigation";
import Magnetic from "@/components/premium/Magnetic";
import RevealText from "@/components/premium/RevealText";
import Link from "@/components/ui/AppLink";
import PortraitSource from "@/components/ui/PortraitSource";
import { preloadHero } from "@/lib/preloadHero";
import { responsiveImg } from "@/lib/responsiveImage";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const STORY_SECTIONS = [
  "For most of human history, we lived close to the land, surrounded by trees, birds and open spaces. It is only in the last century, with rapid urbanisation, that many of us have drifted away from this natural connection. Yet, whenever we step into a forest, walk among trees or spend time in the countryside, something changes. We feel lighter, calmer and more at ease. It feels familiar, almost as if we are returning to something we have always known.",
  "These thoughts led us to establish VanaTvam in March 2022.",
  "Our dream was never simply to develop farmland. We wanted to nurture living landscapes, encourage biodiversity, revive traditional connections with nature and create communities where people could find space to breathe, reconnect and belong.",

];

export default function About() {
  preloadHero("/assets/project-images/Brindavana/sunny-tropical-banana-orchard.webp");
  return (
    <>
      <Navigation />

      {/* Premium Hero Section */}
      <section
        className="hero"
        style={{
          height: "85vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ scale: 1.15, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
          style={{ position: "absolute", inset: 0, zIndex: 0 }}
        >
          <picture>
            <PortraitSource src="/assets/project-images/Brindavana/sunny-tropical-banana-orchard.webp" />
            <img
              {...responsiveImg("/assets/project-images/Brindavana/sunny-tropical-banana-orchard.webp")}
              alt="VanaTvam Vision"
              fetchPriority="high"
              loading="eager"
              decoding="sync"
              width={1920}
              height={1080}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </picture>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(18, 34, 23, 0.4) 0%, rgba(18, 34, 23, 0.88) 100%)",
            }}
          />
        </motion.div>

        <div
          className="container relative"
          style={{ zIndex: 1, textAlign: "center", paddingTop: "80px" }}
        >

          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(3.5rem, 7vw, 6rem)",
              color: "#FFFFFF",
              lineHeight: 1.05,
              marginBottom: "30px",
              letterSpacing: "-0.02em",
            }}
          >
            <RevealText immediate>A Vision Rooted</RevealText>
            <br />
            <RevealText
              immediate
              delay={0.15}
              style={{ fontStyle: "italic", color: "var(--accent-gold)" }}
            >
              in Nature.
            </RevealText>
          </h1>

        </div>
      </section>




      {/* Personal Journey Section */}
      <section
        style={{
          padding: "clamp(80px, 10vh, 120px) 0",
          background: "var(--bg-cream)",
          color: "var(--text-dark)",
          overflow: "hidden",
        }}
      >
        <div
          className="container about-story-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(360px, 1.05fr)",
            alignItems: "center",
            gap: "clamp(36px, 6vw, 80px)",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
              style={{ marginBottom: "32px" }}
            >
              <span
                style={{
                  display: "block",
                  color: "var(--accent-gold)",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                The Story of VanaTvam
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2.8rem, 4vw, 3.8rem)",
                  color: "var(--bg-dark-forest)",
                  lineHeight: 1.12,
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                The Story of VanaTvam —{" "}
                <span style={{ color: "var(--accent-gold)", fontStyle: "italic" }}>
                  A Personal Journey Back to Nature
                </span>
              </h2>
            </motion.div>

            <div style={{ display: "grid", gap: "24px" }}>
              {STORY_SECTIONS.map((paragraph, index) => (
                <motion.p
                  key={paragraph}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.7,
                    delay: Math.min(index * 0.04, 0.2),
                    ease: [0.25, 1, 0.5, 1],
                  }}
                  style={{
                    fontSize: "1.2rem",
                    color: "var(--text-dark)",
                    lineHeight: 1.8,
                    margin: 0,
                    fontWeight: 300,
                  }}
                >
                  {paragraph}
                </motion.p>

              ))}
              <Magnetic strength={0.25}>
                <Link
                  href="/blog/the-big-picture-of-vanatvam"
                  className="btn-pill btn-pill-gold"
                  style={{
                    padding: "14px 32px",
                    fontSize: "1rem",
                    fontWeight: 700,
                  }}
                >
                  Read Our Full Story <ArrowRight className="size-4" />
                </Link>
              </Magnetic>
            </div>

          </div>

          <motion.div
            className="about-story-image"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
          >
            <div className="about-story-photo">
              <motion.img
                whileHover={{ scale: 1.025 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                {...responsiveImg("/assets/images/ourstory.webp", "(max-width: 768px) 90vw, 46vw")}
                alt="A family walking through a green landscape at sunrise"
                loading="lazy"
                decoding="async"
                width={800}
                height={600}
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </div>

          </motion.div>
        </div>
        <style jsx>{`
          .about-story-image {
            min-width: 0;
            position: relative;
            width: 100%;
            height: clamp(420px, 58vh, 560px);
            overflow: hidden;
            border-radius: 26px;
            border: 1px solid rgba(198, 162, 101, 0.55);
            box-shadow: 0 32px 80px rgba(18, 34, 23, 0.24);
            background: var(--bg-dark-forest);
          }

          .about-story-photo {
            width: 100%;
            height: 100%;
            overflow: hidden;
          }

          @media (max-width: 850px) {
            .about-story-layout {
              grid-template-columns: minmax(0, 1fr) !important;
              gap: 40px !important;
            }

            .about-story-image {
              position: relative !important;
              top: auto !important;
              width: 100% !important;
              height: clamp(260px, 41vh, 340px) !important;
              min-height: 0 !important;
              max-width: 100% !important;
              margin: 0 auto;
            }
              max-width: 100% !important;
              margin: 0 auto;
            }

            .about-story-photo {
              position: relative !important;
              width: 100% !important;
              height: 100% !important;
              border-radius: 20px !important;
            }

            .about-story-callout {
              left: 0 !important;
              bottom: -48px !important;
              width: calc(100% - 24px) !important;
            }
          }

          @media (max-width: 480px) {
            .about-story-image {
              height: 250px !important;
              min-height: 0 !important;
            }
          }
        `}</style>
      </section>

      {/* Founder Leadership Section */}
      <section
        style={{
          padding: "clamp(90px, 12vh, 130px) 0",
          background: "#122217",
          color: "#FFFFFF",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "80px",
              alignItems: "center",
            }}
          >
            {/* Founder Visual Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ flex: "1 1 420px", position: "relative" }}
            >
              <div
                style={{
                  borderRadius: "28px",

                  boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <img
                  {...responsiveImg("/assets/images/founder.webp", "(max-width: 768px) 88vw, 42vw")}
                  alt="Founder leadership and land care"
                  loading="lazy"
                  decoding="async"
                  width={600}
                  height={800}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Floating Quote Badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-25px",
                  right: "-15px",
                  background: "rgba(18,34,23,0.92)",
                  backdropFilter: "blur(16px)",
                  padding: "28px 32px",
                  borderRadius: "20px",
                  border: "1px solid rgba(198,162,101,0.4)",
                  maxWidth: "320px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "2rem",
                    color: "var(--accent-gold)",
                    lineHeight: 0.5,
                    display: "block",
                    marginBottom: "14px",
                  }}
                >
                  &ldquo;
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.18rem",
                    fontStyle: "italic",
                    margin: 0,
                    lineHeight: 1.5,
                    color: "#FFFFFF",
                  }}
                >
                  When nature is nurtured, life flourishes in its purest form.
                </p>
                <div
                  style={{
                    marginTop: "12px",
                    fontSize: "0.8rem",
                    color: "var(--accent-gold)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  — Deepak Kasthuri
                </div>
              </div>
            </motion.div>

            {/* Founder Bio Column */}
            <div style={{ flex: "1 1 500px" }}>
              <span
                style={{
                  color: "var(--accent-gold)",
                  fontSize: "0.82rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: "18px",
                }}
              >
                FOUNDER &amp; MANAGING DIRECTOR
              </span>

              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2.6rem, 5vw, 4rem)",
                  color: "#FFFFFF",
                  lineHeight: 1.12,
                  letterSpacing: "-0.02em",
                  fontWeight: 600,
                  marginBottom: "20px",
                }}
              >
                Deepak Kasthuri
              </h2>

              <p
                style={{
                  fontSize: "1.05rem",
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.8,
                  marginBottom: "32px",
                }}
              >
                Deepak Kasthuri founded VanaTvam after nearly three decades in IT, working at Wipro, Infosys and Capgemini. He led international programmes for Fortune 500 clients and won recognition for large-scale delivery. That career taught him how to plan, execute, and hold a standard.
              </p>

              <p
                style={{
                  fontSize: "1.05rem",
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.8,
                  marginBottom: "32px",
                }}
              >
                Deepak Kasthuri's sister-in-law, Vaishnavi Achar, carried that same discipline into Brindavana. She managed the project on the ground, in the arid terrain of Pavagada, while Deepak stayed in his corporate role. Years of planting, learning, and adjusting taught her what it actually takes to grow something in difficult land — patience measured in seasons, not quarters.
              </p>
              <p
                style={{
                  fontSize: "1.05rem",
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.8,
                  marginBottom: "32px",
                }}
              >
                When Deepak eventually left his corporate career, he brought both halves together: the rigor of running global programmes and the patience of growing something from soil. That combination is VanaTvam’s foundation — natural farm communities that restore biodiversity, reconnect people with land, and bring like-minded people together.
              </p>
              <p
                style={{
                  fontSize: "1.05rem",
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.8,
                  marginBottom: "32px",
                }}
              >

                Vaishnavi and Deepak want VanaTvam’s name to mean something: integrity, responsible development, a real commitment to the land and the people on it. For them, this isn’t a business venture. It’s a chance to put their values into something their children’s generation can still walk through.
              </p>



            </div>
          </div>
        </div>
      </section>


      {/* Recognition Section */}
      {/* <section
        style={{ padding: "clamp(90px, 12vh, 140px) 0", background: "#F9F8F6" }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
              gap: "80px",
              alignItems: "center",
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -40, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
            >
              <span
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
                Institutional Recognition
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2.5rem, 4vw, 3.2rem)",
                  color: "var(--bg-dark-forest)",
                  lineHeight: 1.1,
                  marginBottom: "30px",
                  letterSpacing: "-0.02em",
                }}
              >
                <RevealText>
                  FKCCI Award in Tourism & Hospitality - 2026
                </RevealText>
              </h2>
              <p
                style={{
                  fontSize: "1.15rem",
                  color: "var(--text-dark)",
                  lineHeight: 1.8,
                  marginBottom: "20px",
                  fontWeight: 300,
                }}
              >
                VanaTvam&apos;s work has received institutional recognition
                through an{" "}
                <strong
                  style={{ color: "var(--bg-dark-forest)", fontWeight: 500 }}
                >
                  FKCCI Award in Tourism and Hospitality
                </strong>{" "}
                from the Federation of Karnataka Chambers of Commerce and
                Industry.
              </p>
              <p
                style={{
                  fontSize: "1.15rem",
                  color: "var(--text-dark)",
                  lineHeight: 1.8,
                  fontWeight: 300,
                }}
              >
                This award reflects a growing realization: nature-led land
                development and commercial viability can coexist seamlessly,
                delivering both ecological regeneration and long-term asset
                security.
              </p>
            </motion.div> */}

      {/* Right Side — Recognition Image */}
      {/* <motion.div
              initial={{ opacity: 0, x: 40, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
              style={{
                position: "relative",
                width: "100%",
                height: "560px",

              }}
            >
              <motion.img
                {...responsiveImg("/event-images/award.webp", "(max-width: 768px) 92vw, 46vw")}
                alt="VanaTvam receiving the FKCCI Award in Tourism and Hospitality 2026 from the Federation of Karnataka Chambers of Commerce and Industry"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                  width: "100%",
                  height: "100%",

                }}
              />


            </motion.div>
          </div>
        </div>
      </section> */}



      <Footer />
    </>
  );
}
