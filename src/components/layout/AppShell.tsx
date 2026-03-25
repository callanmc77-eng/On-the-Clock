import { AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '../../store/settingsStore';
import { OnboardingFlow } from '../onboarding/OnboardingFlow';
import styles from './AppShell.module.css';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const onboarded = useSettingsStore(s => s.onboarded);

  return (
    <div className={styles.shell}>
      <AnimatePresence>
        {!onboarded && <OnboardingFlow key="onboarding" />}
      </AnimatePresence>
      {children}
    </div>
  );
}
