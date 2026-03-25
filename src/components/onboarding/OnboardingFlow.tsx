import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '../../store/settingsStore';
import type { WorkSettings } from '../../types/settings';
import { StepRate } from './StepRate';
import { StepHours } from './StepHours';
import { StepDays } from './StepDays';
import styles from './OnboardingFlow.module.css';

type Draft = Omit<WorkSettings, 'onboarded'>;

export function OnboardingFlow() {
  const completeOnboarding = useSettingsStore(s => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [draft, setDraft] = useState<Partial<Draft>>({});

  function handleNext(patch: Partial<Draft>) {
    const updated = { ...draft, ...patch };
    setDraft(updated);
    if (step === 2) {
      completeOnboarding(updated as Draft);
    } else {
      setDirection(1);
      setStep(s => s + 1);
    }
  }

  function handleBack() {
    setDirection(-1);
    setStep(s => s - 1);
  }

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Progress dots */}
      <div className={styles.progress}>
        {[0, 1, 2].map(i => (
          <div key={i} className={`${styles.dot} ${i === step ? styles.dotActive : i < step ? styles.dotDone : ''}`} />
        ))}
      </div>

      <div className={styles.stepContainer}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className={styles.step}
          >
            {step === 0 && (
              <StepRate
                initialValue={draft.hourlyRate}
                onNext={v => handleNext({ hourlyRate: v })}
              />
            )}
            {step === 1 && (
              <StepHours
                initialStart={{ h: draft.workStartHour ?? 9, m: draft.workStartMinute ?? 0 }}
                initialEnd={{ h: draft.workEndHour ?? 17, m: draft.workEndMinute ?? 0 }}
                onBack={handleBack}
                onNext={(start, end) => handleNext({
                  workStartHour: start.h,
                  workStartMinute: start.m,
                  workEndHour: end.h,
                  workEndMinute: end.m,
                })}
              />
            )}
            {step === 2 && (
              <StepDays
                initialDays={draft.workDays ?? [1, 2, 3, 4, 5]}
                initialPayday={draft.paydayConfig ?? { type: 'last-friday' }}
                onBack={handleBack}
                onNext={(days, paydayConfig) => handleNext({ workDays: days, paydayConfig })}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
