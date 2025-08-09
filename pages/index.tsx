import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { StatusCard } from '../components/StatusCard';
import type { StatusCode } from '../lib/statusCatalog';

type CaseRow = {
  id: string;
  applicant_email: string;
  status: string; // kommt als Text aus der DB
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
        // Basis-Query: jüngste Fälle zuerst
        let query = supabase
          .from('cases')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1);

        // Optional: nach E-Mail filtern, wenn ?email= gesetzt ist
        if (qEmail) query = query.eq('applicant_email', qEmail);

        const { data, error } = await query;

        if (error) throw error;
        const row = (data && data[0]) as CaseRow | undefined;

        if (!row) {
          setError('Kein Fall gefunden. Bitte E-Mail prüfen oder einen Testfall in Supabase anlegen.');
          return;
        }

        // Status aus der DB in unseren Typ gießen (fallback auf DOCS_RECEIVED)
        const normalized = (row.status as StatusCode) || 'DOCS_RECEIVED';
        setCode(normalized);
      } catch (e: any) {
        setError(e.message ?? 'Unbekannter Fehler beim Laden.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h1>Ihr Visa-Status</h1>

      {email && <div style={{ opacity: 0.8 }}>E-Mail: {email}</div>}
      {loading && <div>Laden …</div>}
      {error && <div style={{ color: 'crimson' }}>Fehler: {error}</div>}
      {!loading && !error && <StatusCard code={code} />}

      <div style={{ opacity: 0.7, fontSize: 14 }}>
        Tipp: Hängen Sie <code>?email=ihre.mail@example.com</code> an die URL an,
        um gezielt Ihren Fall aufzurufen.
      </div>
    </div>
  );
}
