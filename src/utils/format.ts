/** Split a euro amount into integer string and 2-digit cents string */
export function formatEuros(amount: number): { integer: string; cents: string } {
  const floored = Math.floor(amount * 100) / 100;
  const integer = Math.floor(floored);
  const cents = Math.round((floored - integer) * 100);
  return {
    integer: integer.toLocaleString('en-IE'),
    cents: String(cents).padStart(2, '0'),
  };
}

/** Format a euro amount as a plain string e.g. "€1,234.56" */
export function formatEuroString(amount: number): string {
  const { integer, cents } = formatEuros(amount);
  return `€${integer}.${cents}`;
}

/** Format milliseconds as HH:MM:SS */
export function formatCountdown(ms: number): string {
  const totalSecs = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Format seconds as "X h Y min" */
export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** Format a Date as "HH:MM" */
export function formatTime(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

/** Format a Date as "Monday, 25 Mar" */
export function formatDayDate(date: Date): string {
  return date.toLocaleDateString('en-IE', { weekday: 'long', day: 'numeric', month: 'short' });
}
