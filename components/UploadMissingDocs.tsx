import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function UploadMissingDocs({
  caseId,
  email,
}: {
  caseId: string;
  email: string;
}) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onUpload() {
    if (!files || files.length === 0) return;

    setBusy(true);
    setErr(null);
    setMsg(null);

    try {
      const uploadedPaths: string[] = [];

      for (const file of Array.from(files)) {
        // einfache Größenbegrenzung: 10 MB
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`File too large: ${file.name} (>10MB)`);
        }

        const clean = file.name.replace(/\s+/g, '_');
        const path = `${caseId}/${Date.now()}_${clean}`;

        const { error } = await supabase
          .storage
          .from('case-uploads') // Bucket muss existieren (privat)
          .upload(path, file, { upsert: false });

        if (error) throw error;

        uploadedPaths.push(path);
      }

      // 🔎 Log in case_uploads (falls Tabelle + Policy angelegt sind)
      if (uploadedPaths.length) {
        const rows = uploadedPaths.map(p => ({ case_id: caseId, file_path: p }));
        const { error: logErr } = await supabase.from('case_uploads').insert(rows);
        if (logErr) {
          // Logging-Fehler nicht an den User durchreichen
          console.warn('case_uploads insert failed', logErr);
        }
      }

      setMsg('Uploads received. We will review them within 1–3 working days.');
      setFiles(null);
    } catch (e: any) {
      setErr(e.message ?? 'Upload failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        marginTop: 12,
        border: '1px dashed #d0d0d0',
        borderRadius: 12,
        padding: 12,
        background: '#fafafa',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>
        Upload your missing documents
      </div>
      <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 8 }}>
        Accepted: PDF / images (max 10 MB each).
      </div>

      <input
        type="file"
        multiple
        accept="application/pdf,image/*"
        onChange={(e) => setFiles(e.target.files)}
        disabled={busy}
      />

      <div style={{ marginTop: 8 }}>
        <button
          onClick={onUpload}
          disabled={busy || !files || files.length === 0}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #ddd',
            background: busy ? '#f3f3f3' : '#fff',
            cursor: busy ? 'not-allowed' : 'pointer',
          }}
        >
          {busy ? 'Uploading…' : 'Upload'}
        </button>
      </div>

      {msg && <div style={{ color: 'green', marginTop: 8 }}>{msg}</div>}
      {err && <div style={{ color: 'crimson', marginTop: 8 }}>{err}</div>}
    </div>
  );
}
