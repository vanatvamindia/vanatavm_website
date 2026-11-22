import nodemailer from 'nodemailer';
import { attributionLines, type LeadAttribution } from '@/lib/leadAttribution';

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** HTML-safe copy of a lead: every value comes from a public form, so none may reach the email as markup. */
function escapeLead(lead: ContactLeadNotification): ContactLeadNotification {
  const safe: Record<string, unknown> = { ...lead };
  for (const key of Object.keys(safe)) {
    const value = safe[key];
    if (typeof value === 'string') safe[key] = escapeHtml(value);
  }
  return safe as unknown as ContactLeadNotification;
}

export interface ContactLeadNotification extends LeadAttribution {
  name: string;
  phone: string;
  email: string;
  project?: string;
  date?: string;
  message?: string;
  source?: string;
  submittedAt?: string;
}

export async function sendLeadNotificationEmail(rawLead: ContactLeadNotification) {
  // `lead` (escaped) is for the HTML body only; `rawLead` is used for the subject, reply-to and plain text.
  const lead = escapeLead(rawLead);
  const attributionRows = attributionLines(rawLead);
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || process.env.CLIENT_EMAIL || 'info@vanatvam.com';
  const fromEmail = process.env.SMTP_FROM || user || 'no-reply@vanatvam.com';

  if (!host || !user || !pass) {
    console.warn(
      'Nodemailer: SMTP credentials (SMTP_HOST, SMTP_USER, SMTP_PASS) not configured in .env. Skipping email delivery.'
    );
    return { success: false, skipped: true, message: 'SMTP not configured' };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports (587)
    auth: {
      user,
      pass,
    },
  });

  const submittedTime = lead.submittedAt
    ? new Date(lead.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #F9F8F6; margin: 0; padding: 24px; color: #122217; }
          .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #EAE6DF; }
          .header { background: #122217; padding: 32px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 500; letter-spacing: 0.05em; color: #C6A265; }
          .header p { margin: 8px 0 0; font-size: 14px; color: rgba(255,255,255,0.7); }
          .content { padding: 32px; }
          .field { margin-bottom: 20px; border-bottom: 1px solid #F0ECE4; padding-bottom: 12px; }
          .label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #687B63; margin-bottom: 4px; }
          .value { font-size: 16px; color: #122217; font-weight: 500; }
          .message-box { background: #F9F8F6; border-left: 4px solid #C6A265; padding: 16px; border-radius: 6px; font-size: 15px; color: #282C27; line-height: 1.6; }
          .footer { padding: 20px 32px; background: #FAF9F6; font-size: 12px; color: #8F9D8D; text-align: center; border-top: 1px solid #EAE6DF; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>VANATVAM</h1>
            <p>New Enquiry & Lead Received</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Full Name</div>
              <div class="value">${lead.name}</div>
            </div>
            <div class="field">
              <div class="label">Phone Number</div>
              <div class="value"><a href="tel:${lead.phone}" style="color: #2D6A4F; text-decoration: none; font-weight: 600;">${lead.phone}</a></div>
            </div>
            <div class="field">
              <div class="label">Email Address</div>
              <div class="value"><a href="mailto:${lead.email}" style="color: #2D6A4F; text-decoration: none;">${lead.email}</a></div>
            </div>
            ${lead.project ? `
            <div class="field">
              <div class="label">Project Interested In</div>
              <div class="value" style="color: #C6A265; font-weight: 600;">${lead.project}</div>
            </div>` : ''}
            ${lead.date ? `
            <div class="field">
              <div class="label">Preferred Visit Date</div>
              <div class="value">${lead.date}</div>
            </div>` : ''}
            <div class="field">
              <div class="label">Source Form</div>
              <div class="value">${lead.source || 'Website Contact Form'}</div>
            </div>
            ${attributionRows.length ? `
            <div class="field">
              <div class="label">Where They Came From</div>
              <div class="value" style="font-size: 14px; line-height: 1.6;">${attributionRows.map(escapeHtml).join('<br>')}</div>
            </div>` : ''}
            <div class="field">
              <div class="label">Timestamp</div>
              <div class="value">${submittedTime} IST</div>
            </div>
            ${lead.message ? `
            <div class="field" style="border-bottom: none;">
              <div class="label">Message / Note</div>
              <div class="message-box">${lead.message.replace(/\n/g, '<br>')}</div>
            </div>` : ''}
          </div>
          <div class="footer">
            This is an automated notification from VanaTvam Website Lead Engine.
          </div>
        </div>
      </body>
    </html>
  `;

  const info = await transporter.sendMail({
    from: `"VanaTvam Leads" <${fromEmail}>`,
    to: receiverEmail,
    replyTo: rawLead.email,
    subject: `New Lead from ${rawLead.name}${rawLead.project ? ` - ${rawLead.project}` : ''}`,
    text: `New Lead Details:\n\nName: ${rawLead.name}\nPhone: ${rawLead.phone}\nEmail: ${rawLead.email}\nProject: ${rawLead.project || 'General'}\nPreferred Date: ${rawLead.date || 'N/A'}\nSource: ${rawLead.source || 'Website'}\nMessage: ${rawLead.message || 'N/A'}\n${attributionRows.length ? `\nWhere they came from:\n${attributionRows.join('\n')}\n\n` : ''}Submitted: ${submittedTime}`,
    html: htmlContent,
  });

  return { success: true, messageId: info.messageId };
}

