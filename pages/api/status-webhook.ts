// pages/api/status-webhook.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { statusCatalog } from '../../lib/statusCatalog';

// Resend-Client mit deinem API Key (kommt aus Vercel Env)
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1) Secret-Header prüfen (muss mit Vercel-Env WEBHOOK_SECRET identisch sein)
  const secret =
    (req.headers['x-webhook-secret'] as string | undefined) ||
    (req.headers['X-Webhook-Secret'] as string | undefined);

  if (!secret || secret !== process.env.WEBHOOK_SECRET) {
    console.error('Webhook: secret mismatch');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 2) Nur POST erlauben
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 3) Body sicher parsen (Supabase schickt JSON)
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    console.log('Webhook payload:', body);

    // Supabase-Shape: { record, old_record, ... }
    const record = body?.record ?? {};
    const old = body?.old_record ?? {};

    const email = record.applicant_email as string | undefined;
    const newStatus = record.status as string | undefined;
    const oldStatus = old?.status as string | undefined;

    // 4) Schutz: wenn keine E-Mail/Status vorhanden ist → nur "ok" zurückgeben
    if (!email || !newStatus) {
      console.log('Missing email/status', { email, newStatus });
      return res.status(200).json({ ok: true, note: 'missing email/status' });
    }

    // 5) Nur bei echtem Wechsel senden
    if (oldStatus && oldStatus === newStatus) {
      console.log('Status unchanged');
      return res.status(200).json({ ok: true, note: 'status unchanged' });
    }

    // 6) Lesbares Label aus deinem Katalog (fallback: Code)
    const label = (statusCatalog as any)?.[newStatus]?.label ?? newStatus;

    // 7) Absender aus Env (Vercel → RESEND_FROM), z.B. "Visa Status <visastatus@dexpersonalvermittlung.de>"
    const from = process.env.RESEND_FROM || 'Visa Status <no-reply@example.com>';

    // 8) E-Mail mit Resend senden
    const result = await resend.emails.send({
      from,
      to: email,
      subject: `Your visa status was updated: ${label}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5">
          <p>Hello,</p>
          <p>Your visa application status has been updated to: <b>${label}</b>.</p>
          <p>Check details here:<br/>
            <a href="https://portalstatus.vercel.app/?email=${encodeURIComponent(email)}">
              portalstatus.vercel.app/?email=${email}
            </a>
          </p>
          <p>Best regards,<br/>Dexx Visa Service GmbH</p>
        </div>
      `,
    });

    console.log('Resend API response:', result);
    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error('Webhook error:', err?.message || err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
