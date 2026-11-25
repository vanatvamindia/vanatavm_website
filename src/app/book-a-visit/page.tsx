'use client';
import { useState } from 'react';
import { m as motion } from 'framer-motion';
import { getAttribution } from '@/lib/attribution';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import RevealText from '@/components/premium/RevealText';
import { riseStyle } from '@/lib/rise';
import PortraitSource from '@/components/ui/PortraitSource';
import { responsiveImg } from '@/lib/responsiveImage';
import { preloadHero } from '@/lib/preloadHero';

export default function BookAVisit() {
  preloadHero('/assets/project-images/Brindavana/sunny-tropical-banana-orchard.webp');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      project: formData.get('project'),
      message: formData.get('message'),
      source: 'book-a-visit',
      page: window.location.pathname,
      ...getAttribution(),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
      e.currentTarget.reset();
    } catch (err) {
      console.error('Visit request submission error:', err);
      setError('Something went wrong. Please call or WhatsApp us directly.');
    }

    setSubmitting(false);
  };

  return (
    <>
      <Navigation />
      <section className="hero hero-about" style={{ height: '60vh', minHeight: '500px' }}>
        <div className="hero-bg-wrapper">
          <picture>
            <PortraitSource src="/assets/project-images/Brindavana/sunny-tropical-banana-orchard.webp" />
            <img
              {...responsiveImg('/assets/project-images/Brindavana/sunny-tropical-banana-orchard.webp')}
              alt="Book a Visit to VanaTvam"
              className="hero-bg-img"
              fetchPriority="high"
              loading="eager"
              decoding="sync"
            />
          </picture>
        </div>
        <div className="hero-overlay" style={{ background: 'linear-gradient(180deg, rgba(18, 34, 23, 0.4) 0%, rgba(18, 34, 23, 0.9) 100%)' }}></div>
        <div className="container relative z-10">
          <div className="hero-content" style={{ alignItems: 'center', textAlign: 'center' }}>
            <span className="hero-subtitle vt-rise" style={riseStyle(0, { y: '30px' })}>EXPERIENCE THE LAND</span>
            <h1 className="hero-title" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}>
              <RevealText immediate delay={0.2}>Book a Site Visit</RevealText>
            </h1>
            <p className="hero-desc vt-rise" style={riseStyle(0.4, { y: '30px' }, { margin: '0 auto', maxWidth: '700px' })}>
              Step into our living ecosystems. Schedule a private guided tour of our sustainable managed farmlands in Karnataka.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '90px 0', background: 'var(--bg-cream)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ background: '#FFFFFF', padding: 'clamp(30px, 5vw, 60px)', borderRadius: 'var(--radius-md)', boxShadow: '0 15px 40px rgba(0,0,0,0.06)', border: '1px solid var(--border-light)', maxWidth: '800px', margin: '0 auto' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span className="subtitle-tag">RESERVATION FORM</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '15px', color: 'var(--bg-dark-forest)' }}>Confirm Your Visit</h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>Select your preferred community and our team will coordinate the perfect date for your guided ecological tour.</p>
            </div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--bg-dark-forest)', margin: '0 0 10px' }}>
                  Thank You!
                </h3>
                <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>
                  Your visit request has been received. Our team will contact you shortly to confirm the details.
                </p>
              </div>
            ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <p
                  style={{
                    margin: '0 0 20px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(200, 60, 60, 0.08)',
                    border: '1px solid rgba(200, 60, 60, 0.25)',
                    color: '#8A3030',
                    fontSize: '0.88rem',
                  }}
                >
                  {error}
                </p>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '20px', marginBottom: '25px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Full Name</label>
                  <input type="text" name="name" className="form-control" placeholder="Enter your full name" required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Phone Number</label>
                  <input type="tel" inputMode="tel" autoComplete="tel" pattern="[0-9+ \-]{10,15}" title="Enter a valid phone number, for example +91 98765 43210" name="phone" className="form-control" placeholder="+91 98765 43210" required />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '25px' }}>
                <label>Email Address</label>
                <input type="email" name="email" className="form-control" placeholder="yourname@domain.com" required />
              </div>
              <div className="form-group" style={{ marginBottom: '25px' }}>
                <label>Preferred Community</label>
                <select name="project" className="form-control" defaultValue="">
                  <option value="" disabled>Select a location...</option>
                  <option value="brindavana">Brindavana (Pavagada · 30 Acres · Completed)</option>
                  <option value="madhuvana">Madhuvana (Maddur · 17 Acres · Water Forest)</option>
                  <option value="anantavana">Anantavana (Kabini · 34 Acres · Wildlife Corridor)</option>
                  <option value="ishavana">Ishavana (Shivanasamudra · Kaveri Riverfront)</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '35px' }}>
                <label>Preferred Date / Additional Notes</label>
                <textarea name="message" className="form-control" rows={4} placeholder="When would you like to visit? Any specific requirements?"></textarea>
              </div>
              <button type="submit" disabled={submitting} className="btn-pill btn-pill-dark" style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '16px' }}>
                {submitting ? 'Submitting...' : 'Submit Visit Request'}
              </button>
            </form>
            )}
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  );
}
