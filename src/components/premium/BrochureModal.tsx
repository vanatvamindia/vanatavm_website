"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAttribution } from "@/lib/attribution";
import { X, Leaf, Download, CheckCircle2 } from "lucide-react";

export type BrochureModalProps = {
  isOpen: boolean;
  onClose: () => void;
  brochureUrl?: string | null;
  projectName?: string;
};

const PROJECT_OPTIONS = ["Anantavana", "Madhuvana", "Brindavana", "Ishavana"];

export default function BrochureModal({
  isOpen,
  onClose,
  brochureUrl = "/assets/project-images/AnantaVana-Brochure.pdf",
  projectName = "VanaTvam Project",
}: BrochureModalProps) {
  // The project is already known from the page the modal was opened on, so the
  // "Project of interest" field is locked to it (matched ignoring case).
  const lockedProject = PROJECT_OPTIONS.find(
    (p) => p.toLowerCase() === projectName.trim().toLowerCase()
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Dialog behaviour: move focus in, close on Escape, keep Tab inside, restore focus on close.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter((el) => !el.hasAttribute("disabled"));
    const t = window.setTimeout(() => {
      (dialogRef.current?.querySelector<HTMLElement>("input, select") ?? focusables()[0])?.focus();
    }, 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
      setError("");
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      project: formData.get("project") || projectName,
      message: `Requested ${projectName} Brochure download.`,
      source: "brochure",
      page: window.location.pathname,
      ...getAttribution(),
    };

    try {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 15000);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      window.clearTimeout(timer);
      if (!res.ok) throw new Error("Lead save failed");
    } catch (err) {
      console.error("Failed to record lead:", err);
      setError(
        "We couldn't save your details, so the brochure hasn't downloaded. Please check your connection and try again, or call or WhatsApp us."
      );
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setSubmitted(true);

    // Trigger PDF download automatically
    if (brochureUrl) {
      const link = document.createElement("a");
      link.href = brochureUrl;
      link.download = brochureUrl.split("/").pop() || `${projectName}_Brochure.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    // Auto close modal after brief confirmation
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "grid",
            placeItems: "center",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(18, 34, 23, 0.75)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          />

          {/* Modal Container */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="brochure-modal-title"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "520px",
              background: "linear-gradient(145deg, #FAFBF9 0%, #F4F7F4 100%)",
              borderRadius: "28px",
              padding: "clamp(28px, 4vw, 40px)",
              boxShadow: "0 30px 70px rgba(0, 0, 0, 0.35)",
              border: "1px solid rgba(198, 162, 101, 0.4)",
              zIndex: 10000,
              boxSizing: "border-box",
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              type="button"
              aria-label="Close modal"
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(18, 34, 23, 0.08)",
                border: "none",
                color: "#183023",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <X size={18} />
            </button>

            {/* Top Gold Accent Line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "15%",
                right: "15%",
                height: "4px",
                borderRadius: "0 0 4px 4px",
                background:
                  "linear-gradient(90deg, transparent, #C6A265, #E9D6AD, #C6A265, transparent)",
              }}
            />

            {submitted ? (
              <motion.div
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  textAlign: "center",
                  padding: "20px 0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "rgba(198, 162, 101, 0.15)",
                    color: "var(--accent-gold, #B38B4D)",
                    display: "grid",
                    placeItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <CheckCircle2 size={36} />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.8rem",
                    color: "#183023",
                    margin: "0 0 10px",
                  }}
                >
                  Brochure Downloading!
                </h3>
                <p style={{ color: "#5A685E", fontSize: "0.98rem", margin: 0 }}>
                  Thank you! Your brochure download has started automatically.
                </p>
              </motion.div>
            ) : (
              <>
                <div style={{ marginBottom: "24px" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "10px",
                    }}
                  >
                    <Leaf size={16} style={{ color: "#B38B4D" }} />
                    <span
                      style={{
                        color: "#987443",
                        fontSize: "0.74rem",
                        fontWeight: 700,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                      }}
                    >
                      Instant Brochure Access
                    </span>
                  </div>

                  <h3
                    id="brochure-modal-title"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(1.8rem, 3vw, 2.2rem)",
                      lineHeight: 1.18,
                      fontWeight: 500,
                      color: "#183023",
                      margin: "0 0 8px",
                    }}
                  >
                    Download {projectName} Brochure
                  </h3>

                  <p
                    style={{
                      color: "#6B776D",
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    Please enter your details below to download the brochure immediately.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <label
                      htmlFor="modal-name"
                      style={{
                        color: "#35483A",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      Full name
                    </label>
                    <input
                      id="modal-name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      required
                      style={{
                        width: "100%",
                        minHeight: "48px",
                        boxSizing: "border-box",
                        padding: "12px 16px",
                        border: "1px solid #DCE1DA",
                        borderRadius: "10px",
                        background: "#FFFFFF",
                        color: "#26352B",
                        fontFamily: "inherit",
                        fontSize: "0.92rem",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <label
                      htmlFor="modal-phone"
                      style={{
                        color: "#35483A",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      Phone number
                    </label>
                    <input
                      id="modal-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      pattern="[0-9+ \-]{10,15}"
                      title="Enter a valid phone number, for example 98765 43210"
                      placeholder="Enter your phone number"
                      required
                      style={{
                        width: "100%",
                        minHeight: "48px",
                        boxSizing: "border-box",
                        padding: "12px 16px",
                        border: "1px solid #DCE1DA",
                        borderRadius: "10px",
                        background: "#FFFFFF",
                        color: "#26352B",
                        fontFamily: "inherit",
                        fontSize: "0.92rem",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <label
                      htmlFor="modal-email"
                      style={{
                        color: "#35483A",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      Email address
                    </label>
                    <input
                      id="modal-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      required
                      style={{
                        width: "100%",
                        minHeight: "48px",
                        boxSizing: "border-box",
                        padding: "12px 16px",
                        border: "1px solid #DCE1DA",
                        borderRadius: "10px",
                        background: "#FFFFFF",
                        color: "#26352B",
                        fontFamily: "inherit",
                        fontSize: "0.92rem",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <label
                      htmlFor="modal-project"
                      style={{
                        color: "#35483A",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      Project of interest
                    </label>
                    <select
                      id="modal-project"
                      name={lockedProject ? undefined : "project"}
                      required
                      defaultValue={lockedProject ?? projectName}
                      disabled={!!lockedProject}
                      aria-disabled={!!lockedProject}
                      style={{
                        width: "100%",
                        minHeight: "48px",
                        boxSizing: "border-box",
                        padding: "12px 16px",
                        border: "1px solid #DCE1DA",
                        borderRadius: "10px",
                        background: "#FFFFFF",
                        color: "#26352B",
                        fontFamily: "inherit",
                        fontSize: "0.92rem",
                        outline: "none",
                        cursor: lockedProject ? "not-allowed" : "pointer",
                        opacity: lockedProject ? 0.75 : 1,
                        ...(lockedProject ? { background: "#F1F3EF" } : {}),
                      }}
                    >
                      <option value="Anantavana">
                        Anantavana (Kabini · 34 Acres)
                      </option>
                      <option value="Madhuvana">
                        Madhuvana (Maddur · 17 Acres)
                      </option>
                      <option value="Brindavana">
                        Brindavana (Pavagada · 30 Acres)
                      </option>
                      <option value="Ishavana">
                        Ishavana (Kaveri Riverfront)
                      </option>
                    </select>
                    {lockedProject && (
                      <input type="hidden" name="project" value={lockedProject} />
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: "100%",
                      minHeight: "50px",
                      marginTop: "12px",
                      padding: "12px 20px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                      border: "none",
                      borderRadius: "10px",
                      background: "var(--accent-gold, #B38B4D)",
                      color: "#FFFFFF",
                      fontFamily: "inherit",
                      fontSize: "0.96rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {submitting ? (
                      "Preparing Download..."
                    ) : (
                      <>
                        Download Brochure <Download size={18} />
                      </>
                    )}
                  </motion.button>
                  {error && (
                    <p
                      role="alert"
                      style={{
                        margin: 0,
                        padding: "12px 14px",
                        borderRadius: "10px",
                        background: "#FBEAE7",
                        border: "1px solid #F0C4BD",
                        color: "#9B2C1F",
                        fontSize: "0.88rem",
                        lineHeight: 1.5,
                        fontWeight: 600,
                      }}
                    >
                      {error}
                    </p>
                  )}
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
