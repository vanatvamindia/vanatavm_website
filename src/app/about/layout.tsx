import { ReactNode } from "react";

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link
        rel="preload"
        href="/assets/project-images/Brindavana/sunny-tropical-banana-orchard-mobile.webp"
        as="image"
        type="image/webp"
        media="(max-width: 768px)"
      />
      <link
        rel="preload"
        href="/assets/project-images/Brindavana/sunny-tropical-banana-orchard.webp"
        as="image"
        type="image/webp"
        media="(min-width: 769px)"
      />
      {children}
    </>
  );
}
