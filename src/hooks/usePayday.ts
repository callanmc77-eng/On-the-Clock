import { useMemo } from 'react';
import { useClock } from './useClock';
import { useSettingsStore } from '../store/settingsStore';
import { nextPayday, daysUntilPayday, workingDaysUntilPayday, fullPeriodEarnings } from '../utils/payday';

export function usePayday() {
  const now = useClock();
  const settings = useSettingsStore();

  return useMemo(() => {
    const payday = nextPayday(now, settings.paydayConfig);
    const calendarDays = daysUntilPayday(now, payday);
    const workDays = workingDaysUntilPayday(now, payday, settings);
    const periodTotal = fullPeriodEarnings(payday, settings);
    return {
      payday,
      calendarDays,
      workDays,
      projectedTotal: periodTotal,
    };
  }, [now, settings]);
}
