# Putting Cloudflare (free plan) in front of Zoho Catalyst

Zoho Catalyst takes about 1.5–3 seconds to answer every request, including images, fonts and
scripts, and its own CDN does not cache them (`X-Nimbus-Cache: MISS` on every response).
Cloudflare's free plan keeps copies on servers in India (Mumbai, Chennai, Delhi, Bengaluru,
Hyderabad, Kolkata), so after the first visit most requests never reach Catalyst.

No code changes are needed: the site already sends `Cache-Control: public, max-age=31536000,
immutable` for `/_next/static`, `/assets`, `/_img`, `/fonts`, `/event-images` and `/Blogs-content`.

## 1. Add the domain to Cloudflare

1. Create a free account at cloudflare.com → **Add a site** → enter `vanatvam.com` → **Free** plan.
2. Cloudflare imports the existing DNS records. Check that the record for `www` (and the root
   domain, if used) points to Catalyst exactly as it does today, and that it is **Proxied**
   (orange cloud).
3. At your domain registrar, replace the nameservers with the two Cloudflare gives you.
   Propagation usually takes minutes, occasionally up to 24 hours.
4. **SSL/TLS → Overview → Full (strict).** Catalyst already serves a valid certificate.
5. Before switching nameservers, confirm in the Catalyst console that the custom domain keeps
   working behind a proxy (domain verification can require a DNS record that must stay
   **DNS only**, grey cloud).

## 2. Cache rules (Caching → Cache Rules)

Create these rules in this order. Cloudflare applies every matching rule from top to bottom and
later rules win, so the bypass rule must stay **last**.

| # | Name | When incoming requests match | Then |
|---|------|------------------------------|------|
| 1 | Pages | Hostname equals `www.vanatvam.com` | Eligible for cache · Edge TTL: **override, 10 minutes** · Browser TTL: **respect origin** |
| 2 | Static files | URI Path starts with `/_next/static` or `/_img` or `/assets` or `/fonts` or `/event-images` or `/Blogs-content` | Eligible for cache · Edge TTL: **use origin cache-control** |
| 3 | Never cache admin/API | URI Path starts with `/admin` **or** starts with `/api` | **Bypass cache** |

Rule 1 makes the HTML itself fast. Ten minutes keeps blog edits and content changes visible
quickly; raise it if content changes rarely. Rule 3 keeps the admin area, logins and form
submissions going straight to Catalyst.

## 3. After every deploy: purge the cache (important)

Each deploy produces new JavaScript file names. If Cloudflare keeps serving the old HTML, it
can reference files that no longer exist and the page breaks until the cache expires.

**Caching → Configuration → Purge Everything** right after each Catalyst deploy finishes
(or purge only the page URLs if you prefer). This can be automated later with Cloudflare's
API (`POST /zones/{zone_id}/purge_cache` with `{"purge_everything": true}`).

## 4. Check it works

```bash
curl -sI https://www.vanatvam.com/ | grep -i -E "cf-cache-status|server"
# first request: cf-cache-status: MISS, repeat it: cf-cache-status: HIT
```

## Leaving Cloudflare later

If the site moves to a host with its own CDN (e.g. Vercel), switch the nameservers back or set
the records to **DNS only**, and see the comments in `next.config.ts` (`inlineCss`) and
`src/lib/hosting.ts` (`PREFETCH_LINKS`) for settings to revert.
