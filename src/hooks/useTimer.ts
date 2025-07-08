
import { useState, useEffect, useCallback } from 'react';

export const useTimer = (isActive: boolean, onTick?: (seconds: number) => void) => {
  const [seconds, setSeconds] = useState(0);

  const reset = useCallback(() => {
    setSeconds(0);
  }, []);

  const setTime = useCallback((newTime: number) => {
    setSeconds(newTime);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds(prev => {
          const newTime = prev + 1;
          onTick?.(newTime);
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, onTick]);

  return { seconds, reset, setTime };
};
