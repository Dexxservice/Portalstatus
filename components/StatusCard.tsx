import { statusCatalog, StatusCode } from '@/lib/statusCatalog';

export function StatusCard({ code }: { code: StatusCode }) {
  const s = statusCatalog[code];
  const eta = s.etaDays ? `ca. ${s.etaDays[0]}–${s.etaDays[1]} Tage` : '—';
  return (
    <div style={{
      border: '1px solid #e5e5e5',
      borderRadius: 12,
      padding: 16,
      display: 'grid',
      gap: 8,
      maxWidth: 560
    }}>
      <div style={{fontSize: 18, fontWeight: 600}}>{s.label}</div>
      <div><b>Nächster Schritt:</b> {s.nextStep}</div>
      <div><b>Wartezeit:</b> {eta}</div>
    </div>
  );
}
