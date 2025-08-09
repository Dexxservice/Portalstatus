import { Resend } from 'resend';

export async function sendResendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY!;
  const from = process.env.RESEND_FROM!;
  const resend = new Resend(apiKey);
  await resend.emails.send({ from, to, subject, html });
}
