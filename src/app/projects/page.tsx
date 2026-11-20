'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import Link from '@/components/ui/AppLink';
import RevealText from '@/components/premium/RevealText';
import { riseStyle } from '@/lib/rise';
import Magnetic from '@/components/premium/Magnetic';
import TiltCard from '@/components/premium/TiltCard';
import ProjectTunnel from '@/components/premium/ProjectTunnel';
import BrochureModal from '@/components/premium/LazyBrochureModal';
import { responsiveImg } from '@/lib/responsiveImage';
import PortraitSource from '@/components/ui/PortraitSource';
import { preloadHero } from '@/lib/preloadHero';

export default function Projects() {
  preloadHero('/assets/project-images/Brindavana/tropical-garden-pathway-tunnel.webp');
  const [filter, setFilter] = useState('all');
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState({
    name: 'AnantaVana',
    brochureUrl: '/assets/project-images/AnantaVana-Brochure.pdf',
  });

  const projects = [
     {
      id: 'brindavana',
      category: 'completed',
      name: 'BRINDAVANA',
      logo: '/assets/images/Project-Logos/1.webp',
      location: 'PAVAGADA · 30 ACRES',
      desc: 'Our first project demonstrating ecological restoration. What began as largely barren land has evolved into a thriving green ecosystem with over 3000+ mature trees.',
      img: '/assets/project-images/Brindavana/brindavanaaa.webp',
      brochure: null,
       
      badgeBg: 'var(--bg-dark-forest)',
       
    },

     {
      id: 'madhuvana',
      category: 'water',
      name: 'MADHUVANA',
      logo: '/assets/images/Project-Logos/2.webp',
      location: 'MADDUR - 17 Acres',
      desc: 'A pristine channel bound ecosystem built around 200+ rare & endangered tree species. Features sacred groves like Vinayaka Vana, and cozy cottages designed for peaceful living for our community owners.',
      img: '/assets/project-images/Maduvana/hero.webp',
      brochure: '/assets/project-images/MadhuVana-Brochure.pdf',
       
      badgeBg: 'var(--accent-gold)',
     
    },
     
    {
      id: 'anantavana',
      category: 'wildlife',
      name: 'ANANTAVANA',
      logo: '/assets/images/Project-Logos/3.webp',
      location: 'NEAR KABINI · 34 ACRES',
      desc: 'A nature-rich ecosystem nestled in Kabini’s thriving biodiversity belt, surrounded by pristine forests and abundant wildlife. A peaceful forest community offering thoughtfully planned farm parcels where life unfolds closer to nature.',
      img: '/assets/project-images/Ananthavana/hero-image-2.webp',
      brochure: '/assets/project-images/AnantaVana-Brochure.pdf',
       
      badgeBg: '#2D6A4F',
       
    },
    
    {
      id: 'ishavana',
      category: 'riverfront',
      name: 'ISHAVANA',
      logo: '/assets/images/Project-Logos/4.webp',
      location: 'Shivanasamudra - 10 Acres',
      desc: 'Our premier riverfront community set along the banks of the sacred Kaveri river. Designed around the deep relationship between people, riparian ecology, and water.',
      img: '/assets/project-images/Esahavana/EV.webp',
      brochure: '/assets/project-images/Eeshavana-Brochure.pdf',
      
      badgeBg: '#1B4965',
       
    },
  ];

  const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  const filters = [
    { key: 'all', label: 'All Communities' },
    { key: 'completed', label: 'Completed' },
    { key: 'water', label: 'Water Forest' },
    { key: 'wildlife', label: 'Wildlife Corridor' },
    { key: 'riverfront', label: 'Riverfront' },
    { key: 'forest', label: 'Mountain & Forest' },
    { key: 'nature', label: 'Nature Community' },
  ];

  return (
    <>
      <Navigation />

      <section className="hero" style={{ height: '100vh', minHeight: '600px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <picture>
            <PortraitSource src="/assets/project-images/Brindavana/tropical-garden-pathway-tunnel.webp" />
            <img
              {...responsiveImg('/assets/project-images/Brindavana/tropical-garden-pathway-tunnel.webp')}
              alt="Projects Background"
              fetchPriority="high"
              loading="eager"
              decoding="sync"
              width={1920}
              height={1080}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </picture>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(18, 34, 23, 0.35) 0%, rgba(18, 34, 23, 0.8) 100%)' }}></div>
        </div>

        <div className="container relative" style={{ zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', paddingTop: '80px' }}>
          <div className="vt-rise" style={riseStyle(0, { y: '30px' })}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(3.5rem, 6.5vw, 6rem)', color: '#FFF', lineHeight: 0.95, marginBottom: '24px', letterSpacing: '-0.02em', textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}>
              <RevealText immediate>Explore our</RevealText><br/>
              <RevealText immediate delay={0.1} style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>Natural communities.</RevealText>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.3rem', maxWidth: '640px', lineHeight: 1.6, textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
             In Bangalore Mysore Chamarajanagar corridor. Where nature heritage and culture come together.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: 'clamp(60px, 8vh, 90px) 0', background: 'var(--bg-cream)' }}>
        <div className="container project-list-container">
          <motion.div
            className="project-cards-grid"
            layout
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: '24px',
            }}
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map(proj => (
                <motion.div 
                  key={proj.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                  whileHover={{ y: -15, boxShadow: '0 30px 60px rgba(0,0,0,0.12)' }}
                  style={{ background: '#FFF', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', border: '1px solid rgba(0,0,0,0.03)' }}
                >
                  <TiltCard max={4} style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
                    <motion.img 
                      whileHover={{ scale: 1.05 }} 
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      {...responsiveImg(proj.img, '(max-width: 768px) 130vw, 100vw')} alt={proj.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />

                  </TiltCard>
                  <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '4px', display: 'block', textTransform: 'uppercase' }}>{proj.location}</span>
                    
                    {proj.logo ? (
                      <div
                        className="project-card-logo-container"
                        style={{
                          margin: '2px 0 10px 0',
                          padding: '0',
                          height: '70px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                        }}
                      >
                        <img
                          {...responsiveImg(proj.logo, '(max-width: 768px) 45vw, 14vw')}
                          alt={proj.name}
                          loading="lazy"
                          decoding="async"
                          width={180}
                          height={42}
                          style={{
                            height: 'auto',
                            width: '170px',
                            maxWidth: '100%',
                            objectFit: 'contain',
                            objectPosition: 'left center',
                            display: 'block',
                          }}
                        />
                      </div>
                    ) : (
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--bg-dark-forest)', margin: '4px 0 10px 0' }}>{proj.name}</h3>
                    )}

                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>{proj.desc}</p>
                    
                   

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <Magnetic strength={0.15} style={{ display: 'block', width: '100%' }}>
                        <Link href={`/${proj.id}`} className="btn-pill btn-pill-dark" style={{ justifyContent: 'center', width: '100%' }}>
                          Explore Project
                        </Link>
                      </Magnetic>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProject({
                            name: proj.name,
                            brochureUrl: proj.brochure || '/assets/project-images/AnantaVana-Brochure.pdf',
                          });
                          setIsBrochureOpen(true);
                        }}
                        className="btn-pill btn-pill-project-brochure"
                        style={{ justifyContent: 'center', width: '100%', cursor: 'pointer', border: 'none' }}
                      >
                        Download Brochure ↓
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
        <style jsx>{`
          .project-list-container {
            padding-right: 20px !important;
            padding-left: 20px !important;
          }

          @media (max-width: 850px) {
            .project-cards-grid {
              grid-template-columns: minmax(0, 1fr) !important;
              gap: 28px !important;
            }

            .project-list-container {
              padding-right: 20px !important;
              padding-left: 20px !important;
            }

            .project-card-logo-container {
              margin: 4px 0 10px 0 !important;
              padding: 0 !important;
              height: 70px !important;
              min-height: 70px !important;
            }
          }
        `}</style>
      </section>

      <ProjectTunnel items={projects} />

      <BrochureModal
        isOpen={isBrochureOpen}
        onClose={() => setIsBrochureOpen(false)}
        projectName={selectedProject.name}
        brochureUrl={selectedProject.brochureUrl}
      />

      <Footer />
    </>
  );
}
