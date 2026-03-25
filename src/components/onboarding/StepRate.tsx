import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './StepRate.module.css';

interface StepRateProps {
  initialValue?: number;
  onNext: (rate: number) => void;
}

export function StepRate({ initialValue, onNext }: StepRateProps) {
  const [value, setValue] = useState(initialValue ? String(initialValue) : '');
  const parsed = parseFloat(value);
  const valid = !isNaN(parsed) && parsed > 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h1 className={styles.title}>What's your<br />hourly rate?</h1>
        <p className={styles.subtitle}>Post-tax, take-home pay per hour</p>

        <div className={styles.inputRow}>
          <span className={styles.currency}>€</span>
          <input
            className={styles.input}
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={value}
            onChange={e => setValue(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      <motion.button
        className={`${styles.btn} ${valid ? styles.btnActive : styles.btnDisabled}`}
        onClick={() => valid && onNext(parsed)}
        disabled={!valid}
        whileTap={valid ? { scale: 0.97 } : {}}
      >
        Continue
      </motion.button>
    </div>
  );
}
