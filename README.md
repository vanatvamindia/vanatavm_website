# VanaTvam — Sustainable Natural Farm Communities

VanaTvam is a luxury eco-estate web platform showcasing nature-first farm communities across Karnataka, including AnantaVana, Ishavana, MadhuVana, and BrindaVana.
Built using Next.js 16, TypeScript, Tailwind CSS, and Framer Motion, it features interactive 3D project tunnels, ecological impact metrics, and master plan galleries.
The platform highlights sustainable land stewardship, native afforestation, and sacred grove revival while providing seamless site-visit bookings and investor advisory inquiries.

## Images: run `npm run images` after adding or changing photos

The site is hosted on Zoho Catalyst, which cannot resize images on request (Next.js's
`/_next/image` returns HTTP 500 there). Instead, resized copies are generated ahead of time and
committed:

- `npm run images` scans `src/` for every referenced image under `public/assets`, `public/event-images`
  and `public/Blogs-content`, writes resized copies to `public/_img/`, and updates
  `src/data/image-variants.json`. It only regenerates what changed and deletes copies that are no
  longer used.
- `npm run images -- --check` exits with an error if any referenced image is missing its copies.
- In code, use `responsiveImg(src, sizes)` from `src/lib/responsiveImage.ts` on `<img>` tags, and
  `next/image` as usual (a custom loader in `src/lib/imageLoader.ts` picks the right copy).
  Full-screen heroes also use `<PortraitSource>` and `preloadHero()`.
- Upload photos at their best available resolution (at least 2560px wide for full-screen heroes).
  Visitors only download the size their screen needs, so large originals no longer slow the site.
- An image without generated copies still works; it just isn't resized.

## Hosting-specific settings

`src/lib/hosting.ts` and `next.config.ts` contain settings tuned for Catalyst (link prefetching off,
CSS inlined into the HTML). Each has a comment explaining what to change on a host with a CDN,
such as Vercel.

Catalyst answers every request slowly and does not cache; putting Cloudflare's free CDN in front
removes most of that delay. Step-by-step setup (including the purge-after-deploy step):
[`docs/CLOUDFLARE.md`](docs/CLOUDFLARE.md).
