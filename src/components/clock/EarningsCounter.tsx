import { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { formatDayDate } from '../../utils/format';
import styles from './EarningsCounter.module.css';

interface EarningsCounterProps {
  value: number;
  now: Date;
}

export function EarningsCounter({ value, now }: EarningsCounterProps) {
  const spring = useSpring(value, { stiffness: 120, damping: 20, mass: 0.5 });
  const prevValueRef = useRef(value);

  // Detect day reset (value drops significantly) — skip animation backward
  useEffect(() => {
    const prev = prevValueRef.current;
    if (prev - value > 1) {
      spring.set(value, false);
    } else {
      spring.set(value);
    }
    prevValueRef.current = value;
  }, [value, spring]);

  const integerDisplay = useTransform(spring, v => {
    const floored = Math.floor(Math.max(0, v) * 100) / 100;
    return Math.floor(floored).toLocaleString('en-IE');
  });

  const centsDisplay = useTransform(spring, v => {
    const floored = Math.floor(Math.max(0, v) * 100) / 100;
    const integer = Math.floor(floored);
    const cents = Math.round((floored - integer) * 100);
    return String(cents).padStart(2, '0');
  });

  const prevIntegerRef = useRef(Math.floor(value));
  const integerValue = Math.floor(value);
  const integerChanged = integerValue !== prevIntegerRef.current;
  if (integerChanged) prevIntegerRef.current = integerValue;

  return (
    <div className={styles.wrapper}>
      <div className={styles.counterRow}>
        <span className={styles.currency}>€</span>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={integerValue}
            className={styles.integer}
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -6, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {integerDisplay}
          </motion.span>
        </AnimatePresence>
        <span className={styles.dot}>.</span>
        <motion.span className={styles.cents}>{centsDisplay}</motion.span>
      </div>
      <p className={styles.date}>{formatDayDate(now)}</p>
    </div>
  );
}
