'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import Link from '@/components/ui/AppLink';
import Image from 'next/image';
import { BlogPostItem } from '@/data/blogs';
import { resolvePostImage } from '@/sanity/image';
import { riseStyle } from '@/lib/rise';
import RevealText from '@/components/premium/RevealText';
import PortraitSource from '@/components/ui/PortraitSource';
import { responsiveImg } from '@/lib/responsiveImage';
import { preloadHero } from '@/lib/preloadHero';

const HERO_IMG = '/assets/images/Biodiversity.webp';

interface BlogClientProps {
  initialBlogs: BlogPostItem[];
}

export default function BlogClient({ initialBlogs }: BlogClientProps) {
  preloadHero(HERO_IMG);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return initialBlogs.filter((b) => {
      const matchesCategory =
        selectedCategory === 'All' || b.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [initialBlogs, selectedCategory, searchQuery]);

  return (
    <>
      <Navigation />

      <style>{`
        @media (max-width: 900px) {
          .blog-hero-section {
            padding-top: clamp(170px, 22vh, 210px) !important;
            padding-bottom: 50px !important;
            min-height: auto !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
          .blog-hero-container {
            padding-left: 0 !important;
            max-width: 100% !important;
          }
          .blog-hero-h1 {
            font-size: clamp(2.2rem, 7.5vw, 3.8rem) !important;
          }
          .blog-hero-badge span:last-child {
            font-size: 0.75rem !important;
            letter-spacing: 0.12em !important;
          }
        }
      `}</style>

      {/* Hero Header */}
      <section
        className="hero blog-hero-section"
        style={{
          minHeight: '100vh',
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
            <PortraitSource src={HERO_IMG} />
            <img
              {...responsiveImg(HERO_IMG)}
              alt="Vanatvam articles on natural farming and forest living"
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
                'linear-gradient(180deg, rgba(18, 34, 23, 0.35) 0%, rgba(18, 34, 23, 0.6) 70%, #122217 100%)',
            }}
          />
        </motion.div>

        <div
          className="container blog-hero-container"
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'left',
            maxWidth: '960px',
            margin: '0 auto 0 0',
            paddingLeft: 'clamp(58px, 10vw, 180px)',
          }}
        >
          <div
            className="blog-hero-badge vt-rise"
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
              Vanatvam Articles
            </span>
          </div>

          <h1
            className="blog-hero-h1"
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
            <RevealText immediate>Stories</RevealText>{' '}
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
              from the Soil.
            </RevealText>
          </h1>

          <p
            className="vt-rise"
            style={riseStyle(0.2, { y: '20px' }, {
              fontSize: 'clamp(1.1rem, 2vw, 1.32rem)',
              color: 'rgba(249, 248, 246, 0.88)',
              lineHeight: 1.7,
              fontWeight: 300,
              maxWidth: '740px',
              margin: 0,
            })}
          >
            Insights, updates, and deep dives into ecological restoration, Vedic forest science,
            natural farm communities, and sustainable wealth creation.
          </p>
        </div>
      </section>

      {/* Filter and Content Section */}
      <section
        style={{
          position: 'relative',
          padding: '60px 20px 100px',
          background: 'var(--bg-cream, #F9F8F6)',
          minHeight: '60vh',
        }}
      >
        <div className="container" style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Articles Grid (1x1 Aspect Ratio Cards) */}
          {filteredBlogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#687B63' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#122217', marginBottom: '10px' }}>
                No articles found
              </h3>
              <p>Try selecting another category or clearing your search query.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                style={{
                  marginTop: '16px',
                  padding: '10px 22px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--bg-dark-forest, #122217)',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 290px), 1fr))',
                gap: 'clamp(24px, 4vw, 36px)',
              }}
            >
              {filteredBlogs.map((blog, i) => (
                <motion.article
                  key={blog.id}
                  // First row is above the fold: render it visible in the server HTML so the
                  // cover image can paint immediately; later cards keep the scroll fade-in.
                  initial={i < 3 ? false : { opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.3) }}
                  whileHover={{ y: -8 }}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.04)',
                    border: '1px solid rgba(40, 44, 39, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Link
                    href={`/blog/${blog.id}`}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                    }}
                  >
                    {/* 1x1 Aspect Ratio Thumbnail Image Container */}
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '1 / 1',
                        overflow: 'hidden',
                        backgroundColor: '#16261B',
                      }}
                    >
                      <Image
                        src={resolvePostImage(blog)}
                        alt={blog.title}
                        fill
                        preload={i === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{
                          objectFit: 'cover',
                          transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                        }}
                        className="blog-card-img"
                      />
                      <span
                        style={{
                          position: 'absolute',
                          top: 18,
                          left: 18,
                          background: 'rgba(255, 255, 255, 0.95)',
                          color: 'var(--bg-dark-forest, #122217)',
                          padding: '5px 14px',
                          borderRadius: '999px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          backdropFilter: 'blur(6px)',
                        }}
                      >
                        {blog.category}
                      </span>
                    </div>

                    {/* Content Section */}
                    <div
                      style={{
                        padding: '28px',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.82rem',
                          color: 'var(--text-muted, #687B63)',
                          marginBottom: '12px',
                          fontWeight: 500,
                        }}
                      >
                        {blog.date} · {blog.author}
                      </div>

                      <h3
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.42rem',
                          color: 'var(--bg-dark-forest, #122217)',
                          marginBottom: '14px',
                          lineHeight: 1.35,
                          fontWeight: 600,
                        }}
                      >
                        {blog.title}
                      </h3>

                      <p
                        style={{
                          color: '#4B554D',
                          fontSize: '0.96rem',
                          lineHeight: 1.65,
                          flex: 1,
                          fontWeight: 300,
                          margin: 0,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {blog.excerpt}
                      </p>

                      <div
                        style={{
                          color: 'var(--brand-earth-brown, #72351C)',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          marginTop: '22px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Read Article <span>→</span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

