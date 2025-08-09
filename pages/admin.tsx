import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { supabase } from '../lib/supabaseClient';
import { statusCatalog, StatusCode } from '../lib/statusCatalog';
import AdminDeleteButton from '../components/AdminDeleteButton';

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

  async function updateStatus(row: CaseRow, next: StatusCode) {
    if (row.status === next) return;
    if (!confirm(`Change status for ${row.applicant_email} to "${statusCatalog[next].label}"?`)) return;

    setBusyId(row.id);
    setErr(null);
    try {
      const { error: updErr } = await supabase
        .from('cases')
        .update({ status: next })
        .eq('id', row.id);

      if (updErr) throw updErr;

      await supabase.from('case_history').insert([
        {
          case_id: row.id,
          old_status: row.status,
          new_status: next,
          changed_by: me ?? 'admin',
        },
      ]);

      await loadCases();
      showToast('Status updated & notification sent');
    } catch (e: any) {
      setErr(e.message ?? 'Update failed');
    } finally {
      setBusyId(null);
    }
  }

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
          <div
