'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getAttribution } from '@/lib/attribution';
import { Info, ArrowRight, ArrowUpRight, ShieldCheck, TrendingUp, Clock, Coins, Globe, TrendingDown, CheckCircle2 } from 'lucide-react';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import RevealText from '@/components/premium/RevealText';
import Magnetic from '@/components/premium/Magnetic';
import { riseStyle } from '@/lib/rise';
import PortraitSource from '@/components/ui/PortraitSource';
import { responsiveImg } from '@/lib/responsiveImage';
import { preloadHero } from '@/lib/preloadHero';

/*
 * Indicative land-value trend, in ₹ lakh per acre, for every project.
 * ILLUSTRATIVE: `start` is each project's 2018 starting price. Replace these with verified,
 * sourced figures before relying on them publicly. Every project rises LAND_VALUE_MULTIPLE
 * times between the first and the last year, so the end value is simply start × multiple.
 */
const LAND_VALUE_YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
const LAND_VALUE_MULTIPLE = 6.2;
// Order here is the order of the legend. `from` is the year a project's line begins; `start` is
// its price per acre (₹ lakh) in that year. Every project grows at the same yearly rate.
const landValueProjects = [
  { name: 'Anantavana', start: 12, from: 2018, color: '#122217', dash: '8 5' },
  { name: 'Madhuvana', start: 10, from: 2018, color: '#C6A265', dash: undefined },
  { name: 'Brindavana', start: 11, from: 2018, color: '#2F6B45', dash: undefined },
  { name: 'Ishavana', start: 20, from: 2022, color: '#8A7A66', dash: '2 6' },
];

const LV_X0 = 52;
const LV_X1 = 540;
const LV_Y_TOP = 24;
const LV_Y_BOTTOM = 240;
const LV_Y_MIN = 10;
const LV_Y_MAX = 80;
const LV_Y_TICKS = [10, 20, 30, 40, 50, 60, 70, 80];
const lvX = (i: number) => LV_X0 + ((LV_X1 - LV_X0) * i) / (LAND_VALUE_YEARS.length - 1);
const lvY = (v: number) => LV_Y_BOTTOM - ((v - LV_Y_MIN) / (LV_Y_MAX - LV_Y_MIN)) * (LV_Y_BOTTOM - LV_Y_TOP);

const landValueSeries = landValueProjects.map((p) => {
  const firstIndex = LAND_VALUE_YEARS.indexOf(p.from);
  const yearlyGrowth = Math.pow(LAND_VALUE_MULTIPLE, 1 / (LAND_VALUE_YEARS.length - 1));
  const points = LAND_VALUE_YEARS.flatMap((_, i) => {
    if (i < firstIndex) return [];
    const value = p.start * Math.pow(yearlyGrowth, i - firstIndex);
    return [{ x: lvX(i), y: lvY(value), value }];
  });
  const path = points.map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ');
  return { ...p, points, path, end: points[points.length - 1] };
});

export default function Investment() {
  preloadHero('/assets/images/Investment.webp');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          source: 'investment',
          page: window.location.pathname,
          ...getAttribution(),
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setFormSubmitted(true);
    } catch (err) {
      console.error('Investment form submission error:', err);
      setError('Something went wrong. Please call or WhatsApp us directly.');
    }

    setSubmitting(false);
  };

  return (
    <div className="investment-page-root">
      <Navigation />

      <style>{`
        @media (max-width: 900px) {
          .investment-page-root section {
            padding-left: 20px !important;
            padding-right: 20px !important;
            padding-top: clamp(48px, 6vh, 80px) !important;
            padding-bottom: clamp(48px, 6vh, 80px) !important;
          }
          .investment-page-root .container {
            padding-left: 0 !important;
            padding-right: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          .inv-hero-section {
            padding-top: clamp(170px, 22vh, 210px) !important;
            padding-bottom: 50px !important;
            min-height: auto !important;
          }
          .inv-hero-container {
            padding-left: 0 !important;
            padding-right: 0 !important;
            max-width: 100% !important;
          }
          .inv-quote-container {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .inv-hero-badge {
            margin-bottom: 18px !important;
            flex-wrap: wrap !important;
          }
          .inv-hero-badge span:last-child {
            font-size: 0.75rem !important;
            letter-spacing: 0.12em !important;
            white-space: normal !important;
            line-height: 1.4 !important;
          }
          .inv-hero-h1 {
            font-size: clamp(2.2rem, 7.5vw, 3.8rem) !important;
            line-height: 1.15 !important;
            margin-bottom: 18px !important;
          }
          .inv-hero-desc {
            font-size: 1.05rem !important;
            line-height: 1.6 !important;
            margin-bottom: 28px !important;
          }
          .inv-hero-buttons {
            flex-direction: column !important;
            width: 100% !important;
            gap: 12px !important;
          }
          .inv-hero-buttons a {
            width: 100% !important;
            justify-content: center !important;
            text-align: center !important;
            padding: 14px 24px !important;
            box-sizing: border-box !important;
          }
          .inv-steps-col {
            border-left: none !important;
            padding-left: 0 !important;
            border-top: 1px solid rgba(255, 255, 255, 0.15) !important;
            padding-top: 24px !important;
            margin-top: 20px !important;
            gap: 20px !important;
          }
          .inv-showcase-frame {
            height: 220px !important;
          }
          .projects-sticky-layout {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .projects-sticky-header {
            position: relative !important;
            top: 0 !important;
            max-width: 100% !important;
            margin-bottom: 0 !important;
          }
          .projects-sticky-card {
            position: relative !important;
            top: 0 !important;
            padding: 24px 18px !important;
            border-radius: 20px !important;
            margin-bottom: 16px !important;
          }
          .inv-metric-card {
            padding: 24px 20px !important;
            min-height: auto !important;
            border-radius: 20px !important;
          }
          .inv-form-card {
            padding: 26px 18px !important;
            border-radius: 22px !important;
          }
          .inv-explanation-card {
            padding: 26px 18px !important;
            border-radius: 22px !important;
          }
          .inv-narrative-banner {
            padding: 32px 20px !important;
            border-radius: 22px !important;
            margin-top: 32px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .inv-narrative-banner h3 {
            font-size: clamp(1.6rem, 5.5vw, 2.2rem) !important;
            line-height: 1.25 !important;
            margin-bottom: 16px !important;
          }
          .inv-narrative-banner p {
            font-size: 1.02rem !important;
            line-height: 1.65 !important;
            margin-bottom: 16px !important;
          }
          .inv-narrative-btn {
            display: flex !important;
            width: 100% !important;
            justify-content: center !important;
            text-align: center !important;
            padding: 14px 20px !important;
            box-sizing: border-box !important;
          }
          .inv-disclaimer-box {
            padding: 18px 16px !important;
            border-radius: 14px !important;
          }
        }
        @media (max-width: 480px) {
          .investment-page-root section {
            padding-left: 18px !important;
            padding-right: 18px !important;
          }
          .inv-hero-section {
            padding-top: clamp(170px, 22vh, 205px) !important;
            padding-bottom: 40px !important;
          }
          .inv-hero-h1 {
            font-size: 2.15rem !important;
          }
          .inv-narrative-banner {
            padding: 26px 16px !important;
            border-radius: 18px !important;
          }
        }
      `}</style>

      {/* ================= HERO SECTION ================= */}
      <section
        className="hero inv-hero-section"
        style={{
          minHeight: '88vh',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          padding: 'clamp(120px, 16vh, 160px) 20px clamp(50px, 8vh, 90px)',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-dark-forest, #122217)',
        }}
      >
        <motion.div
          initial={{ scale: 1.1, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.25, 1, 0.5, 1] }}
          style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        >
          <picture>
            <PortraitSource src="/assets/images/Investment.webp" />
            <img
              {...responsiveImg('/assets/images/Investment.webp')}
              alt="Alternative Investment Opportunities with VanaTvam"
              fetchPriority="high"
              loading="eager"
              decoding="sync"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
            />
          </picture>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(18, 34, 23, 0.12) 0%, rgba(18, 34, 23, 0.22) 60%, rgba(18, 34, 23, 0.55) 100%)',
            }}
          />
        </motion.div>

        <div
          className="container inv-hero-container"
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'left',
            maxWidth: '960px',
            margin: '0 auto 0 0',
            paddingLeft: 'clamp(58px, 10vw, 180px)',
          }}
        >
          {/* Section Badge */}
          <div
            className="inv-hero-badge vt-rise"
            style={riseStyle(0, { y: '20px' }, {
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
            })}
          >
            <span style={{ width: '28px', height: '1px', background: 'var(--accent-gold)' }} />
            <span
              style={{
                color: 'var(--accent-gold)',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}
            >
              Alternative Investment Opportunities
            </span>
          </div>

          <h1
            className="inv-hero-h1"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.8rem, 5.8vw, 5rem)',
              color: '#FFFFFF',
              lineHeight: 1.1,
              marginBottom: '26px',
              letterSpacing: '-0.02em',
              fontWeight: 500,
            }}
          >
            <RevealText immediate>Invest with Purpose.</RevealText>{' '}
            <RevealText
              immediate
              delay={0.15}
              style={{
                display: 'block',
                color: 'var(--accent-gold)',
                fontStyle: 'italic',
                fontWeight: 400,
              }}
            >
              Grow with Nature.
            </RevealText>
          </h1>

          <p
            className="inv-hero-desc vt-rise"
            style={riseStyle(0.2, { y: '20px' }, {
              fontSize: 'clamp(1.1rem, 2vw, 1.32rem)',
              color: 'rgba(249, 248, 246, 0.88)',
              lineHeight: 1.7,
              fontWeight: 300,
              maxWidth: '740px',
              margin: '0 0 40px',
            })}
          >
            Explore curated investment opportunities in nature-first development with VanaTvam.
          </p>

          <div
            className="inv-hero-buttons vt-rise"
            style={riseStyle(0.3, { y: '20px' }, {
              display: 'flex',
              justifyContent: 'flex-start',
              gap: '16px',
              flexWrap: 'wrap',
            })}
          >
            <Magnetic strength={0.2}>
              <a href="#connect-form" className="btn-pill btn-pill-gold" style={{ padding: '16px 36px', fontSize: '0.92rem' }}>
                REQUEST A DISCUSSION
                <ArrowRight className="size-4" />
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a href="#market-perspective" className="btn-pill btn-pill-outline" style={{ padding: '16px 32px', fontSize: '0.92rem' }}>
                Market Insights
                <ArrowUpRight className="size-4" />
              </a>
            </Magnetic>
          </div>
        </div>
      </section>

      {/* ================= QUOTE BANNER ================= */}
      <section
        style={{
          background: 'linear-gradient(135deg, #122217 0%, #1A2E20 100%)',
          color: '#FFFFFF',
          padding: 'clamp(48px, 6vh, 64px) 20px',
          borderTop: '1px solid rgba(198, 162, 101, 0.25)',
          borderBottom: '1px solid rgba(198, 162, 101, 0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(198,162,101,0.08), transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          className="container inv-quote-container"
          style={{
            maxWidth: '100%',
            margin: '0 auto 0 0',
            textAlign: 'left',
            position: 'relative',
            zIndex: 1,
            paddingLeft: 'clamp(48px, 8vw, 140px)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >


            <blockquote
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.4rem, 2.5vw, 2.1rem)',
                fontStyle: 'italic',
                fontWeight: 400,
                lineHeight: 1.45,
                color: '#F9F8F6',
                margin: '0 0 20px',
                maxWidth: '990px',
              }}
            >
              &ldquo;In uncertain times, diversification is your most prudent move.&rdquo;
            </blockquote>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span style={{ width: '20px', height: '1px', background: 'var(--accent-gold)' }} />
              <p
                style={{
                  fontSize: '0.88rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-gold)',
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Jean Lombard, Financial Adviser
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= SECTION 1: PORTFOLIO STRATEGY ================= */}
      <section
        id="market-perspective"
        style={{
          padding: 'clamp(60px, 8vh, 120px) 20px',
          backgroundColor: 'var(--bg-cream, #F9F8F6)',
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: 'clamp(36px, 6vw, 80px)',
              alignItems: 'center',
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
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '16px',
                }}
              >
                <span style={{ width: '24px', height: '1px', background: 'var(--accent-gold)' }} />
                <span
                  style={{
                    color: 'var(--accent-gold)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                  }}
                >
                  Portfolio Strategy
                </span>
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                  color: 'var(--bg-dark-forest, #122217)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  marginBottom: '24px',
                  fontWeight: 500,
                }}
              >
                Diversify During <br />
                <span style={{ color: 'var(--accent-gold)', fontStyle: 'italic', fontWeight: 400 }}>
                  Uncertain Times
                </span>
              </h2>

              <p
                style={{
                  fontSize: '1.18rem',
                  color: '#344037',
                  lineHeight: 1.85,
                  marginBottom: '28px',
                  fontWeight: 300,
                }}
              >
                Spreading capital across different asset classes is one of the oldest ways to protect
                it when markets turn.
              </p>

              <div
                style={{
                  padding: 'clamp(20px, 3vw, 32px)',
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  borderLeft: '4px solid var(--accent-gold, #C6A265)',
                  borderTop: '1px solid rgba(18, 34, 23, 0.06)',
                  borderRight: '1px solid rgba(18, 34, 23, 0.06)',
                  borderBottom: '1px solid rgba(18, 34, 23, 0.06)',
                  boxShadow: '0 12px 36px rgba(18, 34, 23, 0.04)',
                }}
              >
                <p
                  style={{
                    fontSize: '1.02rem',
                    color: '#4B554D',
                    lineHeight: 1.75,
                    margin: 0,
                    fontWeight: 400,
                  }}
                >
                  Physical assets such as land have long been valued for their tangible nature and
                  long-term potential. As with all investments, values and liquidity can vary. Land has
                  historically held up well through uncertain periods.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{
                position: 'relative',
                borderRadius: '28px',
                overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(18, 34, 23, 0.12)',
                border: '1px solid rgba(198, 162, 101, 0.3)',
                aspectRatio: '16/10',
                backgroundColor: '#1B2B1F',
              }}
            >
              <Image
                src="/assets/images/global-asset-allocation-infographic.webp"
                alt="Market Volatility and Diversification Analytics"
                fill
                unoptimized // infographic with small text: always serve the full-resolution original
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(14, 26, 18, 0.75) 0%, transparent 60%)',
                }}
              />
              
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: MARKET VOLATILITY ================= */}
      <section
        style={{
          padding: 'clamp(60px, 8vh, 120px) 20px',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--border-light, rgba(40, 44, 39, 0.08))',
          borderBottom: '1px solid var(--border-light, rgba(40, 44, 39, 0.08))',
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
          }}
        >
          {/* Layout: Left Sticky Header with Image, Right Stacking Feature Cards */}
          <div
            className="projects-sticky-layout"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
              gap: 'clamp(36px, 5vw, 80px)',
              alignItems: 'start',
              position: 'relative',
            }}
          >
            {/* LEFT COLUMN: Sticky Header + Featured Showcase Frame */}
            <div
              className="projects-sticky-header"
              style={{
                position: 'sticky',
                top: '120px',
                display: 'flex',
                flexDirection: 'column',
                gap: '28px',
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '14px',
                  }}
                >
                  <span style={{ width: '24px', height: '1px', background: 'var(--accent-gold)' }} />
                  <span
                    style={{
                      color: 'var(--accent-gold)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Global &amp; Domestic Trends
                  </span>
                </div>

                <h2
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(2rem, 3.2vw, 2.8rem)',
                    color: 'var(--bg-dark-forest, #122217)',
                    lineHeight: 1.18,
                    letterSpacing: '-0.02em',
                    marginBottom: '14px',
                    fontWeight: 500,
                  }}
                >
                  Market Volatility at <br />
                  <span style={{ color: 'var(--accent-gold)', fontStyle: 'italic' }}>
                    Home and Abroad
                  </span>
                </h2>
              </motion.div>

              {/* Showcase Image Frame */}
              <motion.div
                className="inv-showcase-frame"
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '300px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  background: '#122217',
                  boxShadow: '0 16px 40px rgba(18, 34, 23, 0.1)',
                  border: '1px solid rgba(198, 162, 101, 0.25)',
                }}
              >
                <Image
                  src="/assets/images/global-ripple-effects.webp"
                  alt="Market Volatility and Land Diversification"
                  fill
                unoptimized // infographic with small text: always serve the full-resolution original
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'contain', padding: '12px' }}
                />
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Overlapping Stacking Cards */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: '20px',
                gap: '24px',
                position: 'relative',
                paddingBottom: '40px',
              }}
            >
              {[
                {
                  kicker: 'Global Ripple Effects',
                  title: 'Cross-Market Interconnectedness',
                  desc: 'Global markets add a further layer of uncertainty. Shifts in US interest rates, trade policy and geopolitical events have been sending ripples through every major market at once, which is why diversification across asset classes matters.',
                  icon: Globe,
                },
                {
                  kicker: 'Early 2026 Downturn',
                  title: '15–16% Benchmark Declines',
                  desc: 'The numbers since January 2026 show how sharp and divergent that volatility has been. After the US and Israeli strikes on Iran began in late February, both Indian and global markets fell hard: the Nifty 50 dropped from a January 5 record of 26,373 to a March 30 closing low of 22,331, and the Sensex fell from its December 2025 peak of 86,159 to a March 30 low near 71,948 — declines of roughly 15–16% (NSE/BSE data via Business Standard).',
                  icon: TrendingDown,
                },
                {
                  kicker: 'Market Divergence',
                  title: 'Divergent Paths Across Borders',
                  desc: 'The Nasdaq Composite confirmed its own correction on March 26, down about 11% from its October 2025 record, as Iran war fears, a Meta Platforms selloff and doubts over AI spending weighed on US tech stocks. By October 1, the S&P 500 and Nasdaq recovered to new highs, up roughly 12% and over 15% YTD. Indian markets, by contrast, remained down ~14% to 16% from their peaks, pressured by rising US 10-year yields, a weaker rupee and foreign investor selling.',
                  icon: Coins,
                },
              ].map((card, i) => {
                const IconComponent = card.icon;
                return (
                  <motion.div
                    key={card.kicker}
                    className="projects-sticky-card"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{
                      duration: 0.5,
                      ease: [0.25, 1, 0.5, 1],
                      delay: 0.05 * i,
                    }}
                    style={{
                      '--sticky-top': `${130 + i * 26}px`,
                      minHeight: 'fit-content',
                      height: 'auto',
                      background: '#FFFFFF',
                      border: '1px solid rgba(18, 34, 23, 0.08)',
                      borderRadius: '24px',
                      padding: 'clamp(28px, 4vw, 40px)',
                      boxShadow: '0 12px 36px rgba(18, 34, 23, 0.07)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      zIndex: i + 1,
                    } as React.CSSProperties}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'rgba(198, 162, 101, 0.15)',
                            color: 'var(--accent-gold)',
                            display: 'grid',
                            placeItems: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <IconComponent size={18} />
                        </div>
                        <span
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--accent-gold, #C6A265)',
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                          }}
                        >
                          {card.kicker}
                        </span>
                      </div>

                      <h3
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: 'clamp(1.35rem, 2vw, 1.65rem)',
                          color: 'var(--bg-dark-forest, #122217)',
                          fontWeight: 600,
                          lineHeight: 1.3,
                          marginBottom: '14px',
                        }}
                      >
                        {card.title}
                      </h3>

                      <p
                        style={{
                          fontSize: '1rem',
                          color: '#5A685E',
                          lineHeight: 1.75,
                          margin: 0,
                          fontWeight: 300,
                          width: '100%',
                        }}
                      >
                        {card.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Land value over time: indicative price per acre, all projects */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ marginTop: '60px' }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <span style={{ width: '24px', height: '1px', background: 'var(--accent-gold)' }} />
              <span
                style={{
                  color: 'var(--accent-gold)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
              >
                Land Value Over Time
              </span>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.9rem, 3.2vw, 2.7rem)',
                color: 'var(--bg-dark-forest, #122217)',
                lineHeight: 1.2,
                marginBottom: '14px',
                fontWeight: 500,
              }}
            >
              Indicative price per acre,{' '}
              <span style={{ color: 'var(--accent-gold)', fontStyle: 'italic', fontWeight: 400 }}>year by year</span>
            </h3>

            <p
              style={{
                fontSize: '1.05rem',
                color: '#5A685E',
                lineHeight: 1.75,
                fontWeight: 300,
                maxWidth: '720px',
                marginBottom: '32px',
              }}
            >
              How indicative land values across all our project regions have moved from 2018 to 2026.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                gap: 'clamp(24px, 4vw, 56px)',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  background: '#F9F8F6',
                  border: '1px solid rgba(18, 34, 23, 0.1)',
                  borderRadius: '24px',
                  padding: 'clamp(16px, 2.5vw, 28px)',
                }}
              >
                <svg
                  viewBox="0 0 560 280"
                  width="100%"
                  role="img"
                  aria-label={`Line chart of indicative land price per acre from ${LAND_VALUE_YEARS[0]} to ${LAND_VALUE_YEARS[LAND_VALUE_YEARS.length - 1]} for ${landValueProjects.map((p) => p.name).join(', ')}, each rising ${LAND_VALUE_MULTIPLE} times`}
                  style={{ display: 'block' }}
                >
                  {LV_Y_TICKS.map((tick) => (
                    <g key={tick}>
                      <line x1={LV_X0} x2={LV_X1} y1={lvY(tick)} y2={lvY(tick)} stroke="#E3E1DB" strokeWidth="1" />
                      <text x={LV_X0 - 8} y={lvY(tick) + 4} textAnchor="end" fontSize="11" fill="#6B756D">
                        {`₹${tick}L`}
                      </text>
                    </g>
                  ))}
                  {LAND_VALUE_YEARS.map((year, i) =>
                    i % 2 === 0 ? (
                      <text key={year} x={lvX(i)} y={LV_Y_BOTTOM + 24} textAnchor="middle" fontSize="11" fill="#6B756D">
                        {year}
                      </text>
                    ) : null
                  )}
                  {landValueSeries.map((s) => (
                    <g key={s.name}>
                      <path
                        d={s.path}
                        fill="none"
                        stroke={s.color}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray={s.dash}
                      />
                      <circle cx={s.end.x} cy={s.end.y} r="5" fill={s.color} />
                    </g>
                  ))}
                </svg>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 22px', marginTop: '8px', paddingLeft: '4px' }}>
                  {landValueSeries.map((s) => (
                    <span
                      key={s.name}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#33403A' }}
                    >
                      <i style={{ width: '18px', height: '3px', borderRadius: '2px', background: s.color, display: 'inline-block' }} />
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(3.4rem, 7vw, 5.2rem)',
                    lineHeight: 1,
                    color: 'var(--accent-gold)',
                    fontWeight: 500,
                    marginBottom: '14px',
                  }}
                >
                  {LAND_VALUE_MULTIPLE}×
                </div>
                <p style={{ fontSize: '1.08rem', color: '#33403A', lineHeight: 1.7, margin: '0 0 14px', fontWeight: 300 }}>
                  Indicative rise in land value per acre across our projects between {LAND_VALUE_YEARS[0]} and{' '}
                  {LAND_VALUE_YEARS[LAND_VALUE_YEARS.length - 1]}.
                </p>
                <p style={{ fontSize: '0.82rem', color: '#5A685E', lineHeight: 1.6, margin: 0 }}>
                  Indicative figures for illustration. Land values can fall as well as rise, and past performance does
                  not guarantee future returns.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Full Narrative Banner: The VanaTvam Model */}
          <motion.div
            className="inv-narrative-banner"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              background: 'linear-gradient(135deg, #122217 0%, #1A2E20 100%)',
              color: '#FFFFFF',
              borderRadius: '28px',
              padding: 'clamp(32px, 5vw, 64px)',
              marginTop: '60px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(18, 34, 23, 0.25)',
              border: '1px solid rgba(198, 162, 101, 0.3)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-60px',
                right: '-60px',
                width: '320px',
                height: '320px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(198, 162, 101, 0.18) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ width: '24px', height: '1px', background: 'var(--accent-gold)' }} />
              <span
                style={{
                  color: 'var(--accent-gold)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
              >
                The VanaTvam Model
              </span>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.9rem, 3.2vw, 2.7rem)',
                color: '#FFFFFF',
                lineHeight: 1.25,
                marginBottom: '24px',
                maxWidth: '860px',
                fontWeight: 500,
              }}
            >
              Curated Opportunities in Land for Nature-First Projects
            </h3>

            <p
              style={{
                fontSize: '1.18rem',
                color: 'rgba(249, 248, 246, 0.92)',
                lineHeight: 1.85,
                fontWeight: 300,
                maxWidth: '960px',
                marginBottom: '20px',
              }}
            >
              VanaTvam offers the curated opportunities to invest in land for nature-first projects,
              where planning starts with the land, its ecology and its community, and returns follow
              long-term stewardship.
            </p>

            <p
              style={{
                fontSize: '1.18rem',
                color: 'rgba(249, 248, 246, 0.92)',
                lineHeight: 1.85,
                fontWeight: 300,
                maxWidth: '960px',
                marginBottom: '36px',
              }}
            >
              VanaTvam will develop the land parcels into nature-led projects and distribute the
              profits among its investors. Please reach out for further details by filling in the
              details below if you would like to know more.
            </p>

            <Magnetic strength={0.2}>
              <a href="#connect-form" className="btn-pill btn-pill-gold inv-narrative-btn" style={{ padding: '16px 36px', fontSize: '0.92rem' }}>
                EXPLORE OPPORTUNITIES
                <ArrowRight className="size-4" />
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </section>

      {/* ================= SECTION 3: INVESTMENT FRAMEWORK ================= */}
      <section
        style={{
          padding: 'clamp(60px, 8vh, 120px) 20px',
          background: 'var(--bg-cream, #F9F8F6)',
          borderBottom: '1px solid rgba(18, 34, 23, 0.08)',
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
          }}
        >
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ textAlign: 'left', maxWidth: '840px', margin: '0 0 50px' }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '14px',
              }}
            >
              <span style={{ width: '24px', height: '1px', background: 'var(--accent-gold)' }} />
              <span
                style={{
                  color: 'var(--accent-gold)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                }}
              >
                Investment Framework
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.4rem, 4vw, 3.4rem)',
                color: 'var(--bg-dark-forest, #122217)',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                marginBottom: '20px',
                fontWeight: 500,
              }}
            >
              Key Investment Terms &amp; Structure
            </h2>

            <p
              style={{
                fontSize: '1.12rem',
                color: '#4B554D',
                lineHeight: 1.8,
                margin: 0,
                fontWeight: 300,
              }}
            >
              A structured, transparent capital deployment model backed by high-potential physical land assets, professional ecological master planning, and shared long-term capital growth.
            </p>
          </motion.div>

          {/* 3 Metric Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '24px',
              marginBottom: '60px',
            }}
          >
            {/* Metric Card 1 */}
            <motion.div
              className="inv-metric-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -4, boxShadow: '0 16px 36px rgba(18, 34, 23, 0.2)' }}
              style={{
                background: 'linear-gradient(135deg, #122217 0%, #1A2E20 100%)',
                borderRadius: '24px',
                padding: '36px 30px 30px',
                border: '1px solid rgba(198, 162, 101, 0.3)',
                boxShadow: '0 10px 30px rgba(18, 34, 23, 0.12)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '180px',
                transition: 'all 0.3s ease',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                  fontSize: 'clamp(2.1rem, 3.8vw, 2.7rem)',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>~ ₹ 10 Lakh</span>
                <Coins size={28} style={{ color: 'var(--accent-gold)', opacity: 0.8 }} />
              </div>

              <div>
                <div
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    color: '#F9F8F6',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>Minimum Investment Threshold</span>
                  <Info size={15} style={{ opacity: 0.7, color: 'var(--accent-gold)' }} />
                </div>
              </div>
            </motion.div>

            {/* Metric Card 2 */}
            <motion.div
              className="inv-metric-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -4, boxShadow: '0 16px 36px rgba(18, 34, 23, 0.2)' }}
              style={{
                background: 'linear-gradient(135deg, #122217 0%, #1A2E20 100%)',
                borderRadius: '24px',
                padding: '36px 30px 30px',
                border: '1px solid rgba(198, 162, 101, 0.3)',
                boxShadow: '0 10px 30px rgba(18, 34, 23, 0.12)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '180px',
                transition: 'all 0.3s ease',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                  fontSize: 'clamp(2.1rem, 3.8vw, 2.7rem)',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>~ 15%</span>
                <TrendingUp size={28} style={{ color: 'var(--accent-gold)', opacity: 0.8 }} />
              </div>

              <div>
                <div
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    color: '#F9F8F6',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>Indicative Return Range (p.a.)</span>
                  <Info size={15} style={{ opacity: 0.7, color: 'var(--accent-gold)' }} />
                </div>
              </div>
            </motion.div>

            {/* Metric Card 3 */}
            <motion.div
              className="inv-metric-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -4, boxShadow: '0 16px 36px rgba(18, 34, 23, 0.2)' }}
              style={{
                background: 'linear-gradient(135deg, #122217 0%, #1A2E20 100%)',
                borderRadius: '24px',
                padding: '36px 30px 30px',
                border: '1px solid rgba(198, 162, 101, 0.3)',
                boxShadow: '0 10px 30px rgba(18, 34, 23, 0.12)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '180px',
                transition: 'all 0.3s ease',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                  fontSize: 'clamp(2.1rem, 3.8vw, 2.7rem)',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>~ 2–3 Years</span>
                <Clock size={28} style={{ color: 'var(--accent-gold)', opacity: 0.8 }} />
              </div>

              <div>
                <div
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    color: '#F9F8F6',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>Proposed Investment Tenure</span>
                  <Info size={15} style={{ opacity: 0.7, color: 'var(--accent-gold)' }} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Detailed Structural Explanation Card */}
          <motion.div
            className="inv-explanation-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              background: '#122217',
              color: '#FFFFFF',
              borderRadius: '28px',
              padding: 'clamp(32px, 5vw, 56px)',
              boxShadow: '0 22px 60px rgba(18, 34, 23, 0.25)',
              border: '1px solid rgba(198, 162, 101, 0.35)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                gap: '40px',
                alignItems: 'center',
              }}
            >
              <div>
                <span
                  style={{
                    color: 'var(--accent-gold, #C6A265)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '12px',
                  }}
                >
                  HOW IT WORKS
                </span>

                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                    color: '#FFFFFF',
                    lineHeight: 1.25,
                    marginBottom: '20px',
                    fontWeight: 500,
                  }}
                >
                  Detailed Investment Explanation
                </h3>

                <p
                  style={{
                    fontSize: '1.05rem',
                    color: 'rgba(255, 255, 255, 0.85)',
                    lineHeight: 1.8,
                    fontWeight: 300,
                    margin: 0,
                  }}
                >
                  VanaTvam acquires strategic, ecologically rich land parcels near key corridors in Karnataka. By combining architect-led master planning, organic soil revitalization, and community infrastructure, the underlying land value appreciates significantly. Investors participate directly in this value creation and receive profit distributions upon project completion.
                </p>
              </div>

              <div
                className="inv-steps-col"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
                  paddingLeft: 'clamp(20px, 4vw, 40px)',
                }}
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'rgba(198, 162, 101, 0.2)',
                      border: '1px solid rgba(198, 162, 101, 0.5)',
                      color: 'var(--accent-gold, #C6A265)',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      flexShrink: 0,
                    }}
                  >
                    1
                  </div>
                  <div>
                    <h4 style={{ color: '#FFF', margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 600 }}>
                      Asset-Backed Security
                    </h4>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.92rem', margin: 0, lineHeight: 1.6 }}>
                      Your capital is directly backed by physical agricultural and eco-restoration land parcels with clear, unencumbered titles.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'rgba(198, 162, 101, 0.2)',
                      border: '1px solid rgba(198, 162, 101, 0.5)',
                      color: 'var(--accent-gold, #C6A265)',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      flexShrink: 0,
                    }}
                  >
                    2
                  </div>
                  <div>
                    <h4 style={{ color: '#FFF', margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 600 }}>
                      Turnkey Management
                    </h4>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.92rem', margin: 0, lineHeight: 1.6 }}>
                      VanaTvam handles all on-ground operations including legal approvals, soil enrichment, water body creation, and ongoing estate upkeep.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'rgba(198, 162, 101, 0.2)',
                      border: '1px solid rgba(198, 162, 101, 0.5)',
                      color: 'var(--accent-gold, #C6A265)',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      flexShrink: 0,
                    }}
                  >
                    3
                  </div>
                  <div>
                    <h4 style={{ color: '#FFF', margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 600 }}>
                      Profit Distribution
                    </h4>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.92rem', margin: 0, lineHeight: 1.6 }}>
                      At the end of the 2–3 year tenure, developed land proceeds and project returns are distributed among investors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= SECTION 4: LET'S CONNECT / FORM ================= */}
      <section
        id="connect-form"
        style={{
          padding: 'clamp(60px, 8vh, 130px) 20px',
          backgroundColor: 'var(--bg-cream, #F9F8F6)',
          position: 'relative',
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: '1180px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: 'clamp(36px, 6vw, 70px)',
              alignItems: 'center',
            }}
          >
            {/* Left Column Intro */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '14px',
                }}
              >
                <span style={{ width: '24px', height: '1px', background: 'var(--accent-gold)' }} />
                <span
                  style={{
                    color: 'var(--accent-gold)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                  }}
                >
                  LET’S CONNECT
                </span>
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2.4rem, 4.2vw, 3.4rem)',
                  color: 'var(--bg-dark-forest, #122217)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  marginBottom: '22px',
                  fontWeight: 500,
                }}
              >
                Explore an Investment <br />
                <span style={{ color: 'var(--accent-gold)', fontStyle: 'italic' }}>
                  Opportunity
                </span>
              </h2>

              <p
                style={{
                  fontSize: '1.18rem',
                  color: '#4B554D',
                  lineHeight: 1.8,
                  marginBottom: '36px',
                  fontWeight: 300,
                }}
              >
                Share your details to request an initial discussion with our team. We look forward to
                walking you through our upcoming land parcels, stewardship timelines, and value creation models.
              </p>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                  paddingTop: '32px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(198, 162, 101, 0.18)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-gold)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      flexShrink: 0,
                    }}
                  >
                    1
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#122217', margin: '0 0 4px' }}>
                      Confidential Advisory
                    </h4>
                    <p style={{ fontSize: '0.94rem', color: '#687B63', margin: 0, lineHeight: 1.5 }}>
                      Direct consultation with our executive team on project economics and land curation.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(198, 162, 101, 0.18)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-gold)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      flexShrink: 0,
                    }}
                  >
                    2
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#122217', margin: '0 0 4px' }}>
                      Nature-First Profit Distribution
                    </h4>
                    <p style={{ fontSize: '0.94rem', color: '#687B63', margin: 0, lineHeight: 1.5 }}>
                      Transparent models designed for shared long-term capital growth and ecological equity.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Form Card */}
            <motion.div
              className="inv-form-card"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '28px',
                padding: 'clamp(28px, 5vw, 48px)',
                boxShadow: '0 20px 50px rgba(18, 34, 23, 0.08)',
                border: '1px solid rgba(18, 34, 23, 0.08)',
                position: 'relative',
              }}
            >
              {formSubmitted ? (
                <div style={{ textAlign: 'left', padding: '20px 10px' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(82, 183, 136, 0.15)',
                      color: '#2D6A4F',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem',
                      margin: '0 0 20px',
                    }}
                  >
                    <CheckCircle2 size={32} />
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.85rem',
                      color: 'var(--bg-dark-forest, #122217)',
                      marginBottom: '12px',
                    }}
                  >
                    Thank You
                  </h3>
                  <p
                    style={{
                      fontSize: '1.05rem',
                      color: '#4B554D',
                      lineHeight: 1.7,
                      marginBottom: '24px',
                    }}
                  >
                    We have received your details. A VanaTvam investment advisor will reach out to schedule your initial discussion.
                  </p>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({ fullName: '', phone: '', email: '' });
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-gold, #C6A265)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      textDecoration: 'underline',
                    }}
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '24px' }}>
                    <h3
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.85rem',
                        color: 'var(--bg-dark-forest, #122217)',
                        marginBottom: '8px',
                        fontWeight: 500,
                      }}
                    >
                      Request an Initial Discussion
                    </h3>
                    <p style={{ fontSize: '0.95rem', color: '#687B63', margin: 0 }}>
                      Share your details to connect directly with our investment team.
                    </p>
                  </div>

                  {error && (
                    <p
                      style={{
                        margin: '0 0 20px',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: 'rgba(200, 60, 60, 0.08)',
                        border: '1px solid rgba(200, 60, 60, 0.25)',
                        color: '#8A3030',
                        fontSize: '0.88rem',
                      }}
                    >
                      {error}
                    </p>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                    {/* Full Name */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label
                        htmlFor="fullName"
                        style={{
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          color: '#26352B',
                          letterSpacing: '0.02em',
                        }}
                      >
                        Full name
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        style={{
                          width: '100%',
                          minHeight: '52px',
                          padding: '12px 18px',
                          border: '1px solid #DCE1DA',
                          borderRadius: '14px',
                          background: '#FDFCFB',
                          color: '#26352B',
                          fontSize: '1rem',
                          outline: 'none',
                          transition: 'all 0.25s ease',
                          fontFamily: 'inherit',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = 'var(--accent-gold, #C6A265)';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(198, 162, 101, 0.18)';
                          e.currentTarget.style.background = '#FFFFFF';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#DCE1DA';
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.background = '#FDFCFB';
                        }}
                      />
                    </div>

                    {/* Phone Number */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label
                        htmlFor="phone"
                        style={{
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          color: '#26352B',
                          letterSpacing: '0.02em',
                        }}
                      >
                        Phone number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={{
                          width: '100%',
                          minHeight: '52px',
                          padding: '12px 18px',
                          border: '1px solid #DCE1DA',
                          borderRadius: '14px',
                          background: '#FDFCFB',
                          color: '#26352B',
                          fontSize: '1rem',
                          outline: 'none',
                          transition: 'all 0.25s ease',
                          fontFamily: 'inherit',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = 'var(--accent-gold, #C6A265)';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(198, 162, 101, 0.18)';
                          e.currentTarget.style.background = '#FFFFFF';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#DCE1DA';
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.background = '#FDFCFB';
                        }}
                      />
                    </div>

                    {/* Email Address */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label
                        htmlFor="email"
                        style={{
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          color: '#26352B',
                          letterSpacing: '0.02em',
                        }}
                      >
                        Email address
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        placeholder="yourname@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{
                          width: '100%',
                          minHeight: '52px',
                          padding: '12px 18px',
                          border: '1px solid #DCE1DA',
                          borderRadius: '14px',
                          background: '#FDFCFB',
                          color: '#26352B',
                          fontSize: '1rem',
                          outline: 'none',
                          transition: 'all 0.25s ease',
                          fontFamily: 'inherit',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = 'var(--accent-gold, #C6A265)';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(198, 162, 101, 0.18)';
                          e.currentTarget.style.background = '#FFFFFF';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#DCE1DA';
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.background = '#FDFCFB';
                        }}
                      />
                    </div>

                    <Magnetic strength={0.15}>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-pill btn-pill-gold"
                        style={{
                          width: '100%',
                          minHeight: '56px',
                          marginTop: '8px',
                          justifyContent: 'center',
                          fontSize: '0.92rem',
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {submitting ? 'SENDING...' : 'REQUEST AN INVESTMENT DISCUSSION'}
                        <ArrowRight className="size-4" />
                      </button>
                    </Magnetic>

                    <p
                      style={{
                        margin: '6px 0 0',
                        textAlign: 'left',
                        color: '#7B857D',
                        fontSize: '0.78rem',
                        lineHeight: 1.5,
                      }}
                    >
                      Your information is held in strict confidence and used solely to coordinate your consultation.
                    </p>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= DISCLAIMERS & SOURCES SECTION ================= */}
      <section
        style={{
          backgroundColor: 'var(--bg-dark-forest, #122217)',
          color: '#95A599',
          padding: '60px 20px 80px',
          borderTop: '1px solid rgba(198, 162, 101, 0.2)',
          fontSize: '0.85rem',
          lineHeight: 1.7,
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: '1180px',
            margin: '0 auto',
          }}
        >
          {/* Regulatory Disclaimer */}
          <div
            className="inv-disclaimer-box"
            style={{
              padding: '22px 28px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(198, 162, 101, 0.2)',
              marginBottom: '28px',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(198, 162, 101, 0.15)',
                color: 'var(--accent-gold)',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
                marginTop: '2px',
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <p
              style={{
                color: '#DCE1DA',
                fontSize: '0.88rem',
                margin: 0,
                lineHeight: 1.7,
              }}
            >
              <strong style={{ color: 'var(--accent-gold)' }}>Disclaimer: </strong>
              Land investments carry risk and returns are not guaranteed. This page is for
              information only and is not investment advice. Please consult a qualified financial
              advisor before you decide.
            </p>
          </div>

          {/* Sources */}
          <div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.65)',
                fontSize: '0.82rem',
                margin: 0,
                lineHeight: 1.8,
              }}
            >
              <strong style={{ color: '#F9F8F6' }}>Sources: </strong>
              Jean Lombard, &ldquo;The Best Investment Move in Uncertain Times&rdquo; (cover.co.za);
              FarmTogether, &ldquo;Farmland: A Historically Stable Asset During Uncertain Times&rdquo;;
              Robert Shiller interview, reported by HousingWire (2013); Nifty/Sensex 2026 performance,
              Business Standard / NSE / BSE data; Nasdaq correction, Reuters via StreetInsider (26 Mar
              2026); S&P 500 and Nasdaq YTD levels, Tapeboard Market Pulse (1 Oct 2026) and ChartRow (22
              Oct 2026); India 10-year yield, Trading Economics.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
