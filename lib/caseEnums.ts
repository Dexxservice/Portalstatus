export const STATUS_VALUES = [
  'Documents received',
  'Internal review completed',
  'Submitted to the embassy',
  'Embassy approved',
  'Appointment scheduled',
  'Completed / Visa issued',
] as const;

export const DIPLO_VALUES = ['not created','account created','login verified','data submitted'] as const;
export const TWOFA_VALUES = ['pending','sent','verified','failed'] as const;
export const HEALTH_VALUES = ['not needed','pending','provided','verified'] as const;
export const WORK_VALUES = [0,1,2,3,4,5,6] as const;

export type CaseStatus = typeof STATUS_VALUES[number];
export type DiploStatus = typeof DIPLO_VALUES[number];
export type TwoFAStatus = typeof TWOFA_VALUES[number];
export type HealthStatus = typeof HEALTH_VALUES[number];
