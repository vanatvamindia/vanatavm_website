"use client";

/**
 * Remembers where a visitor came from, so each lead can be traced to a campaign or page.
 *
 * Recorded once per browser session (sessionStorage), on the first page of the visit:
 *   - landingPage: the first path they opened
 *   - referrer:    the external site they came from (blank for direct visits / same-site)
 *   - utm_*:       campaign tags from the URL, e.g. ?utm_source=whatsapp&utm_campaign=diwali
 *
 * A later landing URL that carries utm_source replaces the stored values, because that is a
 * fresh campaign click. Internal links are never tagged: tagging them would overwrite the
 * visitor's real source in analytics tools.
 */

const STORAGE_KEY = "vt_attribution";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export type Attribution = {
  landingPage?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
};

function externalReferrer(): string | undefined {
  try {
    if (!document.referrer) return undefined;
    const ref = new URL(document.referrer);
    if (ref.hostname === window.location.hostname) return undefined;
    return ref.origin + ref.pathname;
  } catch {
    return undefined;
  }
}

export function captureAttribution(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    const hasCampaign = params.has("utm_source");
    const existing = sessionStorage.getItem(STORAGE_KEY);
    if (existing && !hasCampaign) return;

    const record: Attribution = {
      landingPage: window.location.pathname,
      referrer: externalReferrer(),
    };
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) record[key] = value.slice(0, 120);
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Storage can be blocked (private mode, strict settings). Attribution is best-effort.
  }
}

export function getAttribution(): Attribution {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}
