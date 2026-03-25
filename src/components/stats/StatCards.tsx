import { useRef } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import {
  timeEarnedThreshold,
  workedDaysThisMonth,
  hoursPerDay,
  workDaysPerYear,
} from '../../utils/earnings';
import { formatEuroString, formatDuration, formatTime } from '../../utils/format';
import { useClock } from '../../hooks/useClock';
import styles from './StatCards.module.css';

interface StatCardsProps {
  secondsWorked: number;
  todayEarnings: number;
}

export function StatCards({ secondsWorked, todayEarnings }: StatCardsProps) {
  const now = useClock();
  const settings = useSettingsStore();

  // Track earnings at mount time for "since you started reading"
  const mountRef = useRef({ earnings: todayEarnings });
  const sinceMountEarnings = todayEarnings - mountRef.current.earnings;

  // Coffee time
  const COFFEE_PRICE = 3.50;
  const coffeeTime = timeEarnedThreshold(settings, COFFEE_PRICE);
  const coffeeText = coffeeTime
    ? `You covered a coffee ☕ at ${formatTime(coffeeTime)}`
    : `You'll cover a coffee ☕ soon`;

  // Time at work
  const durationText = secondsWorked > 0
    ? `You've been at work for ${formatDuration(secondsWorked)}`
    : `Not clocked in yet today`;

  // Since reading
  const sinceReadingText = sinceMountEarnings >= 0.01
    ? `You've earned ${formatEuroString(sinceMountEarnings)} since you opened the app`
    : `You'll start earning while the app is open`;

  // Days worked this month
  const daysWorked = workedDaysThisMonth(now, settings);
  const daysText = `${daysWorked} day${daysWorked === 1 ? '' : 's'} worked this month`;

  // Annual projection
  const hpd = hoursPerDay(settings);
  const wpd = workDaysPerYear(settings);
  const annualEstimate = settings.hourlyRate * hpd * wpd;
  const annualText = `At this rate, you'll earn ${formatEuroString(annualEstimate)} this year`;

  const cards = [
    { emoji: '☕', text: coffeeText },
    { emoji: '⏱', text: durationText },
    { emoji: '👀', text: sinceReadingText },
    { emoji: '📅', text: daysText },
    { emoji: '📈', text: annualText },
  ];

  return (
    <div className={styles.scrollRow}>
      {cards.map((card, i) => (
        <div key={i} className={styles.card}>
          <span className={styles.emoji}>{card.emoji}</span>
          <p className={styles.text}>{card.text}</p>
        </div>
      ))}
    </div>
  );
}
