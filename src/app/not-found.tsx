import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import Link from "@/components/ui/AppLink";

export const metadata = {
  title: "Page not found | VanaTvam",
  robots: { index: false },
};

const pill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "13px 28px",
  borderRadius: 999,
  fontSize: "0.9rem",
  fontWeight: 600,
  letterSpacing: "0.04em",
  textDecoration: "none",
  border: "1px solid #C6A265",
};

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main
        style={{
          width: "100%",
          boxSizing: "border-box",
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "160px 24px 80px",
          background: "var(--bg-cream, #F4F1EA)",
          color: "#183023",
        }}
      >
        <p style={{ margin: 0, color: "#987443", fontWeight: 700, letterSpacing: "0.2em", fontSize: "0.8rem" }}>
          ERROR 404
        </p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", margin: "12px 0" }}>
          We couldn&apos;t find that page
        </h1>
        <p style={{ maxWidth: 480, margin: "0 0 28px", lineHeight: 1.6, color: "#35483A" }}>
          The link may be old or mistyped. Head back home to continue exploring VanaTvam.
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/" style={{ ...pill, background: "#C6A265", color: "#122217" }}>Go to home</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
