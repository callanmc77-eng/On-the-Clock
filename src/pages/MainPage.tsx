import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEarnings } from '../hooks/useEarnings';
import { EarningsCounter } from '../components/clock/EarningsCounter';
import { OffTheClock } from '../components/clock/OffTheClock';
import { PeriodTotals } from '../components/clock/PeriodTotals';
import { PaydayCard } from '../components/stats/PaydayCard';
import { StatCards } from '../components/stats/StatCards';
import { SettingsSheet } from '../components/settings/SettingsSheet';
import styles from './MainPage.module.css';

export function MainPage() {
  const earnings = useEarnings();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={`${styles.header} safe-top`}>
        <span className={styles.appName}>On The Clock</span>
        <button
          className={styles.settingsBtn}
          onClick={() => setSettingsOpen(true)}
          aria-label="Settings"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </div>

      {/* Scrollable body */}
      <div className={`${styles.body} scroll-area`}>
        {/* Hero: counter or off-clock */}
        <AnimatePresence mode="wait">
          {earnings.active ? (
            <motion.div
              key="on"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <EarningsCounter value={earnings.today} now={earnings.now} />
            </motion.div>
          ) : (
            <motion.div
              key="off"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <OffTheClock
                msUntilNext={earnings.msUntilNext}
                nextShiftLabel={earnings.nextShiftLabel}
                todayEarnings={earnings.today}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Week / month totals */}
        <PeriodTotals week={earnings.week} month={earnings.month} />

        {/* Payday */}
        <div className={styles.section}>
          <PaydayCard />
        </div>

        {/* Fun stats */}
        <div className={styles.section}>
          <StatCards secondsWorked={earnings.secondsWorked} todayEarnings={earnings.today} />
        </div>

        <div className={styles.bottomPad} />
      </div>

      {/* Settings sheet */}
      <SettingsSheet isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
