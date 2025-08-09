
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
    label: 'Documents received',
    nextStep: 'Initial completeness check',
    etaDays: [0, 1],
  },
  INTERNAL_REVIEW_DONE: {
    label: 'Internal review completed',
    nextStep: 'Submit to the German Embassy',
    etaDays: [1, 2],
  },
  SUBMITTED_TO_EMBASSY: {
    label: 'Submitted to the embassy',
    nextStep: 'Embassy review',
    etaDays: [7, 7],
  },
  EMBASSY_APPROVED: {
    label: 'Embassy approved',
    nextStep: 'Schedule appointment',
    etaDays: [7, 21],
  },
  APPOINTMENT_SCHEDULED: {
    label: 'Appointment scheduled',
    nextStep: 'Bring original documents to your appointment',
  },
  COMPLETED: {
    label: 'Completed / Visa issued',
    nextStep: 'Collection / passport return',
  },
};
