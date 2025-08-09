import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { statusCatalog } from '../lib/statusCatalog';
import type { StatusCode } from '../lib/statusCatalog';

type CaseRow = { id: string; applicant_email: string; status: string; updated_at: string; };

export default function AdminPage() {
  const [session, setSession] = useState<import('@supabase/supabase-js').Session | null>(null);
  const [emailForLogin, setEmailForLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<CaseRow[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Session beobachten
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => setSession(sess));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Fälle laden, wenn eingeloggt
  useEffect(() => {
    async function load() {
      if (!session) { setLoading(false); return; }
      setLoading(true); setErr(null);
      const { data, error } = await supabase.from('cases').select('*').order('updated_at', { ascending: false });
      if (error) setErr(error.message);
      setRows((data ?? []) as CaseRow[]);
      setLoading(false);
    }
    load();
  }, [session]);

  // Magic-Link anfordern
  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setNote(null);
    const { error } = await supabase.auth.signInWithOtp({
      email: emailForLogin,
      options: { emailRedirectTo: window.location.origin + '/admin' },
    });
    if (error) setErr(error.message);
    else setNote('Magic link sent. Please check your inbox and click the link.');
  }

  // Status ändern
  async function updateStatus(id: string, newStatus: StatusCode) {
    setErr(null);
    const { error } = await supabase.from('cases').update({ status: newStatus }).eq('id', id);
    if (error) { setErr(error.message); return; }
    const { data } = await supabase.from('cases').select('*').order('updated_at', { ascending: false });
    setRows((data ?? []) as CaseRow[]);
  }

  const statusOptions = Object.keys(statusCatalog) as StatusCode[];

  if (!session) {
    return (
      <div style={{ padding: 16, display:'grid', gap:12, maxWidth: 480 }}>
        <h1>Admin Login</h1>
        <form onSubmit={sendMagicLink} style={{ display:'grid', gap:8 }}>
          <input type="email" required placeholder="Email for magic link"
            value={emailForLogin} onChange={e => setEmailForLogin(e.target.value)}
            style={{ padding: 10, border: '1px solid #ddd', borderRadius: 8 }} />
          <button type="submit" style={{ padding: 10, borderRadius: 8 }}>Send magic link</button>
        </form>
        {note && <div style={{ color: 'green' }}>{note}</div>}
        {err && <div style={{ color: 'crimson' }}>Error: {err}</div>}
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>Admin Panel</h1>
      <div style={{ marginBottom: 12, opacity: .8 }}>
        Logged in as: {session.user?.email}
        <button onClick={() => supabase.auth.signOut()}
                style={{ marginLeft: 12, padding: '6px 10px', borderRadius: 8 }}>
          Logout
        </button>
      </div>

      {loading && <div>Loading…</div>}
      {err && <div style={{ color: 'crimson' }}>Error: {err}</div>}
      {!loading && rows.length === 0 && <div>No cases yet.</div>}

      <div style={{ display: 'grid', gap: 12 }}>
        {rows.map(r => {
          const current = (r.status as StatusCode) || 'DOCS_RECEIVED';
          return (
            <div key={r.id} style={{ border: '1px solid #eee', borderRadius: 12, padding: 12 }}>
              <div><b>Email:</b> {r.applicant_email}</div>
              <div><b>Current status:</b></div>
              <select value={current}
                      onChange={e => updateStatus(r.id, e.target.value as StatusCode)}
                      style={{ padding: 8, borderRadius: 8, border: '1px solid #ddd', marginTop: 6 }}>
                {statusOptions.map(s => (
                  <option key={s} value={s}>{statusCatalog[s].label}</option>
                ))}
              </select>
              <div style={{ opacity: .7, marginTop: 6 }}>
                Last update: {new Date(r.updated_at).toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
