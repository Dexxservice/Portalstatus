// pages/api/sync-to-drive.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { Readable } from 'stream';
import { createClient } from '@supabase/supabase-js';

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY,
  GOOGLE_DRIVE_FOLDER_ID,
} = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env');
}

const sAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

function driveClient() {
  const auth = new google.auth.JWT(
    GOOGLE_CLIENT_EMAIL,
    undefined,
    (GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/drive']
  );
  return google.drive({ version: 'v3', auth });
}

async function ensureSubfolder(drive: ReturnType<typeof driveClient>, parentId: string, name: string) {
  const safe = name.replace(/'/g, "\\'");
  const q = `name='${safe}' and mimeType='application/vnd.google-apps.folder' and '${parentId}' in parents and trashed=false`;
  const list = await drive.files.list({ q, fields: 'files(id,name)', pageSize: 1 });
  if (list.data.files?.[0]?.id) return list.data.files[0].id!;
  const created = await drive.files.create({
    requestBody: { name, parents: [parentId], mimeType: 'application/vnd.google-apps.folder' },
    fields: 'id',
  });
  return created.data.id!;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });
  try {
    const { caseId, email, paths } = req.body as { caseId: string; email?: string; paths: string[] };
    if (!caseId || !Array.isArray(paths) || paths.length === 0) {
      return res.status(400).json({ error: 'Missing caseId or paths' });
    }
    if (!GOOGLE_DRIVE_FOLDER_ID || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      return res.status(500).json({ error: 'Drive credentials not set' });
    }

    const drive = driveClient();
    const parentId = await ensureSubfolder(drive, GOOGLE_DRIVE_FOLDER_ID, caseId);

    const uploadedIds: string[] = [];

    for (const p of paths) {
      const { data, error } = await sAdmin.storage.from('case-uploads').download(p);
      if (error || !data) throw error || new Error('Download failed');
      const ab = await (data as any).arrayBuffer();
      const buffer = Buffer.from(ab);
      const filename = p.split('/').pop() || 'upload.bin';

      const resp = await drive.files.create({
        requestBody: { name: filename, parents: [parentId] },
        media: { mimeType: 'application/octet-stream', body: Readable.from(buffer) },
        fields: 'id,name',
      });

      if (resp.data.id) uploadedIds.push(resp.data.id);
    }

    return res.status(200).json({ ok: true, uploadedCount: uploadedIds.length });
  } catch (e: any) {
    console.error('sync-to-drive error', e);
    return res.status(500).json({ error: e.message || 'sync failed' });
  }
}
