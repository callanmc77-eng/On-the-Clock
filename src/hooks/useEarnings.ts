import { useMemo } from 'react';
import { useClock } from './useClock';
import { useSettingsStore } from '../store/settingsStore';
import {
  earningsToday,
  earningsThisWeek,
  earningsThisMonth,
  isOnTheClock,
  msUntilNextShift,
  nextShiftLabel,
  secondsWorkedToday,
} from '../utils/earnings';

export function useEarnings() {
  const now = useClock();
  const settings = useSettingsStore();

  return useMemo(() => ({
    now,
    today: earningsToday(now, settings),
    week: earningsThisWeek(now, settings),
    month: earningsThisMonth(now, settings),
    active: isOnTheClock(now, settings),
    msUntilNext: msUntilNextShift(now, settings),
    nextShiftLabel: nextShiftLabel(now, settings),
    secondsWorked: secondsWorkedToday(now, settings),
  }), [now, settings]);
}
