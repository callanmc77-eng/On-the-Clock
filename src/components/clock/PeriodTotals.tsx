import { formatEuroString } from '../../utils/format';
import styles from './PeriodTotals.module.css';

interface PeriodTotalsProps {
  week: number;
  month: number;
}

export function PeriodTotals({ week, month }: PeriodTotalsProps) {
  return (
    <div className={styles.row}>
      <div className={styles.item}>
        <span className={styles.label}>This week</span>
        <span className={styles.value}>{formatEuroString(week)}</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.item}>
        <span className={styles.label}>This month</span>
        <span className={styles.value}>{formatEuroString(month)}</span>
      </div>
    </div>
  );
}
