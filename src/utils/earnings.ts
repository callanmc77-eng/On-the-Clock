import type { WorkSettings, WorkDay } from '../types/settings';

function isWorkDay(day: number, workDays: WorkDay[]): boolean {
  return workDays.includes(day as WorkDay);
}

/** Returns whether the clock is actively running right now */
export function isOnTheClock(now: Date, settings: WorkSettings): boolean {
  if (!isWorkDay(now.getDay(), settings.workDays)) return false;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = settings.workStartHour * 60 + settings.workStartMinute;
  const endMinutes = settings.workEndHour * 60 + settings.workEndMinute;
  return nowMinutes >= startMinutes && nowMinutes < endMinutes;
}

/** Seconds worked today, capped at shift length */
export function secondsWorkedToday(now: Date, settings: WorkSettings): number {
  if (!isWorkDay(now.getDay(), settings.workDays)) return 0;
  const startSecs = settings.workStartHour * 3600 + settings.workStartMinute * 60;
  const endSecs = settings.workEndHour * 3600 + settings.workEndMinute * 60;
  const nowSecs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  if (nowSecs < startSecs) return 0;
  if (nowSecs >= endSecs) return endSecs - startSecs;
  return nowSecs - startSecs;
}

/** Earnings for today — sub-cent precision, never round here */
export function earningsToday(now: Date, settings: WorkSettings): number {
  return (settings.hourlyRate / 3600) * secondsWorkedToday(now, settings);
}

/** Hours per full working day based on settings */
export function hoursPerDay(settings: WorkSettings): number {
  return (settings.workEndHour * 60 + settings.workEndMinute -
    settings.workStartHour * 60 - settings.workStartMinute) / 60;
}

/** Count work days in the current week (Sun=0) up to and including today */
function workedDaysThisWeek(now: Date, settings: WorkSettings): number {
  const today = now.getDay();
  let count = 0;
  for (let d = 0; d <= 6; d++) {
    if (d > today) break;
    if (isWorkDay(d, settings.workDays)) count++;
  }
  return count;
}

/** Count work days this calendar month up to and including today */
export function workedDaysThisMonth(now: Date, settings: WorkSettings): number {
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  let count = 0;
  for (let day = 1; day <= today; day++) {
    const d = new Date(year, month, day).getDay();
    if (isWorkDay(d, settings.workDays)) count++;
  }
  return count;
}

/** Earnings this week (completed days + today's live earnings) */
export function earningsThisWeek(now: Date, settings: WorkSettings): number {
  const hpd = hoursPerDay(settings);
  const totalDays = workedDaysThisWeek(now, settings);
  const todayHasWork = secondsWorkedToday(now, settings) > 0 || isOnTheClock(now, settings);
  const completedDays = todayHasWork ? totalDays - 1 : totalDays;
  return completedDays * settings.hourlyRate * hpd + earningsToday(now, settings);
}

/** Earnings this calendar month (completed days + today's live earnings) */
export function earningsThisMonth(now: Date, settings: WorkSettings): number {
  const hpd = hoursPerDay(settings);
  const totalDays = workedDaysThisMonth(now, settings);
  const todayHasWork = secondsWorkedToday(now, settings) > 0 || isOnTheClock(now, settings);
  const completedDays = todayHasWork ? totalDays - 1 : totalDays;
  return completedDays * settings.hourlyRate * hpd + earningsToday(now, settings);
}

/** Milliseconds until the next shift starts */
export function msUntilNextShift(now: Date, settings: WorkSettings): number {
  for (let i = 1; i <= 8; i++) {
    const candidate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    if (isWorkDay(candidate.getDay(), settings.workDays)) {
      candidate.setHours(settings.workStartHour, settings.workStartMinute, 0, 0);
      return Math.max(0, candidate.getTime() - now.getTime());
    }
  }
  return 0;
}

/** Label for next shift, e.g. "Tomorrow at 09:00" or "Monday at 09:00" */
export function nextShiftLabel(now: Date, settings: WorkSettings): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const startStr = `${String(settings.workStartHour).padStart(2, '0')}:${String(settings.workStartMinute).padStart(2, '0')}`;
  for (let i = 1; i <= 8; i++) {
    const candidate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    if (isWorkDay(candidate.getDay(), settings.workDays)) {
      const label = i === 1 ? 'Tomorrow' : days[candidate.getDay()];
      return `${label} at ${startStr}`;
    }
  }
  return `at ${startStr}`;
}

/** Time of day when earnings first exceeded a threshold today */
export function timeEarnedThreshold(settings: WorkSettings, threshold: number): Date | null {
  if (settings.hourlyRate <= 0) return null;
  const secsNeeded = (threshold / settings.hourlyRate) * 3600;
  const startSecs = settings.workStartHour * 3600 + settings.workStartMinute * 60;
  const endSecs = settings.workEndHour * 3600 + settings.workEndMinute * 60;
  const reachSecs = startSecs + secsNeeded;
  if (reachSecs > endSecs) return null;
  const today = new Date();
  today.setHours(Math.floor(reachSecs / 3600), Math.floor((reachSecs % 3600) / 60), Math.floor(reachSecs % 60), 0);
  return today;
}

/** Count work days per year based on workDays selection */
export function workDaysPerYear(settings: WorkSettings): number {
  return settings.workDays.length * 52;
}
