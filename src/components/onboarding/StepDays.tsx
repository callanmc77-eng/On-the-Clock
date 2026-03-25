import { useState } from 'react';
import { motion } from 'framer-motion';
import type { WorkDay, PaydayConfig } from '../../types/settings';
import styles from './StepDays.module.css';

const DAY_LABELS: { day: WorkDay; label: string; short: string }[] = [
  { day: 1, label: 'Monday', short: 'Mon' },
  { day: 2, label: 'Tuesday', short: 'Tue' },
  { day: 3, label: 'Wednesday', short: 'Wed' },
  { day: 4, label: 'Thursday', short: 'Thu' },
  { day: 5, label: 'Friday', short: 'Fri' },
  { day: 6, label: 'Saturday', short: 'Sat' },
  { day: 0, label: 'Sunday', short: 'Sun' },
];

interface StepDaysProps {
  initialDays: WorkDay[];
  initialPayday: PaydayConfig;
  onBack: () => void;
  onNext: (days: WorkDay[], payday: PaydayConfig) => void;
}

export function StepDays({ initialDays, initialPayday, onBack, onNext }: StepDaysProps) {
  const [days, setDays] = useState<WorkDay[]>(initialDays);
  const [paydayType, setPaydayType] = useState<'last-friday' | 'specific-day'>(initialPayday.type);
  const [specificDay, setSpecificDay] = useState(
    initialPayday.type === 'specific-day' ? initialPayday.day : 28
  );

  function toggleDay(d: WorkDay) {
    setDays(prev =>
      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
    );
  }

  function handleNext() {
    if (days.length === 0) return;
    const config: PaydayConfig =
      paydayType === 'last-friday'
        ? { type: 'last-friday' }
        : { type: 'specific-day', day: specificDay };
    onNext(days, config);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h1 className={styles.title}>Which days<br />do you work?</h1>
        <p className={styles.subtitle}>Select all that apply</p>

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

        <div className={styles.paydaySection}>
          <p className={styles.sectionLabel}>Payday</p>
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

      <div className={styles.actions}>
        <button className={styles.backBtn} onClick={onBack}>Back</button>
        <motion.button
          className={`${styles.btn} ${days.length > 0 ? styles.btnActive : styles.btnDisabled}`}
          onClick={handleNext}
          disabled={days.length === 0}
          whileTap={days.length > 0 ? { scale: 0.97 } : {}}
        >
          Get started
        </motion.button>
      </div>
    </div>
  );
}
