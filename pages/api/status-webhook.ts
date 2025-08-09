import type { NextApiRequest, NextApiResponse } from 'next';
import { sendResendEmail } from './notify/resend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify secret
  const secret = req.headers['x-webhook-secret'] || req.query.secret;
  if (secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Expect payload with new row data (Supabase Database Webhook)
  const event = req.body;
  try {
    // Example payload picking:
    const newRow = event?.record ?? event?.new ?? event;
    const email = newRow?.applicant_email;
    const newStatus = newRow?.status;

    if (!email || !newStatus) {
      return res.status(200).json({ ok: true, note: 'No email or status in payload' });
    }

    await sendResendEmail(
      email,
      'Ihr Visa-Status wurde aktualisiert',
      `<p>Guten Tag,</p><p>Ihr Status lautet jetzt: <b>${newStatus}</b>.</p><p>Beste Grüße<br/>Dexx Visa Service</p>`
    );

    return res.status(200).json({ ok: true });
  } catch (e:any) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}
