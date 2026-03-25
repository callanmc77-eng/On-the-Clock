import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './StepHours.module.css';

interface TimeValue { h: number; m: number; }

interface StepHoursProps {
  initialStart: TimeValue;
  initialEnd: TimeValue;
  onBack: () => void;
  onNext: (start: TimeValue, end: TimeValue) => void;
}

function toTimeString({ h, m }: TimeValue) {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function fromTimeString(s: string): TimeValue {
  const [h, m] = s.split(':').map(Number);
  return { h: h ?? 9, m: m ?? 0 };
}

export function StepHours({ initialStart, initialEnd, onBack, onNext }: StepHoursProps) {
  const [start, setStart] = useState(toTimeString(initialStart));
  const [end, setEnd] = useState(toTimeString(initialEnd));

  const startVal = fromTimeString(start);
  const endVal = fromTimeString(end);
  const valid = startVal.h * 60 + startVal.m < endVal.h * 60 + endVal.m;

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h1 className={styles.title}>When do you<br />work?</h1>
        <p className={styles.subtitle}>Your typical working hours</p>

        <div className={styles.fields}>
          <div className={styles.field}>
            <label className={styles.label}>Start time</label>
            <input
              className={styles.timeInput}
              type="time"
              value={start}
              onChange={e => setStart(e.target.value)}
            />
          </div>
          <div className={styles.divider}>→</div>
          <div className={styles.field}>
            <label className={styles.label}>End time</label>
            <input
              className={styles.timeInput}
              type="time"
              value={end}
              onChange={e => setEnd(e.target.value)}
            />
          </div>
        </div>

        {!valid && (
          <p className={styles.error}>End time must be after start time</p>
        )}
      </div>

      <div className={styles.actions}>
        <button className={styles.backBtn} onClick={onBack}>Back</button>
        <motion.button
          className={`${styles.btn} ${valid ? styles.btnActive : styles.btnDisabled}`}
          onClick={() => valid && onNext(startVal, endVal)}
          disabled={!valid}
          whileTap={valid ? { scale: 0.97 } : {}}
        >
          Continue
        </motion.button>
      </div>
    </div>
  );
}
