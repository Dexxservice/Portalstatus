// lib/businessDays.ts

// Weekend helper: Sunday=0, Saturday=6
const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

export function nextBusinessDay(d: Date): Date {
  const dt = new Date(d);
  while (isWeekend(dt)) dt.setDate(dt.getDate() + 1);
  return dt;
}

/**
 * Adds "days" business days (Mon–Fri) to "start".
 * Weekends are skipped. Public holidays are not considered.
 */
export function addBusinessDays(start: Date, days: number): Date {
  const base = nextBusinessDay(start);
  const out = new Date(base);
  let remaining = days;

  while (remaining > 0) {
    out.setDate(out.getDate() + 1);
    if (!isWeekend(out)) remaining--;
  }
  return out;
}

/**
 * Returns the min/max target dates when adding business days to "start".
 */
export function businessDateRange(
  start: Date,
  minDays: number,
  maxDays: number
): { minDate: Date; maxDate: Date } {
  const base = nextBusinessDay(start);
  return {
    minDate: addBusinessDays(base, minDays),
    maxDate: addBusinessDays(base, maxDays),
  };
}

/**
 * Formats a date in English. Default is en-GB (DD/MM/YYYY).
 * Change to 'en-US' if you prefer MM/DD/YYYY.
 */
export function formatEN(d: Date, locale: 'en-GB' | 'en-US' = 'en-GB'): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

/**
 * Builds the ETA label in English, e.g.:
 * "approx. 1–3 working days (by 12/08/2025 – 14/08/2025)"
 *
 * - Counts Monday–Friday only
 * - If min=max, shows singular "working day" and a single date
 * - If no etaDays provided, returns "—"
 */
export function buildEtaLabel(
  start: Date,
  etaDays?: [number, number],
  opts?: { locale?: 'en-GB' | 'en-US'; term?: 'working days' | 'business days' }
): string {
  if (!etaDays) return '—';

  const [min, max] = etaDays;
  const { minDate, maxDate } = businessDateRange(start, min, max);

  const term = opts?.term ?? 'working days'; // or 'business days' if you prefer
  const locale = opts?.locale ?? 'en-GB';    // switch to 'en-US' if needed

  const daysLabel =
    min === max
      ? `${min} ${term.slice(0, -1)}` // "working day"
      : `${min}–${max} ${term}`;

  const dateLabel =
    minDate.getTime() === maxDate.getTime()
      ? formatEN(minDate, locale)
      : `${formatEN(minDate, locale)} – ${formatEN(maxDate, locale)}`;

  return `approx. ${daysLabel} (by ${dateLabel})`;
}
