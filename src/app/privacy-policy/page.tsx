import { riseStyle } from '@/lib/rise';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  path: '/privacy-policy',
  description: 'How VanaTvam collects, uses and protects your personal information.',
});

export default function PrivacyPolicy() {
  return (
    <>
      <Navigation />
      
      <section style={{ padding: 'clamp(120px, 15vh, 160px) 0 clamp(60px, 8vh, 90px)', background: 'var(--bg-cream)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="vt-rise" style={riseStyle(0, { y: '20px' })}>
            <span style={{ color: 'var(--accent-gold)', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.1em' }}>LEGAL</span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--bg-dark-forest)', marginTop: '20px', marginBottom: '40px', lineHeight: 1.15 }}>Privacy Policy</h1>
            
            <div className="legal-content" style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-dark)' }}>
              <p style={{ marginBottom: '20px' }}>Last Updated: November 2026</p>
              
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--bg-dark-forest)', marginTop: '40px', marginBottom: '15px' }}>1. Introduction</h3>
              <p style={{ marginBottom: '20px' }}>
               VanaTvam Private Limited ("we", "our", or "us") respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
              </p>

              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--bg-dark-forest)', marginTop: '40px', marginBottom: '15px' }}>2. The Data We Collect About You</h3>
              <p style={{ marginBottom: '20px' }}>
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
                <li style={{ marginBottom: '10px' }}><strong>Contact Data</strong> includes your name, phone number and email address.</li>
                <li style={{ marginBottom: '10px' }}><strong>Enquiry Data</strong> includes the project you are interested in, your preferred visit date, and any message you send us.</li>
                <li style={{ marginBottom: '10px' }}><strong>Usage Data</strong> includes the pages you visit, the website you came from, and any campaign tags in the link you clicked.</li>
              </ul>

              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--bg-dark-forest)', marginTop: '40px', marginBottom: '15px' }}>3. How We Use Your Personal Data</h3>
              <p style={{ marginBottom: '20px' }}>
                We use your personal data to:
              </p>
              <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
                <li style={{ marginBottom: '10px' }}>Respond to your enquiry, arrange site visits, and send you the information you ask for.</li>
                <li style={{ marginBottom: '10px' }}>Understand which pages and campaigns bring us enquiries, so we can improve our website.</li>
                <li style={{ marginBottom: '10px' }}>Meet our legal and regulatory obligations.</li>
              </ul>
              <p style={{ marginBottom: '20px' }}>
                We do not sell your personal data.
              </p>

              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--bg-dark-forest)', marginTop: '40px', marginBottom: '15px' }}>4. Third Parties and Cookies</h3>
              <p style={{ marginBottom: '20px' }}>
                We store enquiries using trusted service providers (Sanity for records and Zoho for managing follow-ups). Our website also uses a Meta (Facebook) Pixel to measure our advertising, and embeds Google Maps and YouTube, which may set their own cookies. You can control cookies in your browser settings. To ask us to correct or delete your details, email info@vanatvam.com.
              </p>

              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--bg-dark-forest)', marginTop: '40px', marginBottom: '15px' }}>5. Data Security</h3>
              <p style={{ marginBottom: '20px' }}>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
              </p>

              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--bg-dark-forest)', marginTop: '40px', marginBottom: '15px' }}>6. Contact Us</h3>
              <p style={{ marginBottom: '20px' }}>
                If you have any questions about this privacy policy, please contact us at:<br /><br />
                <strong>VanaTvam Private Limited</strong><br />
                #5, Anjanadri Plaza, 2nd Floor, Girinagar 1st Phase,<br />
                Bangalore – 560085<br />
                Email: info@vanatvam.com<br />
                CIN: U01100KA2022PTC159587
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
