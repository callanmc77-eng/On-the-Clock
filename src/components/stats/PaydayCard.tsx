import { usePayday } from '../../hooks/usePayday';
import { formatEuroString } from '../../utils/format';
import styles from './PaydayCard.module.css';

export function PaydayCard() {
  const { payday, calendarDays, workDays, projectedTotal } = usePayday();

  const paydayLabel = payday.toLocaleDateString('en-IE', { weekday: 'long', day: 'numeric', month: 'short' });

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div>
          <p className={styles.title}>
            {calendarDays === 0 ? 'Payday today!' : `Payday in ${calendarDays} day${calendarDays === 1 ? '' : 's'}`}
          </p>
          <p className={styles.date}>{paydayLabel}</p>
        </div>
        <div className={styles.badge}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
      </div>
      <div className={styles.divider} />
      <div className={styles.bottom}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Projected by payday</span>
          <span className={styles.statValue}>{formatEuroString(projectedTotal)}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Working days left</span>
          <span className={styles.statValue}>{workDays}</span>
        </div>
      </div>
    </div>
  );
}
