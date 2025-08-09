import CaseRow, { CaseItem } from './_components/CaseRow';
import { supabaseServer } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export default async function AdminConsolePage() {
  const supabase = supabaseServer();
  const { data: rows, error } = await supabase
    .from('cases')
    .select('id,email,status,updated_at,digital_diplo_status,twofa_email_status,health_insurance,work_checks')
    .is('deleted_at', null)
    .order('updated_at', { ascending: false });

  if (error) {
    return <main className="max-w-5xl mx-auto px-4 py-6">Error loading cases: {error.message}</main>;
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-6">
      <section className="rounded-2xl border bg-white p-4">
        <h1 className="text-xl font-semibold">Admin Console</h1>
        <p className="text-sm text-gray-500 mt-1">Status-Änderungen laufen wie gehabt (E-Mail bleibt). Neue Felder unten sind admin-only.</p>
      </section>

      <section className="mt-6 rounded-2xl border bg-white">
        <div className="px-4 py-3 font-semibold">Cases</div>
        <div className="space-y-2 p-2">
          {(rows || []).map((r) => (
            <CaseRow key={r.id} item={r as CaseItem} onRefresh={() => { /* optional: client refresh via router */ }} />
          ))}
        </div>
      </section>
    </main>
  );
}
