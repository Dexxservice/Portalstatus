import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Sicherheitscheck
  const secret = req.headers['x-webhook-secret'];
  if (secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const payload = req.body; // Supabase sendet hier die Änderungen
    const email = payload.record?.applicant_email;
    const status = payload.record?.status;

    if (email && status) {
      try {
        await resend.emails.send({
          from: 'Dexx Visa Service <no-reply@dein-domain.de>',
          to: email,
          subject: 'Visa Status Update',
          html: `<p>Dear Applicant,</p>
                 <p>Your visa application status has been updated to: <b>${status}</b>.</p>
                 <p>Kind regards,<br>Dexx Visa Service GmbH</p>`
        });

        return res.status(200).json({ success: true });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to send email' });
      }
    }
  }

  return res.status(400).json({ error: 'Invalid request' });
}
