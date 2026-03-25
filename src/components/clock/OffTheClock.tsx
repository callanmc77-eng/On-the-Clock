import { formatCountdown, formatEuroString } from '../../utils/format';
import styles from './OffTheClock.module.css';

interface OffTheClockProps {
  msUntilNext: number;
  nextShiftLabel: string;
  todayEarnings: number;
}

export function OffTheClock({ msUntilNext, nextShiftLabel, todayEarnings }: OffTheClockProps) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>Off the clock</p>
      <div className={styles.countdown}>{formatCountdown(msUntilNext)}</div>
      <p className={styles.nextShift}>Next shift: {nextShiftLabel}</p>
      {todayEarnings > 0 && (
        <p className={styles.todayNote}>You earned {formatEuroString(todayEarnings)} today</p>
      )}
    </div>
  );
}
