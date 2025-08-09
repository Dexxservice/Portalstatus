// lib/statusCatalog.ts
export type StatusCode =
  | 'DOCS_RECEIVED'
  | 'INTERNAL_REVIEW_DONE'
  | 'APPOINTMENT_SCHEDULED'
  | 'INTERVIEW_DONE'
  | 'SUBMITTED_TO_EMBASSY'
  | 'VISA_GRANTED';

type StatusMeta = {
  label: string;
  step: number;          // <- Reihenfolge für Progress
  nextstep?: string;     // Text für "Nächster Schritt"
  etaDays?: [number, number]; // für Anzeige "Wartezeit"
};

export const statusCatalog: Record<StatusCode, StatusMeta> = {
  DOCS_RECEIVED: {
    label: 'Documents received',
    step: 1,
    nextstep: 'Internal review',
    etaDays: [1, 3],
  },
  INTERNAL_REVIEW_DONE: {
    label: 'Internal review completed',
    step: 2,
    nextstep: 'Schedule embassy appointment',
    etaDays: [2, 5],
  },
  APPOINTMENT_SCHEDULED: {
    label: 'Appointment scheduled',
    step: 3,
    nextstep: 'Attend interview',
    etaDays: [3, 14],
  },
  INTERVIEW_DONE: {
    label: 'Interview completed',
    step: 4,
    nextstep: 'Submit to embassy',
    etaDays: [1, 5],
  },
  SUBMITTED_TO_EMBASSY: {
    label: 'Submitted to the embassy',
    step: 5,
    nextstep: 'Await decision',
    etaDays: [7, 30],
  },
  VISA_GRANTED: {
    label: 'Visa granted',
    step: 6,
  },
};
