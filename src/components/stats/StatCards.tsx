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

  // Daily rotating "treat" card
  const TREATS = [
    { emoji: '☕', name: 'a coffee', price: 3.50 },
    { emoji: '🥐', name: 'a croissant', price: 2.80 },
    { emoji: '🍺', name: 'a pint', price: 6.50 },
    { emoji: '🍕', name: 'a slice of pizza', price: 4.00 },
    { emoji: '🧁', name: 'a cupcake', price: 3.20 },
    { emoji: '🌮', name: 'a taco', price: 5.00 },
    { emoji: '🍫', name: 'a chocolate bar', price: 2.00 },
    { emoji: '🧃', name: 'a smoothie', price: 5.50 },
    { emoji: '🍩', name: 'a doughnut', price: 2.50 },
    { emoji: '🥙', name: 'a wrap', price: 6.00 },
    { emoji: '🍣', name: 'a sushi roll', price: 7.00 },
    { emoji: '🧋', name: 'a bubble tea', price: 6.00 },
    { emoji: '🍦', name: 'an ice cream', price: 3.00 },
    { emoji: '🥨', name: 'a pretzel', price: 2.20 },
  ];
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  const treat = TREATS[dayOfYear % TREATS.length];
  const treatTime = timeEarnedThreshold(settings, treat.price);
  const coffeeText = treatTime
    ? `You covered ${treat.name} ${treat.emoji} at ${formatTime(treatTime)}`
    : `You'll cover ${treat.name} ${treat.emoji} soon`;

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
    { emoji: treat.emoji, text: coffeeText },
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
