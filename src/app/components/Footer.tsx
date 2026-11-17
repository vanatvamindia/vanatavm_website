"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "@/components/ui/AppLink";
import Magnetic from "@/components/premium/Magnetic";
import { Home, Sprout, Layers, TrendingUp, BookOpen, MapPin, Phone, Mail } from "lucide-react";
import { responsiveImg } from "@/lib/responsiveImage";

/* 👉 Footer artwork (green hills / sunrise / hut / leaves) */
const FOOTER_BG = "/assets/images/footer-bg.webp";

type NavChild = { label: string; href: string };
type NavItem = {
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  href: string;
  children?: NavChild[];
};

/* Pages shown in the Projects dropdown */
const PROJECT_LINKS: NavChild[] = [
  { label: "Brindavana", href: "/brindavana" },
  { label: "Madhuvana", href: "/madhuvana" },
  { label: "Anantavana", href: "/anantavana" },
  { label: "Ishavana", href: "/ishavana" },
];

const NAV: NavItem[] = [
  { Icon: Home, label: "Home", href: "/" },
  { Icon: Sprout, label: "Our Philosophy", href: "/about" },
  {
    Icon: Layers,
    label: "Projects",
    href: "/projects",
    children: PROJECT_LINKS,
  },
  { Icon: TrendingUp, label: "Investment", href: "/investment" },
  { Icon: BookOpen, label: "Journal", href: "/blog" },
];

const SOCIALS = [
  {
    id: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/vanatvamindia/",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    id: "facebook",
    label: "Facebook",
    url: "https://www.facebook.com/vanatvamfarms",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
      </svg>
    ),
  },
  {
    id: "youtube",
    label: "YouTube",
    url: "https://www.youtube.com/@VanaTvam",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
      </svg>
    ),
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/company/vanatvam-farms/home/",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // close on outside click / Escape
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Touch screens (no hover): first tap opens the menu instead of navigating
  const handleTriggerClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(hover: none)").matches) {
      e.preventDefault();
      setMenuOpen((v) => !v);
    }
  };

  return (
    <footer className="vt-footer">
      <div className="vt-footer__inner">
        {/* ROW 1: logo | nav + contact | socials */}
        <div className="vt-footer__top">
          <Link
            href="/"
            className="vt-footer__brand"
            aria-label="VanaTvam home"
          >
            <img
              {...responsiveImg("/assets/images/Project-Logos/vanatvam.webp", "(max-width: 768px) 60vw, 16vw")}
              alt="VanaTvam Logo"
              className="vt-footer__logo"
              loading="lazy"
              decoding="async"
              width="180"
              height="50"
            />
            <span className="vt-footer__tagline">
              
            </span>
          </Link>

          <span className="vt-footer__divider vt-hide-md" aria-hidden="true" />

          <div className="vt-footer__nav-group">
            <nav className="vt-footer__nav" aria-label="Footer">
              {NAV.map((item, i) => (
                <div className="vt-footer__navitem" key={item.label}>
                  {i > 0 && (
                    <span className="vt-footer__divider" aria-hidden="true" />
                  )}

                  {item.children ? (
                    <div
                      className="vt-footer__dropwrap"
                      ref={menuRef}
                      onMouseEnter={() => setMenuOpen(true)}
                      onMouseLeave={() => setMenuOpen(false)}
                    >
                      <Link
                        href={item.href}
                        className="vt-footer__link"
                        aria-haspopup="true"
                        aria-expanded={menuOpen}
                        onClick={handleTriggerClick}
                        onFocus={() => setMenuOpen(true)}
                      >
                        <item.Icon size={15} aria-hidden="true" />
                        {item.label}
                        <span
                          className={`vt-footer__caret ${menuOpen ? "is-open" : ""}`}
                          aria-hidden="true"
                        />
                      </Link>

                      <div
                        className={`vt-footer__menu ${menuOpen ? "is-open" : ""}`}
                        role="menu"
                      >
                        <ul>
                          {item.children.map((c) => (
                            <li key={c.href} role="none">
                              <Link
                                href={c.href}
                                role="menuitem"
                                onClick={() => setMenuOpen(false)}
                              >
                                {c.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <Link href={item.href} className="vt-footer__link">
                      <item.Icon size={15} aria-hidden="true" />
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* CONTACT: ADDRESS + PHONE + EMAIL */}
            <div className="vt-footer__contact">
              <a
                href="https://share.google/ec2cCHbHzzQrqMV6I"
                target="_blank"
                rel="noopener noreferrer"
                className="vt-footer__contact-item vt-footer__contact-item--address"
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "flex-start",
                    gap: "6px",
                  }}
                >
                  <MapPin size={15} style={{ flexShrink: 0, marginTop: "4px" }} aria-hidden="true" />
                  #5, Anjanadri Plaza, 2nd Floor, Girinagar 1st Phase, (Behind
                  Radhakrishna Hospital), Bengaluru – 560085
                </span>
              </a>

              <div className="vt-footer__contact-row">
                <a href="tel:+918047095111" className="vt-footer__contact-item">
                  <Phone size={15} aria-hidden="true" />
                  <span>+91 80 4709 5111</span>
                </a>

                <span
                  className="vt-footer__divider vt-footer__divider--sm"
                  aria-hidden="true"
                />

                <a
                  href="mailto:info@vanatvam.com"
                  className="vt-footer__contact-item"
                >
                  <Mail size={15} aria-hidden="true" />
                  <span>info@vanatvam.com</span>
                </a>
              </div>
            </div>
          </div>

          <span className="vt-footer__divider vt-hide-md" aria-hidden="true" />

          <div className="vt-footer__socials">
            {SOCIALS.map((s) => (
              <Magnetic key={s.id} strength={0.3}>
                <a
                  href={s.url}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vt-footer__social"
                >
                  {s.svg}
                </a>
              </Magnetic>
            ))}
          </div>
        </div>

        {/* ROW 2: legal + copyright */}
        <div className="vt-footer__bottom">
          <div className="vt-footer__legal">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <span
              className="vt-footer__divider vt-footer__divider--sm"
              aria-hidden="true"
            />
            <Link href="/terms">Terms &amp; Conditions</Link>
          </div>
          <p className="vt-footer__copy">
            &copy; {new Date().getFullYear()} VanaTvam Private Limited. CIN:
            U01100KA2022PTC159587
          </p>
        </div>
      </div>

      <style>{`
        .vt-footer {
          --gold: var(--accent-gold, #f2b705);
          position: relative;
          z-index: 5;
          color: #fff;
          /* The artwork is a wide 1599x209 banner. "cover" stretched it 2-3x (blurry), so it is
             drawn at the footer's width, anchored to the bottom, and the space above is filled
             with the banner's own sky colour (#0b3515) so the two blend seamlessly. */
          /* Layer 1 fades the fill colour into the banner's top edge (hides the seam).
             Banner height = width x 209/1599 = 13.07vw; the fade covers its top 4.6vw. */
          background-color: #0b3515;
          background-image: linear-gradient(#0b3515, rgba(11, 53, 21, 0)), url(${FOOTER_BG});
          background-size: 100% 4.6vw, 100% auto;
          background-position: center bottom 8.47vw, center bottom;
          background-repeat: no-repeat;
          min-height: 345px;
          display: flex;
          align-items: stretch;
        }
        /* 30% dark layer (brightness taggistundi) + soft fade for readability */
        .vt-footer::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
            linear-gradient(
              to bottom,
              rgba(8, 28, 14, 0.55) 0%,
              rgba(8, 28, 14, 0) 55%,
              rgba(8, 28, 14, 0.55) 100%
            );
          pointer-events: none;
        }
        .vt-footer__inner {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1520px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        /* ---------- top row ---------- */
        .vt-footer__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          margin-top: 90px;
        }
        .vt-footer__brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }
        .vt-footer__logo {
          height: 64px;
          width: auto;
          max-width: 100%;
          object-fit: contain;
          display: block;
        }
        .vt-footer__tagline {
          font-size: 0.68rem;
          color: var(--gold);
          letter-spacing: 0.02em;
        }

        .vt-footer__divider {
          width: 1px;
          height: 40px;
          background: linear-gradient(
            to bottom,
            transparent,
            var(--gold) 20%,
            var(--gold) 80%,
            transparent
          );
          opacity: 0.85;
          flex-shrink: 0;
        }
        .vt-footer__divider--sm {
          height: 16px;
          background: rgba(255, 255, 255, 0.45);
        }

        /* nav + contact stacked */
        .vt-footer__nav-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 22px;
        }
        .vt-footer__nav {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          justify-content: center;
        }
        .vt-footer__navitem {
          display: flex;
          align-items: center;
        }
        .vt-footer__navitem .vt-footer__divider {
          height: 26px;
          margin: 0 26px;
        }

        /* ---------- nav links: WHITE icons + effects ---------- */
        .vt-footer__link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #fff;
          font-weight: 500;
          font-size: 1rem;
          white-space: nowrap;
          transition: color 0.25s, transform 0.25s;
        }
        .vt-footer__link i {
          color: #fff;
          font-size: 1.1rem;
          transition: transform 0.3s ease, color 0.25s, filter 0.25s;
        }
        .vt-footer__link:hover,
        .vt-footer__link:focus-visible {
          color: var(--gold);
          transform: translateY(-2px);
        }
        .vt-footer__link:hover i,
        .vt-footer__link:focus-visible i {
          color: var(--gold);
          transform: scale(1.25) rotate(-8deg);
          filter: drop-shadow(0 0 6px rgba(242, 183, 5, 0.85));
        }

        /* ---------- contact (address / phone / mail) ---------- */
        .vt-footer__contact {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .vt-footer__contact-row {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 8px 20px;
        }
        .vt-footer__contact-item {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #fff;
          font-size: 0.92rem;
          transition: color 0.25s, transform 0.25s;
        }
        .vt-footer__contact-item--address {
          max-width: 560px;
          text-align: center;
          line-height: 1.45;
        }
        .vt-footer__contact-item i {
          color: #fff;
          font-size: 1rem;
          transition: transform 0.3s ease, color 0.25s, filter 0.25s;
        }
        .vt-footer__contact-item:hover,
        .vt-footer__contact-item:focus-visible {
          color: var(--gold);
          transform: translateY(-2px);
        }
        .vt-footer__contact-item:hover i,
        .vt-footer__contact-item:focus-visible i {
          color: var(--gold);
          transform: scale(1.25) rotate(-8deg);
          filter: drop-shadow(0 0 6px rgba(242, 183, 5, 0.85));
        }

        /* ---------- socials: WHITE icons + effects ---------- */
        .vt-footer__socials {
          display: flex;
          gap: 14px;
          flex-shrink: 0;
        }
        .vt-footer__social {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border: 1.5px solid #fff;
          border-radius: 10px;
          color: #fff;
          font-size: 1rem;
          transition: background 0.25s, color 0.25s, border-color 0.25s,
            transform 0.25s, box-shadow 0.25s;
        }
        .vt-footer__social i {
          transition: transform 0.3s ease;
        }
        .vt-footer__social:hover,
        .vt-footer__social:focus-visible {
          background: var(--gold);
          border-color: var(--gold);
          color: #0d2414;
          transform: translateY(-4px) scale(1.08);
          box-shadow: 0 8px 20px rgba(242, 183, 5, 0.45);
        }
        .vt-footer__social:hover i,
        .vt-footer__social:focus-visible i {
          transform: rotate(360deg);
        }

        /* ---------- bottom row ---------- */
        .vt-footer__bottom {
          position: relative;
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 22px 0 26px;
          font-size: 0.92rem;
          margin-top: 80px;
        }
        .vt-footer__bottom::before {
          content: "";
          position: absolute;
          top: 0;
          left: -24px;
          right: -24px;
          height: 1px;
          background: linear-gradient(
            to right,
            transparent,
            var(--gold) 25%,
            var(--gold) 75%,
            transparent
          );
          opacity: 0.7;
        }
        .vt-footer__legal {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .vt-footer__legal a {
          color: #fff;
          transition: color 0.25s;
        }
        .vt-footer__legal a:hover {
          color: var(--gold);
        }
        .vt-footer__copy {
          margin: 0;
          flex: 1;
          text-align: center;
          color: #fff;
        }

        /* ---------- Projects dropdown (opens upward) ---------- */
        .vt-footer__dropwrap {
          position: relative;
        }
        .vt-footer__caret {
          width: 7px;
          height: 7px;
          margin-left: 2px;
          border-right: 1.5px solid #fff;
          border-bottom: 1.5px solid #fff;
          transform: translateY(2px) rotate(-135deg);
          transition: transform 0.25s, border-color 0.25s;
        }
        .vt-footer__link:hover .vt-footer__caret {
          border-color: var(--gold);
        }
        .vt-footer__caret.is-open {
          transform: translateY(-1px) rotate(45deg);
        }
        .vt-footer__menu {
          position: absolute;
          left: 50%;
          bottom: 100%;
          padding-bottom: 16px;
          transform: translate(-50%, 8px);
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.22s, transform 0.22s, visibility 0.22s;
          z-index: 20;
        }
        .vt-footer__menu.is-open {
          opacity: 1;
          visibility: visible;
          transform: translate(-50%, 0);
        }
        .vt-footer__menu ul {
          position: relative;
          list-style: none;
          margin: 0;
          padding: 8px;
          min-width: 220px;
          background: rgba(10, 32, 17, 0.98);
          border: 1px solid var(--gold);
          border-radius: 14px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(8px);
        }
        .vt-footer__menu ul::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -7px;
          width: 12px;
          height: 12px;
          background: rgba(10, 32, 17, 0.98);
          border-right: 1px solid var(--gold);
          border-bottom: 1px solid var(--gold);
          transform: translateX(-50%) rotate(45deg);
        }
        .vt-footer__menu li a {
          display: block;
          padding: 10px 14px;
          border-radius: 8px;
          color: #fff;
          font-size: 0.95rem;
          white-space: nowrap;
          transition: background 0.2s, color 0.2s, padding-left 0.2s;
        }
        .vt-footer__menu li a:hover,
        .vt-footer__menu li a:focus-visible {
          background: rgba(242, 183, 5, 0.14);
          color: var(--gold);
          padding-left: 20px;
        }

        /* ---------- responsive ---------- */
        @media (max-width: 1100px) {
          .vt-hide-md {
            display: none;
          }
          .vt-footer__top {
            flex-direction: column;
            margin-top: 56px;
            gap: 28px;
          }
          .vt-footer__navitem .vt-footer__divider {
            margin: 0 16px;
          }
        }
        @media (max-width: 640px) {
          /* Phones: show the centre of the banner (sun and hills) larger, but only ~1.3x of
             its real pixels on a 2.6x-density screen, instead of the previous ~8x stretch. */
          .vt-footer {
            /* banner is twice as wide here, so 26.14vw tall; fade its top 9vw */
            background-size: 100% 9vw, 200% auto;
            background-position: center bottom 17.14vw, center bottom;
          }
          .vt-footer__menu ul {
            min-width: min(260px, 80vw);
          }
          .vt-footer__menu li a {
            padding: 14px 16px;
          }
          .vt-footer__nav {
            gap: 14px 0;
          }
          .vt-footer__navitem .vt-footer__divider {
            display: none;
          }
          .vt-footer__link {
            margin: 0 14px;
          }
          .vt-footer__contact-row {
            flex-direction: column;
            gap: 12px;
          }
          .vt-footer__contact-row .vt-footer__divider--sm {
            display: none;
          }
          .vt-footer__bottom {
            flex-direction: column;
            gap: 10px;
            margin-top: 40px;
          }
          .vt-footer__copy {
            font-size: 0.8rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .vt-footer__social,
          .vt-footer__social i,
          .vt-footer__link,
          .vt-footer__link i,
          .vt-footer__contact-item,
          .vt-footer__contact-item i,
          .vt-footer__menu,
          .vt-footer__caret {
            transition: none;
          }
        }
      `}</style>
    </footer>
  );
}
