import { useMemo } from 'react';
import { useClock } from './useClock';
import { useSettingsStore } from '../store/settingsStore';
import { nextPayday, daysUntilPayday, workingDaysUntilPayday, projectedRemainingByPayday } from '../utils/payday';
import { earningsThisMonth } from '../utils/earnings';

export function usePayday() {
  const now = useClock();
  const settings = useSettingsStore();

  return useMemo(() => {
    const payday = nextPayday(now, settings.paydayConfig);
    const calendarDays = daysUntilPayday(now, payday);
    const workDays = workingDaysUntilPayday(now, payday, settings);
    const alreadyEarned = earningsThisMonth(now, settings);
    const remaining = projectedRemainingByPayday(now, payday, settings);
    return {
      payday,
      calendarDays,
      workDays,
      projectedTotal: alreadyEarned + remaining,
    };
  }, [now, settings]);
}
