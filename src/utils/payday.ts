import type { WorkSettings, PaydayConfig } from '../types/settings';

function getLastFridayOfMonth(year: number, month: number): Date {
  // day 0 of next month = last day of this month
  const lastDay = new Date(year, month + 1, 0);
  const dayOfWeek = lastDay.getDay(); // 0=Sun, 5=Fri
  // Days to subtract to get back to Friday
  const offset = (dayOfWeek - 5 + 7) % 7;
  const lastFriday = new Date(year, month + 1, -offset);
  lastFriday.setHours(0, 0, 0, 0);
  return lastFriday;
}

export function nextPayday(now: Date, config: PaydayConfig): Date {
  const year = now.getFullYear();
  const month = now.getMonth();
  const todayStart = new Date(year, month, now.getDate(), 0, 0, 0, 0);

  if (config.type === 'last-friday') {
    const thisMonth = getLastFridayOfMonth(year, month);
    if (thisMonth >= todayStart) return thisMonth;
    return getLastFridayOfMonth(year, month + 1);
  }

  // specific-day
  const thisMonth = new Date(year, month, config.day, 0, 0, 0, 0);
  if (thisMonth >= todayStart) return thisMonth;
  return new Date(year, month + 1, config.day, 0, 0, 0, 0);
}

/** Calendar days until payday (always >= 0) */
export function daysUntilPayday(now: Date, payday: Date): number {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.round((payday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
}

/** Working days remaining from tomorrow up to and including payday */
export function workingDaysUntilPayday(now: Date, payday: Date, settings: WorkSettings): number {
  let count = 0;
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  while (cursor <= payday) {
    if (settings.workDays.includes(cursor.getDay() as 0)) count++;
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
}

/** Expected earnings from remaining work days until payday */
export function projectedRemainingByPayday(now: Date, payday: Date, settings: WorkSettings): number {
  const hpd = (settings.workEndHour * 60 + settings.workEndMinute -
    settings.workStartHour * 60 - settings.workStartMinute) / 60;
  return workingDaysUntilPayday(now, payday, settings) * settings.hourlyRate * hpd;
}
