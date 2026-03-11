"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AlarmClock } from 'lucide-react';

type TimerProps = {
  initialMinutes: number;
  onTimeUp: () => void;
};

export default function Timer({ initialMinutes, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLowTime = timeLeft < 300; // 5 minutes

  return (
    <div
      className={cn(
        'flex items-center gap-2 font-bold text-lg text-primary bg-primary-foreground border-2 border-primary rounded-lg px-4 py-2 shadow-md transition-colors',
        isLowTime && 'text-destructive border-destructive'
      )}
    >
        <AlarmClock size={20} />
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
