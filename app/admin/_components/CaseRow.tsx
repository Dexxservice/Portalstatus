'use client';
import { useState } from 'react';
import { DIPLO_VALUES, TWOFA_VALUES, HEALTH_VALUES, WORK_VALUES } from '@/lib/caseEnums';

export type CaseItem = {
  id: string;
  email: string;
  status: string;
  updated_at: string;
  digital_diplo_status?: string;
  twofa_email_status?: string;
  health_insurance?: string;
  work_checks?: number;
};

export default function CaseRow({ item, onRefresh }: { item: CaseItem; onRefresh: () => void }) {
  const [loading, setLoading] = useState(false);
  const [openNotes, setOpenNotes] = useState(false);
  const [notes, setNotes] = useState('');

  async function patch(id: string, body: any) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/cases/${id}/metadata`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-role': 'admin' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Update failed');
      onRefresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white border">
      <div className="w-[28%] truncate">{item.email}</div>

      {/* Keep your existing status select logic; here read-only display */}
      <div className="w-[22%]">
        <select className="w-full rounded-lg border px-3 py-2 bg-white" disabled>
          <option>{item.status}</option>
        </select>
      </div>

      <div className="w-[15%]">
        <select
          className="w-full rounded-lg border px-3 py-2 bg-white"
          defaultValue={item.digital_diplo_status || 'not created'}
          onChange={(e) => patch(item.id, { digital_diplo_status: e.target.value })}
          disabled={loading}
        >
          {DIPLO_VALUES.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <div className="w-[15%]">
        <select
          className="w-full rounded-lg border px-3 py-2 bg-white"
          defaultValue={item.twofa_email_status || 'pending'}
          onChange={(e) => patch(item.id, { twofa_email_status: e.target.value })}
          disabled={loading}
        >
          {TWOFA_VALUES.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <div className="w-[15%]">
        <select
          className="w-full rounded-lg border px-3 py-2 bg-white"
          defaultValue={item.health_insurance || 'pending'}
          onChange={(e) => patch(item.id, { health_insurance: e.target.value })}
          disabled={loading}
        >
          {HEALTH_VALUES.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <div className="w-[8%]">
        <select
          className="w-full rounded-lg border px-3 py-2 bg-white"
          defaultValue={String(item.work_checks ?? 0)}
          onChange={(e) => patch(item.id, { work_checks: Number(e.target.value) })}
          disabled={loading}
        >
          {WORK_VALUES.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="rounded-lg border px-3 py-2" onClick={() => setOpenNotes(true)} disabled={loading}>Notes</button>
        <button className="rounded-lg border px-3 py-2" onClick={() => patch(item.id, { soft_delete: true })} disabled={loading}>Delete</button>
      </div>

      {openNotes && (
        <div className="fixed inset-0 bg-black/30 flex items-end md:items-stretch md:justify-end z-50" onClick={() => setOpenNotes(false)}>
          <div className="bg-white w-full md:w-[420px] rounded-t-2xl md:rounded-none p-4 md:h-full md:shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Notes for {item.email}</h3>
              <button className="px-2 py-1" onClick={() => setOpenNotes(false)}>✕</button>
            </div>
            <textarea
              className="mt-3 w-full min-h-[140px] rounded-xl border p-3"
              placeholder="Freitext-Notizen…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="mt-3 flex gap-2 flex-wrap">
              {['Digital Diplo erstellt','2FA-Mail gesendet','Termin bei Botschaft angefragt'].map((q) => (
                <button key={q} className="rounded-full border px-3 py-1" onClick={() => patch(item.id, { quick_note: q })}>{q}</button>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button className="rounded-lg border px-3 py-2" onClick={() => setNotes('')}>Reset</button>
              <button className="rounded-lg bg-black text-white px-3 py-2"
                onClick={() => { if (notes.trim()) patch(item.id, { internal_notes: notes }); setOpenNotes(false); }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
