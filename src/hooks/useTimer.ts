import { useState, useEffect, useCallback, useRef } from 'react';

export function useTimer(enabled: boolean, totalMinutes: number) {
  const [timeLeft, setTimeLeft] = useState(totalMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (!enabled) return;
    setIsRunning(true);
  }, [enabled]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const getElapsed = useCallback(() => {
    return (totalMinutes * 60) - timeLeft;
  }, [totalMinutes, timeLeft]);

  useEffect(() => {
    if (!enabled || !isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, isRunning]);

  const formatted = (() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  })();

  return {
    timeLeft,
    formatted,
    isRunning,
    isExpired,
    start,
    pause,
    getElapsed,
  };
}
