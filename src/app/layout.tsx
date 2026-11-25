import AttributionCapture from "@/app/components/AttributionCapture";
import JsonLd from "@/components/JsonLd";
import { siteGraph } from "@/lib/schema";
import MarketingShell from "@/app/components/MarketingShell";
import { cinzel, playfair, plusJakarta } from "@/app/fonts";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";


export const metadata: Metadata = {
  metadataBase: new URL("https://www.vanatvam.com"),
  title: {
    default: "VanaTvam | Sustainable Managed Farmland & Nature Communities",
    template: "%s | VanaTvam"
  },
  description: "VanaTvam creates sustainable managed farmland, native forest ecosystems, and nature communities across Karnataka & near Bangalore. Discover Brindavana, Madhuvana, Anantavana, and Ishavana.",
  keywords: [
    "Managed Farmland Bangalore", "Managed Farmland Karnataka", "Sustainable Farmland Karnataka",
    "Farm Plots Near Bangalore", "Agricultural Land Investment Karnataka", "Eco Friendly Farm Communities",
    "Nakshatra Vana Forest", "Navagraha Vana", "Natural Sustainable Farm Communities",
    "Farmland Investment Karnataka", "Biodiversity Restoration Karnataka", "Native Forest Restoration Karnataka",
    "Nature Communities Bangalore", "Weekend Farm Near Bangalore", "Farmhouse Plots Karnataka",
    "Brindavana Pavagada", "Madhuvana Maddur", "Anantavana Kabini", "Ishavana Kaveri Riverfront",
  ],
  authors: [{ name: "VanaTvam Private Limited" }],
  openGraph: {
    title: "VanaTvam | Sustainable Managed Farmland",
    description: "Experience living ecosystems with VanaTvam's sustainable managed farmlands in Karnataka.",
    url: "https://www.vanatvam.com",
    siteName: "VanaTvam",
    images: [
      {
        url: "/assets/project-images/Brindavana/sunny-tropical-banana-orchard.webp",
        width: 1200,
        height: 630,
        alt: "VanaTvam Nature Communities",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "VanaTvam | Sustainable Managed Farmland",
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${cinzel.variable} ${playfair.variable} ${plusJakarta.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Hero images are preloaded by each page via preloadHero() (src/lib/preloadHero.ts),
            so pages don't download the home page's hero. */}

        <JsonLd data={siteGraph()} />

        {/* Meta Pixel (ID: 533734545131272) loaded during idle time */}
        <Script
          id="fb-pixel"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '533734545131272');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=533734545131272&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <AttributionCapture />
        <MarketingShell>{children}</MarketingShell>
      </body>
    </html>
  );
}