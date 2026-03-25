export type WorkDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // Sunday=0, Monday=1, ...

export type PaydayConfig =
  | { type: 'last-friday' }
  | { type: 'specific-day'; day: number }; // 1-31

export interface WorkSettings {
  hourlyRate: number;
  workStartHour: number;
  workStartMinute: number;
  workEndHour: number;
  workEndMinute: number;
  workDays: WorkDay[];
  paydayConfig: PaydayConfig;
  onboarded: boolean;
}
