/**
 * Settings that depend on where the site is hosted.
 *
 * PREFETCH_LINKS — Next.js normally pre-downloads linked pages in the background so clicks feel
 * instant. On Zoho Catalyst those background requests (`?_rsc=…`) return 404, so they only waste
 * bandwidth and server time; clicks fall back to a normal page load either way. Keep `false` on
 * Catalyst. Set `true` on a host that serves them (e.g. Vercel, or `next start` locally).
 */
export const PREFETCH_LINKS = false;
