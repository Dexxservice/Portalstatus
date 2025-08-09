'use client';
import { useState } from 'react';

export default function AdminDeleteButton({ id, onDone }: { id: string; onDone?: () => void }) {
  const [loading, setLoading] = useState(false);

  async function doDelete() {
    if (!confirm('Diesen Fall in den Papierkorb verschieben? (Kein E-Mail-Versand)')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/cases/${id}/soft-delete`, {
        method: 'POST',
        headers: { 'x-role': 'admin' }, // Dummy – später echte Admin-Auth
      });
      if (!res.ok) throw new Error('Delete failed');
      onDone?.();
      alert('Fall wurde in den Papierkorb verschoben.');
    } catch {
      alert('Fehler beim Löschen.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className="rounded-lg border px-3 py-2 bg-red-50 hover:bg-red-100"
      onClick={doDelete}
      disabled={loading}
    >
      {loading ? '…' : 'Delete'}
    </button>
  );
}
