import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { statusCatalog } from '../../lib/statusCatalog';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Secret prüfen (Header ist case-insensitive)
  const secret = (req.headers['x-webhook-secret'] || req.headers['X-Webhook-Secret']) as string | undefined;
  if (!secret || secret !== process.env.WEBHOOK_SECRET) {
    console.error('Webhook: secret mismatch');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    console.log('Webhook payload:', body);

    const record = body?.record ?? {};
    const old = body?.old_record ?? {};
    const email = record.applicant_email as string | undefined;
    const newStatus = record.status as string | undefined;
    const oldStatus = old.status as string | undefined;

    if (!email || !newStatus) {
      console.log('Missing email/status', { email, newStatus });
      return res.status(200).json({ ok: true, note: 'missing email/status' });
    }
    if (oldStatus && oldStatus === newStatus) {
      console.log('Status unchanged');
      return res.status(200).json({ ok: true, note: 'status unchanged' });
    }

    const label = (statusCatalog as any)[newStatus]?.label ?? newStatus;
    const from = process.env.RESEND_FROM || 'Visa Status <no-reply@example.com>';

    const result = await resend.emails.send({
      from,
      to: email,
      subject: `Your visa status was updated: ${label}`,
      html: `
        <p>Hello,</p>
        <p>Your visa application status has been updated to: <b>${label}</b>.</p>
        <p>Check here: <a href="https://portalstatus.vercel.app/?email=${encodeURIComponent(email)}">
          portalstatus.vercel.app/?email=${email}</a></p>
        <p>Best regards,<br/>Dexx Visa Service GmbH</p>
      `,
    });

    console.log('Resend API response:', result);
    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error('Webhook error:', err?.message || err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
