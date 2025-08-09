export type StatusCode =
  | 'DOCS_RECEIVED'
  | 'INTERNAL_REVIEW_DONE'
  | 'SUBMITTED_TO_EMBASSY'
  | 'EMBASSY_APPROVED'
  | 'APPOINTMENT_SCHEDULED'
  | 'COMPLETED';

export type StatusInfo = {
  label: string;
  nextStep: string;
  etaDays?: [number, number]; // [min, max]
};

export const statusCatalog: Record<StatusCode, StatusInfo> = {
  DOCS_RECEIVED: {
    label: 'Dokumente eingegangen',
    nextStep: 'Vollständigkeitsprüfung',
    etaDays: [0, 1], // 3–6 Stunden ~ <1 Tag
  },
  INTERNAL_REVIEW_DONE: {
    label: 'Interne Erstprüfung abgeschlossen',
    nextStep: 'Einreichung bei der Deutschen Botschaft Accra',
    etaDays: [1, 2], // 24–48 Stunden
  },
  SUBMITTED_TO_EMBASSY: {
    label: 'Bei Botschaft eingereicht',
    nextStep: 'Prüfung durch die Botschaft',
    etaDays: [7, 7], // ~7 Werktage
  },
  EMBASSY_APPROVED: {
    label: 'Botschaft freigegeben',
    nextStep: 'Terminvergabe',
    etaDays: [7, 21], // 1–3 Wochen
  },
  APPOINTMENT_SCHEDULED: {
    label: 'Termin vereinbart',
    nextStep: 'Originaldokumente zum Termin mitbringen',
  },
  COMPLETED: {
    label: 'Abgeschlossen / Visum erteilt',
    nextStep: 'Abholung/Passrückgabe',
  },
};
