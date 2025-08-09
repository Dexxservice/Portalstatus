import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { supabase } from '../lib/supabaseClient';
import Progress from '../components/Progress';
import { statusCatalog, StatusCode } from '../lib/statusCatalog';

type CaseRow = {
  id: string;
  applicant_email: string;
  status: StatusCode;
  updated_at: string;
};

type HistoryRow = {
  id: string;
  case_id: string;
  old_status: string | null;
  new_status: StatusCode;
  changed_by: string | null;
  changed_at: string;
};

export default function ApplicantPage() {
  const [email, setEmail] = useState<string>('');
  const [caseRow, setCaseRow] = useState<CaseRow | null>(null);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = new URL(window.location.href);
    const e = url.searchParams.get('email') ?? '';
    setEmail(e);
    if (e) load(e);
    else setLoading(false);
  }, []);

  async function load(appEmail: string) {
    setLoading(true);

    // 1) Fall laden
    const { data: cases } = await supabase
      .from('cases')
      .select('*')
      .eq('applicant_email', appEmail)
      .limit(1);

    const c = (cases?.[0] ?? null) as CaseRow | null;
    setCaseRow(c);

    // 2) Historie laden (wenn wir eine case_id haben)
    if (c?.id) {
      const { data: hist } = await supabase
        .from('case_history')
        .select('*')
        .eq('case_id', c.id)
        .order('changed_at', { ascending: false });

      setHistory((hist ?? []) as HistoryRow[]);
    } else {
      setHistory([]);
    }

    setLoading(false);
  }

  const currentMeta = useMemo(() => {
    if (!caseRow) return null;
    return statusCatalog[caseRow.status];
  }, [caseRow]);

  return (
    <>
      <Head><title>Visa Status • Dexx Visa Service</title></Head>
      <div style={{ maxWidth: 900, margin: '28px auto', padding: '0 16px', fontFamily: 'Inter, system-ui, Arial' }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <img src="/branding/logo.png" alt="DEXX" style={{ height: 36 }} />
          <div style={{ fontWeight: 700 }}>Dexx Visa Service GmbH</div>
        </header>

        <h1 style={{ margin: '6px 0 12px' }}>Your visa status</h1>

        {email ? (
          <div style={{ marginBottom: 12, color: '#374151' }}><b>E-mail:</b> {email}</div>
        ) : (
          <div style={{ marginBottom: 16, color: '#b91c1c' }}>
            Please append <code>?email=you@example.com</code> to the URL.
          </div>
        )}

        {loading ? <div>Loading…</div> : null}

        {!loading && !caseRow ? (
          <div style={{ color: '#b91c1c', marginTop: 8 }}>
            No case found. Please check your e-mail or contact support.
          </div>
        ) : null}

        {caseRow && (
          <>
            {/* Progress */}
            <Progress current={caseRow.status} />

            {/* Current status card */}
            <div style={{ marginTop: 16, border: '1px solid #eee', borderRadius: 14, padding: 16, background: '#fff' }}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
                Current status: {statusCatalog[caseRow.status].label}
              </div>
              <div style={{ color: '#374151' }}>
                <div><b>Last update:</b> {new Date(caseRow.updated_at).toLocaleString()}</div>
                {currentMeta?.nextstep && (
                  <div style={{ marginTop: 6 }}>
                    <b>Next step:</b> {currentMeta.nextstep}
                  </div>
                )}
                {currentMeta?.etaDays && (
                  <div style={{ marginTop: 4, color: '#6b7280' }}>
                    Estimated wait: ca. {currentMeta.etaDays[0]}–{currentMeta.etaDays[1]} days
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <section style={{ marginTop: 18 }}>
              <h2 style={{ margin: '0 0 10px', fontSize: 18 }}>Status history</h2>
              {history.length === 0 ? (
                <div style={{ color: '#6b7280' }}>No changes yet.</div>
              ) : (
                <div style={{ display: 'grid', gap: 8 }}>
                  {history.map(h => (
                    <div key={h.id}
                      style={{ border: '1px solid #eee', borderRadius: 12, background: '#fff', padding: 12 }}>
                      <div style={{ fontWeight: 600 }}>
                        {(statusCatalog as any)[h.new_status]?.label ?? h.new_status}
                      </div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>
                        {new Date(h.changed_at).toLocaleString()}
                        {h.changed_by ? ` • by ${h.changed_by}` : ''}
                      </div>
                      {h.old_status && (
                        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                          Previous: {(statusCatalog as any)[h.old_status]?.label ?? h.old_status}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
}
