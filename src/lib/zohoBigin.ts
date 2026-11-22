import { attributionLines, type LeadAttribution } from '@/lib/leadAttribution';

const DC = process.env.ZOHO_BIGIN_DC || 'in';
const ACCOUNTS_BASE = `https://accounts.zoho.${DC}`;
const API_BASE = `https://www.zohoapis.${DC}`;

let cachedToken: { accessToken: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.accessToken;
  }

  const clientId = process.env.ZOHO_BIGIN_CLIENT_ID;
  const clientSecret = process.env.ZOHO_BIGIN_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_BIGIN_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Zoho Bigin credentials are not configured');
  }

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
  });

  const res = await fetch(`${ACCOUNTS_BASE}/oauth/v2/token?${params.toString()}`, {
    method: 'POST',
  });

  const data = await res.json();

  if (!res.ok || !data.access_token) {
    throw new Error(`Zoho token refresh failed: ${JSON.stringify(data)}`);
  }

  cachedToken = {
    accessToken: data.access_token,
    // Refresh a minute early to avoid edge-of-expiry failures
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return cachedToken.accessToken;
}

type LeadInput = LeadAttribution & {
  name: string;
  phone: string;
  email: string;
  project?: string;
  date?: string;
  message?: string;
  source?: string;
};

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: '', lastName: parts[0] };
  }
  return { firstName: parts.slice(0, -1).join(' '), lastName: parts[parts.length - 1] };
}

export async function createBiginContact(lead: LeadInput): Promise<void> {
  const accessToken = await getAccessToken();
  const { firstName, lastName } = splitName(lead.name);

  const descriptionLines = [
    `Source: ${lead.source || 'contact'}`,
    lead.project ? `Project: ${lead.project}` : null,
    lead.date ? `Preferred Date: ${lead.date}` : null,
    lead.message ? `Message: ${lead.message}` : null,
    ...attributionLines(lead),
  ].filter(Boolean);

  // Upsert so a repeat lead (same email or phone already in Bigin) updates
  // the existing contact instead of failing with DUPLICATE_DATA.
  const res = await fetch(`${API_BASE}/bigin/v2/Contacts/upsert`, {
    method: 'POST',
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: [
        {
          First_Name: firstName || undefined,
          Last_Name: lastName,
          Email: lead.email,
          Phone: lead.phone,
          Description: descriptionLines.join('\n'),
        },
      ],
      duplicate_check_fields: ['Email', 'Phone'],
    }),
  });

  const result = await res.json();
  const entry = result?.data?.[0];

  if (!res.ok || entry?.status !== 'success') {
    throw new Error(`Zoho Bigin contact upsert failed: ${JSON.stringify(result)}`);
  }
}
