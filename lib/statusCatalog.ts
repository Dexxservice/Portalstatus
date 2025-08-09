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
  step: number;               // Reihenfolge für Progress
  nextStep?: string;          // <-- camelCase
  etaDays?: [number, number]; // Anzeige Wartezeit
};

export const statusCatalog: Record<StatusCode, StatusMeta> = {
  DOCS_RECEIVED: {
    label: 'Documents received',
    step: 1,
    nextStep: 'Internal review',
    etaDays: [1, 3],
  },
  INTERNAL_REVIEW_DONE: {
    label: 'Internal review completed',
    step: 2,
    nextStep: 'Schedule embassy appointment',
    etaDays: [2, 5],
  },
  APPOINTMENT_SCHEDULED: {
    label: 'Appointment scheduled',
    step: 3,
    nextStep: 'Attend interview',
    etaDays: [3, 14],
  },
  INTERVIEW_DONE: {
    label: 'Interview completed',
    step: 4,
    nextStep: 'Submit to embassy',
    etaDays: [1, 5],
  },
  SUBMITTED_TO_EMBASSY: {
    label: 'Submitted to the embassy',
    step: 5,
    nextStep: 'Await decision',
    etaDays: [7, 30],
  },
  VISA_GRANTED: {
    label: 'Visa granted',
    step: 6,
  },
};
