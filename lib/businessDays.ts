// lib/businessDays.ts
const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6; // So=0, Sa=6

export function nextBusinessDay(d: Date): Date {
  const dt = new Date(d);
  while (isWeekend(dt)) dt.setDate(dt.getDate() + 1);
  return dt;
}

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

export function formatDE(d: Date): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

/**
 * Baut den fertigen ETA-Text, z. B.:
 * "ca. 1–3 Werktage (bis 12.08.2025 – 14.08.2025)"
 */
export function buildEtaLabel(
  start: Date,
  etaDays?: [number, number]
): string {
  if (!etaDays) return '—';

  const [min, max] = etaDays;
  const { minDate, maxDate } = businessDateRange(start, min, max);

  const daysLabel =
    min === max ? `${min} Werktag${min === 1 ? '' : 'e'}` : `${min}–${max} Werktage`;

  const dateLabel =
    minDate.getTime() === maxDate.getTime()
      ? formatDE(minDate)
      : `${formatDE(minDate)} – ${formatDE(maxDate)}`;

  return `ca. ${daysLabel} (bis ${dateLabel})`;
}
