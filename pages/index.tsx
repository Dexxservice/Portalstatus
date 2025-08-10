import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { StatusCard } from '../components/StatusCard';
import FAQ from '../components/FAQ';
import type { StatusCode } from '../lib/statusCatalog';

type CaseRow = {
  id: string;
  applicant_email: string;
  status: string;
  updated_at: string;
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState<StatusCode>('DOCS_RECEIVED');
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qEmail = params.get('email');
    setEmail(qEmail);

    async function load() {
      setLoading(true);
      setError(null);
      try {
        let query = supabase
          .from('cases')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1);

        if (qEmail) query = query.eq('applicant_email', qEmail);

        const { data, error } = await query;
        if (error) throw error;

        const row = (data && data[0]) as CaseRow | undefined;
        if (!row) {
          setError('No case found. Please check the email or create a test case in Supabase.');
          return;
        }

        const normalized = (row.status as StatusCode) || 'DOCS_RECEIVED';
        setCode(normalized);
      } catch (e: any) {
        setError(e.message ?? 'Unknown error while loading.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div style={{ margin: '0 auto', padding: 16, maxWidth: 920, display: 'grid', gap: 16 }}>
      <h1 style={{ fontSize: 28, margin: 0 }}>Your Visa Status</h1>

      {email && <div style={{ opacity: 0.8 }}>Email: {email}</div>}
      {loading && <div>Loading…</div>}
      {error && <div style={{ color: 'crimson' }}>Error: {error}</div>}
      {!loading && !error && <StatusCard code={code} />}

      <div style={{ opacity: 0.7, fontSize: 14 }}>
        Tip: Append <code>?email=your.mail@example.com</code> to the URL to open your case directly.
      </div>

      {/* FAQ below the status card */}
      <FAQ />
    </div>
  );
}
