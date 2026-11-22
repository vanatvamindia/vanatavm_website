"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getAttribution } from "@/lib/attribution";
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import Magnetic from "@/components/premium/Magnetic";
import { riseStyle } from "@/lib/rise";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  ArrowUpRight,
  MessageSquare,
  Building2,
  Calendar,
  Send,
} from "lucide-react";

const EASE = [0.2, 0.9, 0.2, 1] as const;
const TITLE = "CONTACT US";
const GOLD = "var(--accent-gold)";
const FOREST = "#122217";

/* ---------- Fireflies (canvas) ---------- */
function Fireflies({ still }: { still: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let w = 0,
      h = 0,
      raf = 0;
    type F = {
      x: number;
      y: number;
      r: number;
      v: number;
      amp: number;
      ph: number;
      fq: number;
      o: number;
      amber: boolean;
    };
    let flies: F[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      flies = Array.from({ length: 60 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.8 + Math.random() * 1.8,
        v: 0.12 + Math.random() * 0.38,
        amp: 5 + Math.random() * 20,
        ph: Math.random() * 6.28,
        fq: 0.0008 + Math.random() * 0.0014,
        o: 0.35 + Math.random() * 0.55,
        amber: Math.random() > 0.58,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      flies.forEach((f) => {
        const pulse = 0.55 + Math.sin(t * 0.0015 + f.ph) * 0.25;
        const dx = Math.sin(t * f.fq + f.ph) * f.amp;
        const c = f.amber ? "255,194,105" : "183,222,153";
        ctx.beginPath();
        ctx.fillStyle = `rgba(${c},${f.o * pulse})`;
        ctx.shadowColor = `rgba(${c},0.9)`;
        ctx.shadowBlur = f.r * 7;
        ctx.arc(f.x + dx, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
        if (!still) {
          f.y -= f.v;
          if (f.y < -f.r) {
            f.y = h + f.r;
            f.x = Math.random() * w;
          }
        }
      });
      ctx.shadowBlur = 0;
      if (!still) raf = requestAnimationFrame(draw);
    };

    resize();
    draw(0);
    if (!still) raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [still]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
        opacity: 0.8,
      }}
    />
  );
}

export default function Contact() {
  const reduce = useReducedMotion() ?? false;
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enter = (delay: number, duration = 0.8) =>
    reduce ? { duration: 0 } : { duration, delay, ease: EASE };
  const from = (y: number) => (reduce ? false : { opacity: 0, y });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      project: formData.get("project"),
      date: formData.get("date"),
      message: formData.get("message"),
      source: "contact",
      page: window.location.pathname,
      ...getAttribution(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch (err) {
      console.error("Form submission error:", err);
      setError("Something went wrong. Please call or WhatsApp us directly.");
    }

    setSubmitting(false);
  };

  return (
    <>
      <Navigation />
      <main className="contact-page">
         

    
           
        {/* ================= 2-COLUMN MAIN CONTENT & FORM ================= */}
        <section
          style={{
             
            padding: "clamp(120px, 20vh, 350px) 0",
            background: "#FFFFFF",
          }}
        >
          <div className="container">
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 460px), 1fr))",
                gap: "clamp(40px, 6vw, 80px)",
                alignItems: "start",
              }}
            >
             {/* Left Column: Office Details & Live Google Map */}
              <div
                className="vt-rise"
                style={riseStyle(0, { y: "24px" }, {
                  display: "flex",
                  flexDirection: "column",
                  gap: "32px",
                })}
              >
                {/* Office Info Card */}
                <div
                  style={{
                    background: "linear-gradient(145deg, #F9FBF9 0%, #F3F7F4 100%)",
                    padding: "40px",
                    borderRadius: "28px",
                    border: "1px solid #DCE4DE",
                    boxShadow: "0 14px 40px rgba(18, 34, 23, 0.05)",
                  }}
                >
                  <span
                    style={{
                      color: "#987443",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "12px",
                    }}
                  >
                    HEADQUARTERS
                  </span>

                  <h1
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(2rem, 3vw, 2.5rem)",
                      color: FOREST,
                      margin: "0 0 20px",
                      lineHeight: 1.2,
                    }}
                  >
                    Visit Our Office
                  </h1>

                  <p
                    style={{
                      color: "#5A685E",
                      fontSize: "1.05rem",
                      lineHeight: 1.8,
                      margin: "0 0 28px",
                    }}
                  >
                    Our team welcomes you to meet in person, understand the vision behind our natural farm communities, explore the project details and clarify your questions. We can also help plan a guided site visit so you can experience the land firsthand.
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                      paddingTop: "20px",
                      borderTop: "1px solid #DCE4DE",
                    }}
                  >
                    {/* Phone Number */}
                    <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                      <Phone size={22} style={{ color: GOLD, flexShrink: 0 }} />
                      <div>
                        <strong style={{ display: "block", color: FOREST, fontSize: "0.95rem", marginBottom: "2px" }}>
                          Phone Number
                        </strong>
                        <a href="tel:+918047095111" style={{ color: "#5A685E", fontSize: "0.92rem", textDecoration: "none" }}>
                          +91 80 4709 5111
                        </a>
                      </div>
                    </div>

                    {/* Email Address */}
                    <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                      <Mail size={22} style={{ color: GOLD, flexShrink: 0 }} />
                      <div>
                        <strong style={{ display: "block", color: FOREST, fontSize: "0.95rem", marginBottom: "2px" }}>
                          Email Address
                        </strong>
                        <a href="mailto:info@vanatvam.com" style={{ color: "#5A685E", fontSize: "0.92rem", textDecoration: "none" }}>
                          info@vanatvam.com
                        </a>
                      </div>
                    </div>

                    {/* Office Address */}
                    <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                      <MapPin size={22} style={{ color: GOLD, flexShrink: 0, marginTop: "2px" }} />
                      <div>
                        <strong style={{ display: "block", color: FOREST, fontSize: "0.95rem", marginBottom: "2px" }}>
                          Office Address
                        </strong>
                        <span style={{ color: "#5A685E", fontSize: "0.92rem", lineHeight: 1.6 }}>
                          #5, Anjanadri Plaza, 2nd Floor, Girinagar 1st Phase (Behind Radhakrishna Hospital), Bangalore – 560085
                        </span>
                      </div>
                    </div>

                    {/* Working Hours */}
                    <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                      <Clock size={22} style={{ color: GOLD, flexShrink: 0 }} />
                      <div>
                        <strong style={{ display: "block", color: FOREST, fontSize: "0.95rem", marginBottom: "2px" }}>
                          Working Hours
                        </strong>
                        <span style={{ color: "#5A685E", fontSize: "0.92rem" }}>
                          Monday – Saturday: 9:30 AM – 6:30 PM
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: "32px", display: "flex", gap: "14px", flexWrap: "wrap" }}>
                    <Magnetic strength={0.2}>
                      <a
                        href="https://wa.me/918047095111"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-pill"
                        style={{
                          background: "#25D366",
                          borderColor: "#25D366",
                          color: "#FFF",
                          fontWeight: 600,
                        }}
                      >
                        <MessageSquare size={18} /> Chat on WhatsApp
                      </a>
                    </Magnetic>

                    <a
                      href="tel:+918047095111"
                      className="btn-pill btn-pill-outline"
                      style={{ fontWeight: 600 }}
                    >
                      <Phone size={18} /> Call Us Directly
                    </a>
                  </div>
                </div>

                {/* Interactive Map Card */}
                <div
                  style={{
                    position: "relative",
                    borderRadius: "28px",
                    overflow: "hidden",
                    border: "1px solid rgba(198, 162, 101, 0.4)",
                    minHeight: "380px",
                    background: "#E5E8E0",
                    boxShadow: "0 18px 45px rgba(18, 34, 23, 0.08)",
                  }}
                >
                  <iframe
                    title="Google Maps showing VanaTvam Head Office in Girinagar Bangalore"
                    src="https://www.google.com/maps?q=12.9410767,77.5454691&z=17&output=embed"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: "380px",
                      border: 0,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "16px",
                      left: "16px",
                      right: "16px",
                      background: "rgba(18, 34, 23, 0.92)",
                      backdropFilter: "blur(12px)",
                      color: "#FFF",
                      padding: "16px 20px",
                      borderRadius: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      border: "1px solid rgba(198, 162, 101, 0.35)",
                    }}
                  >
                    <div>
                      <strong style={{ color: "#F3E3C0", fontFamily: "var(--font-serif)", fontSize: "1.1rem" }}>
                        VanaTvam Head Office
                      </strong>
                      <span style={{ display: "block", fontSize: "0.8rem", color: "rgba(255,255,255,0.75)", marginTop: "2px" }}>
                        Girinagar 1st Phase, Bangalore
                      </span>
                    </div>
                    <a
                      href="https://www.google.com/maps?q=12.9410767,77.5454691&z=17"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pill btn-pill-gold"
                      style={{
                        padding: "8px 14px",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      Open Map <ArrowUpRight size={14} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Premium Enquiry & Site Visit Form */}
              <div className="vt-rise" style={riseStyle(0.1, { y: "24px" })}>
                <form
                  onSubmit={handleSubmit}
                  style={{
                    position: "relative",
                    background: "linear-gradient(145deg, #F9FBF9 0%, #F3F7F4 100%)",
                    padding: "clamp(32px, 4vw, 52px)",
                    borderRadius: "28px",
                    border: "1px solid #DCE4DE",
                    boxShadow: "0 22px 55px rgba(0,0,0,0.08)",
                  }}
                >
                  {/* Top Gold Line */}
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

                  <div style={{ marginBottom: "32px" }}>
                    <span
                      style={{
                        color: "#987443",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: "10px",
                      }}
                    >
                      BOOK A SITE VISIT &amp; ENQUIRY
                    </span>

                    <h2
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "clamp(2rem, 3.2vw, 2.6rem)",
                        color: FOREST,
                        margin: "0 0 10px",
                        fontWeight: 500,
                      }}
                    >
                      Send Us a Message
                    </h2>

                    <p
                      style={{
                        color: "#6B776D",
                        fontSize: "0.98rem",
                        lineHeight: 1.65,
                        margin: 0,
                      }}
                    >
                      Our team will respond within 24 hours to coordinate your visit.
                    </p>
                  </div>

                  {submitted ? (
                    <div
                      style={{
                        padding: "30px",
                        borderRadius: "20px",
                        background: "rgba(198, 162, 101, 0.12)",
                        border: "1px solid rgba(198, 162, 101, 0.35)",
                        textAlign: "center",
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: "1.6rem",
                          color: FOREST,
                          margin: "0 0 10px",
                        }}
                      >
                        Thank You!
                      </h3>
                      <p style={{ color: "#5A685E", margin: 0, lineHeight: 1.7 }}>
                        Your enquiry request has been received. Our team will contact you shortly to confirm visit details.
                      </p>
                    </div>
                  ) : (
                    <>
                    {error && (
                      <p
                        style={{
                          margin: "0 0 16px",
                          padding: "12px 16px",
                          borderRadius: "10px",
                          background: "rgba(200, 60, 60, 0.08)",
                          border: "1px solid rgba(200, 60, 60, 0.25)",
                          color: "#8A3030",
                          fontSize: "0.88rem",
                        }}
                      >
                        {error}
                      </p>
                    )}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                      }}
                    >
                      {/* Name */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ color: "#35483A", fontSize: "0.88rem", fontWeight: 600 }}>
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter your full name"
                          required
                          style={{
                            width: "100%",
                            minHeight: "52px",
                            padding: "13px 16px",
                            border: "1px solid #DCE1DA",
                            borderRadius: "10px",
                            background: "#FFFFFF",
                            color: "#26352B",
                            fontSize: "0.95rem",
                            outline: "none",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>

                      {/* Phone */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ color: "#35483A", fontSize: "0.88rem", fontWeight: 600 }}>
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="+91 98765 43210"
                          required
                          style={{
                            width: "100%",
                            minHeight: "52px",
                            padding: "13px 16px",
                            border: "1px solid #DCE1DA",
                            borderRadius: "10px",
                            background: "#FFFFFF",
                            color: "#26352B",
                            fontSize: "0.95rem",
                            outline: "none",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>

                      {/* Email */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ color: "#35483A", fontSize: "0.88rem", fontWeight: 600 }}>
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="yourname@domain.com"
                          required
                          style={{
                            width: "100%",
                            minHeight: "52px",
                            padding: "13px 16px",
                            border: "1px solid #DCE1DA",
                            borderRadius: "10px",
                            background: "#FFFFFF",
                            color: "#26352B",
                            fontSize: "0.95rem",
                            outline: "none",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>

                      {/* Project Select */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ color: "#35483A", fontSize: "0.88rem", fontWeight: 600 }}>
                          Interested Project *
                        </label>
                        <select
                          name="project"
                          required
                          defaultValue=""
                          style={{
                            width: "100%",
                            minHeight: "52px",
                            padding: "13px 16px",
                            border: "1px solid #DCE1DA",
                            borderRadius: "10px",
                            background: "#FFFFFF",
                            color: "#26352B",
                            fontSize: "0.95rem",
                            outline: "none",
                            cursor: "pointer",
                            boxSizing: "border-box",
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
                      </div>

                      {/* Preferred Visit Date */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ color: "#35483A", fontSize: "0.88rem", fontWeight: 600 }}>
                          Preferred Visit Date (Optional)
                        </label>
                        <input
                          type="date"
                          name="date"
                          style={{
                            width: "100%",
                            minHeight: "52px",
                            padding: "13px 16px",
                            border: "1px solid #DCE1DA",
                            borderRadius: "10px",
                            background: "#FFFFFF",
                            color: "#26352B",
                            fontSize: "0.95rem",
                            outline: "none",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>

                      {/* Message */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ color: "#35483A", fontSize: "0.88rem", fontWeight: 600 }}>
                          Message / Specific Questions
                        </label>
                        <textarea
                          name="message"
                          rows={4}
                          placeholder="Tell us about your requirements or preferred visit dates..."
                          style={{
                            width: "100%",
                            padding: "13px 16px",
                            border: "1px solid #DCE1DA",
                            borderRadius: "10px",
                            background: "#FFFFFF",
                            color: "#26352B",
                            fontSize: "0.95rem",
                            outline: "none",
                            resize: "vertical",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={submitting}
                        whileHover={{
                          y: -2,
                          boxShadow: "0 12px 26px rgba(116,53,31,0.25)",
                        }}
                        whileTap={{ scale: 0.985 }}
                        style={{
                          width: "100%",
                          minHeight: "54px",
                          marginTop: "10px",
                          padding: "14px 22px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "10px",
                          border: "none",
                          borderRadius: "10px",
                          background: "var(--accent-gold)",
                          color: "#FFFFFF",
                          fontSize: "0.98rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {submitting ? "Sending Request..." : "Submit Enquiry Request"}
                        <ArrowRight size={18} />
                      </motion.button>

                      <p
                        style={{
                          margin: "10px 0 0",
                          textAlign: "center",
                          color: "#7B857D",
                          fontSize: "0.75rem",
                          lineHeight: 1.6,
                        }}
                      >
                        Your details are private and will only be used to answer your enquiry.
                      </p>
                    </div>
                    </>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FREQUENTLY ASKED QUESTIONS ABOUT VISITS ================= */}
        <section
          style={{
            padding: "clamp(60px, 8vh, 100px) 0",
            background: "#F4F1EA",
            borderTop: "1px solid rgba(18, 34, 23, 0.08)",
          }}
        >
          <div className="container" style={{ maxWidth: "1000px" }}>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <span
                style={{
                  color: "#987443",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "12px",
                }}
              >
                GOT QUESTIONS?
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
                  color: FOREST,
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                Planning Your Visit
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                {
                  number: "01",
                  question: "How do I book a private site visit?",
                  answer:
                    "Fill out the enquiry form above, call us at +91 80 4709 5111, or message us on WhatsApp. Our relationship manager will confirm your date, time, and travel directions.",
                },
                {
                  number: "02",
                  question: "What should I expect during a guided site visit?",
                  answer:
                    "You will be accompanied by our land specialist to walk the farm boundaries, inspect water bodies, native tree groves, internal roads, and review master plan plot layouts.",
                },
                {
                  number: "03",
                  question: "How far are the project sites from Bangalore?",
                  answer:
                    "Madhuvana is ~80 km (Maddur), Anantavana is near Kabini (~210 km), Ishavana is near Shivanasamudra (~130 km), and Brindavana is near Pavagada (~150 km).",
                },
                {
                  number: "04",
                  question: "Are legal documents and title reports provided for verification?",
                  answer:
                    "Yes. Upon receipt of the booking advance, we will share the relevant legal title documents, mother deeds, RTC records, survey sketches and other property-related records for your verification.",
                },
              ].map((faq, idx) => (
                <motion.details
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(18, 34, 23, 0.08)",
                    borderRadius: "18px",
                    overflow: "hidden",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.02)",
                  }}
                >
                  <summary
                    style={{
                      padding: "22px 28px",
                      fontSize: "1.05rem",
                      fontWeight: 600,
                      color: FOREST,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "16px",
                      userSelect: "none",
                      fontFamily: "var(--font-serif)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <span style={{ color: "#987443", fontSize: "0.85rem", fontWeight: 200 }}>
                        {faq.number}
                      </span>
                      <span>{faq.question}</span>
                    </div>
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
                      borderTop: "1px solid rgba(18, 34, 23, 0.06)",
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
      </main>
      <Footer />

      <style jsx>{`
        .contact-page {
          color: var(--text-dark);
          overflow: hidden;
          background: #F9F8F6;
        }
      `}</style>
    </>
  );
}
