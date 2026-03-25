import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '../../store/settingsStore';
import type { WorkDay, PaydayConfig } from '../../types/settings';
import styles from './SettingsSheet.module.css';

const DAY_LABELS: { day: WorkDay; short: string }[] = [
  { day: 1, short: 'Mon' },
  { day: 2, short: 'Tue' },
  { day: 3, short: 'Wed' },
  { day: 4, short: 'Thu' },
  { day: 5, short: 'Fri' },
  { day: 6, short: 'Sat' },
  { day: 0, short: 'Sun' },
];

interface SettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

function toTimeStr(h: number, m: number) {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function SettingsSheet({ isOpen, onClose }: SettingsSheetProps) {
  const settings = useSettingsStore();
  const updateSettings = useSettingsStore(s => s.updateSettings);

  const [rate, setRate] = useState(String(settings.hourlyRate));
  const [startTime, setStartTime] = useState(toTimeStr(settings.workStartHour, settings.workStartMinute));
  const [endTime, setEndTime] = useState(toTimeStr(settings.workEndHour, settings.workEndMinute));
  const [days, setDays] = useState<WorkDay[]>(settings.workDays);
  const [paydayType, setPaydayType] = useState<'last-friday' | 'specific-day'>(settings.paydayConfig.type);
  const [specificDay, setSpecificDay] = useState(
    settings.paydayConfig.type === 'specific-day' ? settings.paydayConfig.day : 28
  );

  function handleOpen() {
    // Sync from store when opening
    setRate(String(settings.hourlyRate));
    setStartTime(toTimeStr(settings.workStartHour, settings.workStartMinute));
    setEndTime(toTimeStr(settings.workEndHour, settings.workEndMinute));
    setDays(settings.workDays);
    setPaydayType(settings.paydayConfig.type);
    setSpecificDay(settings.paydayConfig.type === 'specific-day' ? settings.paydayConfig.day : 28);
  }

  function handleSave() {
    const parsedRate = parseFloat(rate);
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    if (isNaN(parsedRate) || parsedRate <= 0) return;
    if ((sh * 60 + sm) >= (eh * 60 + em)) return;
    if (days.length === 0) return;
    const paydayConfig: PaydayConfig =
      paydayType === 'last-friday'
        ? { type: 'last-friday' }
        : { type: 'specific-day', day: specificDay };
    updateSettings({
      hourlyRate: parsedRate,
      workStartHour: sh, workStartMinute: sm,
      workEndHour: eh, workEndMinute: em,
      workDays: days,
      paydayConfig,
    });
    onClose();
  }

  function toggleDay(d: WorkDay) {
    setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  }

  return (
    <AnimatePresence onExitComplete={() => {}}>
      {isOpen && (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={styles.sheet}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 420, damping: 38 }}
            onAnimationStart={() => isOpen && handleOpen()}
          >
            <div className={styles.handle} />
            <h2 className={styles.title}>Settings</h2>

            <div className={styles.fields}>
              {/* Hourly rate */}
              <div className={styles.field}>
                <label className={styles.label}>Hourly rate (post-tax)</label>
                <div className={styles.rateRow}>
                  <span className={styles.rateCurrency}>€</span>
                  <input
                    className={styles.rateInput}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={rate}
                    onChange={e => setRate(e.target.value)}
                  />
                </div>
              </div>

              {/* Work hours */}
              <div className={styles.field}>
                <label className={styles.label}>Working hours</label>
                <div className={styles.timeRow}>
                  <input className={styles.timeInput} type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                  <span className={styles.timeSep}>→</span>
                  <input className={styles.timeInput} type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                </div>
              </div>

              {/* Work days */}
              <div className={styles.field}>
                <label className={styles.label}>Working days</label>
                <div className={styles.days}>
                  {DAY_LABELS.map(({ day, short }) => (
                    <button
                      key={day}
                      className={`${styles.dayPill} ${days.includes(day) ? styles.dayActive : ''}`}
                      onClick={() => toggleDay(day)}
                    >
                      {short}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payday */}
              <div className={styles.field}>
                <label className={styles.label}>Payday</label>
                <div className={styles.paydayOptions}>
                  <button
                    className={`${styles.optionBtn} ${paydayType === 'last-friday' ? styles.optionActive : ''}`}
                    onClick={() => setPaydayType('last-friday')}
                  >
                    Last Friday
                  </button>
                  <button
                    className={`${styles.optionBtn} ${paydayType === 'specific-day' ? styles.optionActive : ''}`}
                    onClick={() => setPaydayType('specific-day')}
                  >
                    Specific day
                  </button>
                </div>
                {paydayType === 'specific-day' && (
                  <div className={styles.dayOfMonth}>
                    <span className={styles.dayOfMonthLabel}>Day of month</span>
                    <input
                      className={styles.dayInput}
                      type="number"
                      inputMode="numeric"
                      min="1"
                      max="31"
                      value={specificDay}
                      onChange={e => setSpecificDay(Math.min(31, Math.max(1, parseInt(e.target.value) || 1)))}
                    />
                  </div>
                )}
              </div>
            </div>

            <motion.button
              className={styles.saveBtn}
              onClick={handleSave}
              whileTap={{ scale: 0.97 }}
            >
              Save changes
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
