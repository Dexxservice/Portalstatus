import { buildEtaLabel } from '../lib/businessDays';
import { statusCatalog, StatusCode } from '../lib/statusCatalog';
import UploadMissingDocs from './UploadMissingDocs';

export function StatusCard({
  code,
  caseId,
  email,
}: {
  code: StatusCode;
  caseId?: string | null;
  email?: string | null;
}) {
  const s = statusCatalog[code];
  const eta = buildEtaLabel(new Date(), s.etaDays);

  // Embassy-Hinweis nur bei bestimmten Schritten
  const showEmbassyNote =
    code === 'SUBMITTED_TO_EMBASSY' || code === 'EMBASSY_APPROVED';

  // Upload nur anzeigen, wenn Missing + wir caseId & email haben
  const showUpload = code === 'MISSING_DOCUMENTS' && !!caseId && !!email;

  return (
    <div
      style={{
        border: '1px solid #e5e5e5',
        borderRadius: 12,
        padding: 16,
        display: 'grid',
        gap: 8,
        maxWidth: 560,
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 600 }}>{s.label}</div>
      <div>
        <b>Next step:</b> {s.nextStep}
      </div>
      <div>
        <b>Estimated wait:</b> {eta}
      </div>

      {showEmbassyNote && (
        <div style={{ fontSize: 12, color: '#555' }}>
          <em>
            Note: The embassy operates Monday to Friday only. Waiting times refer to
            working days.
          </em>
        </div>
      )}

      {showUpload && <UploadMissingDocs caseId={caseId!} email={email!} />}
    </div>
  );
}
