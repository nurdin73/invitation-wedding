'use client';

import * as React from 'react';

interface CountdownTimerProps {
  targetDate?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [mounted, setMounted] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  React.useEffect(() => {
    setMounted(true);
    // Parse target date or fallback to default 30 days from now
    const parsedDate = targetDate ? new Date(targetDate).getTime() : NaN;
    const targetTimestamp = !isNaN(parsedDate)
      ? parsedDate
      : Date.now() + 30 * 24 * 60 * 60 * 1000;

    const calculate = () => {
      const now = Date.now();
      const difference = targetTimestamp - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center gap-2 pt-4 opacity-50 text-[10px]">
        <span>Menghitung hari bahagia...</span>
      </div>
    );
  }

  if (timeLeft.isPast) {
    return (
      <div className="pt-3 text-xs font-medium text-[var(--inv-primary)]">
        ✨ Momen Bahagia Telah Berlangsung ✨
      </div>
    );
  }

  const units = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds },
  ];

  return (
    <div
      data-testid="countdown-timer"
      className="grid grid-cols-4 gap-2 max-w-[280px] mx-auto pt-4"
    >
      {units.map((u) => (
        <div
          key={u.label}
          className="p-2 rounded-xl border border-current/15 bg-current/[0.03] backdrop-blur-xs flex flex-col items-center justify-center shadow-2xs"
        >
          <span
            className="text-base sm:text-lg font-bold font-mono leading-none"
            style={{ color: 'var(--inv-primary, #B86B70)' }}
          >
            {String(u.value).padStart(2, '0')}
          </span>
          <span className="text-[9px] uppercase tracking-wider opacity-70 font-medium mt-1">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
};
