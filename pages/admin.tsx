import AdminDeleteButton from '../components/AdminDeleteButton';
import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { supabase } from '../lib/supabaseClient';
import { statusCatalog, StatusCode } from '../lib/statusCatalog';

type CaseRow = {
  id: string;
  applicant_email: string;
  status: StatusCode;
  updated_at: string;
};

export default function AdminPage() {
  const [me, setMe] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<CaseRow[]>([]);
  const [err, setErr] = useState<string | null>(null);

  // UI state
  const [search, setSearch] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newStatus, setNewStatus] = useState<StatusCode>('DOCS_RECEIVED');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // ------ helpers ------
  const statuses = useMemo(
    () =>
      Object.entries(statusCatalog).map(([code, meta]) => ({
        code: code as StatusCode,
        label: meta.label,
      })),
    []
  );

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  // ------ load session + data ------
  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      setMe(userData.user?.email ?? null);
      await loadCases();
      setLoading(false);
    })();
  }, []);

  async function loadCases() {
    setErr(null);
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) setErr(error.message);
    setRows((data ?? []) as CaseRow[]);
  }

  // ------ create case ------
  async function createCase(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!newEmail || !/^\S+@\S+\.\S+$/.test(newEmail)) {
      showToast('Please enter a valid email');
      return;
    }

    const { error } = await supabase
      .from('cases')
      .insert([{ applicant_email: newEmail, status: newStatus }]);

    if (error) {
      setErr(error.message);
      return;
    }
    setNewEmail('');
    showToast('Case created');
    await loadCases();
  }

  // ------ update status + log history ------
  async function updateStatus(row: CaseRow, next: StatusCode) {
    if (row.status === next) return;
    if (!confirm(`Change status for ${row.applicant_email} to "${statusCatalog[next].label}"?`)) return;

    setBusyId(row.id);
    setErr(null);
    try {
      // 1) update case
      const { error: updErr } = await supabase
        .from('cases')
        .update({ status: next })
        .eq('id', row.id);

      if (updErr) throw updErr;

      // 2) write history (best-effort)
      await supabase.from('case_history').insert([
        {
          case_id: row.id,
          old_status: row.status,
          new_status: next,
          changed_by: me ?? 'admin',
        },
      ]);

      // 3) refresh list (webhook sendet E-Mail automatisch)
      await loadCases();
      showToast('Status updated & notification sent');
    } catch (e: any) {
      setErr(e.message ?? 'Update failed');
    } finally {
      setBusyId(null);
    }
  }

  // ------ logout ------
  async function logout() {
    await supabase.auth.signOut();
    location.href = '/';
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r => r.applicant_email.toLowerCase().includes(q));
  }, [rows, search]);

  return (
    <>
      <Head><title>Admin • Dexx Visa Service</title></Head>
      <div style={{ maxWidth: 980, margin: '32px auto', padding: '0 16px', fontFamily: 'Inter, system-ui, Arial' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h1 style={{ fontSize: 24, margin: 0 }}>Admin Panel</h1>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: '#666' }}>{me ? `Logged in as: ${me}` : ''}</span>
            <button onClick={logout} style={btn('ghost')}>Logout</button>
          </div>
        </header>

        {/* Create Case */}
        <section style={card()}>
          <h2 style={h2()}>Create new case</h2>
          <form onSubmit={createCase} style={{ display: 'grid', gridTemplateColumns: '1fr 220px 120px', gap: 8 }}>
            <input
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder="Applicant email"
              style={input()}
            />
            <select value={newStatus} onChange={e => setNewStatus(e.target.value as StatusCode)} style={input()}>
              {statuses.map(s => (
                <option key={s.code} value={s.code}>{s.label}</option>
              ))}
            </select>
            <button type="submit" style={btn()}>Add</button>
          </form>
        </section>

        {/* Search */}
        <section style={{ marginTop: 16, marginBottom: 8 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by email…"
            style={{ ...input(), maxWidth: 360 }}
          />
        </section>

        {/* List */}
        <section style={card()}>
          <h2 style={h2()}>Cases</h2>

          {loading ? <div>Loading…</div> : null}
          {err ? <div style={{ color: '#b00020', marginBottom: 8 }}>Error: {err}</div> : null}

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 180px', fontSize: 14, color: '#666', padding: '8px 12px' }}>
            <div>Email</div><div>Current status</div><div>Last update</div>
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            {filtered.map((r) => (
              <div key={r.id} style={row()}>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.applicant_email}</div>
                <div>
                  <select
                    disabled={busyId === r.id}
                    value={r.status}
                    onChange={e => updateStatus(r, e.target.value as StatusCode)}
                    style={input()}
                  >
                    {statuses.map(s => (
                      <option key={s.code} value={s.code}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>{new Date(r.updated_at).toLocaleString()}</div>
              </div>
            ))}
            {filtered.length === 0 && <div style={{ padding: 12, color: '#666' }}>No results</div>}
          </div>
        </section>

        {/* Toast */}
        {toast && (
          <div style={{
            position: 'fixed', right: 16, bottom: 16, background: '#111', color: 'white',
            padding: '10px 14px', borderRadius: 10, boxShadow: '0 8px 30px rgba(0,0,0,.25)'
          }}>{toast}</div>
        )}
      </div>
    </>
  );
}

// ---------- styles ----------
function card() {
  return {
    border: '1px solid #e5e7eb',
    borderRadius: 14,
    padding: 16,
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    background: 'white',
    marginBottom: 16
  } as React.CSSProperties;
}
function row() {
  return {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr 180px',
    alignItems: 'center',
    padding: '10px 12px',
    border: '1px solid #f1f5f9',
    borderRadius: 12,
    background: '#fafafa'
  } as React.CSSProperties;
}
function input() {
  return {
    width: '100%',
    padding: '8px 10px',
    borderRadius: 10,
    border: '1px solid #d1d5db',
    outline: 'none'
  } as React.CSSProperties;
}
function btn(variant: 'solid'|'ghost' = 'solid') {
  return {
    padding: '8px 12px',
    borderRadius: 10,
    border: variant === 'ghost' ? '1px solid #e5e7eb' : 'none',
    background: variant === 'ghost' ? 'white' : '#111827',
    color: variant === 'ghost' ? '#111' : 'white',
    cursor: 'pointer'
  } as React.CSSProperties;
}
function h2() {
  return { margin: '0 0 12px', fontSize: 18 } as React.CSSProperties;
}
