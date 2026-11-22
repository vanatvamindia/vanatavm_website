/** Where a lead came from. All fields are optional and best-effort (visitors can block storage). */
export type LeadAttribution = {
  /** Page the form was submitted on, e.g. "/madhuvana". */
  page?: string;
  /** First page of the visit. */
  landingPage?: string;
  /** External site the visit started from. */
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
};

/** Trim and length-limit an untrusted string from the request body. */
export function cleanField(value: unknown, max = 200): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

/** Read the attribution fields the browser sends (snake_case utm_* keys) from a request body. */
export function attributionFromBody(body: Record<string, unknown>): LeadAttribution {
  return {
    page: cleanField(body.page) || undefined,
    landingPage: cleanField(body.landingPage) || undefined,
    referrer: cleanField(body.referrer, 300) || undefined,
    utmSource: cleanField(body.utm_source, 120) || undefined,
    utmMedium: cleanField(body.utm_medium, 120) || undefined,
    utmCampaign: cleanField(body.utm_campaign, 120) || undefined,
    utmTerm: cleanField(body.utm_term, 120) || undefined,
    utmContent: cleanField(body.utm_content, 120) || undefined,
  };
}

/** Human-readable lines for the CRM note and the notification email. Empty if nothing is known. */
export function attributionLines(a: LeadAttribution): string[] {
  const campaign = [a.utmSource, a.utmMedium, a.utmCampaign].filter(Boolean).join(' / ');
  return [
    a.page ? `Submitted on page: ${a.page}` : null,
    a.landingPage ? `Landing page: ${a.landingPage}` : null,
    a.referrer ? `Referrer: ${a.referrer}` : null,
    campaign ? `Campaign (source / medium / name): ${campaign}` : null,
    a.utmTerm ? `Campaign term: ${a.utmTerm}` : null,
    a.utmContent ? `Campaign content: ${a.utmContent}` : null,
  ].filter((line): line is string => Boolean(line));
}
