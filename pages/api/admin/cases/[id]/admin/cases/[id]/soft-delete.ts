import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string, // in Vercel als ENV setzen
  { auth: { persistSession: false } }
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  // minimale Admin-Schranke – später durch deine echte Auth ersetzen
  const role = req.headers['x-role'];
  if (role !== 'admin') return res.status(403).json({ error: 'forbidden' });

  const { id } = req.query;
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'missing id' });

  const now = new Date().toISOString();
  const { error } = await supabase
    .from('cases')
    .update({ deleted_at: now, updated_at: now })
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ ok: true });
}
