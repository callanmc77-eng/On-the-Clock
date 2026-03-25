import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WorkSettings } from '../types/settings';

interface SettingsStore extends WorkSettings {
  updateSettings: (patch: Partial<WorkSettings>) => void;
  completeOnboarding: (settings: Omit<WorkSettings, 'onboarded'>) => void;
}

const DEFAULTS: WorkSettings = {
  hourlyRate: 0,
  workStartHour: 9,
  workStartMinute: 0,
  workEndHour: 17,
  workEndMinute: 0,
  workDays: [1, 2, 3, 4, 5],
  paydayConfig: { type: 'last-friday' },
  onboarded: false,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      updateSettings: (patch) => set((s) => ({ ...s, ...patch })),
      completeOnboarding: (settings) => set({ ...settings, onboarded: true }),
    }),
    { name: 'ontheclock_settings' }
  )
);
