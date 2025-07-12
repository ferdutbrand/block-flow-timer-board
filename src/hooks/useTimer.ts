
import { useState, useEffect, useCallback, useRef } from 'react';

export const useTimer = (isActive: boolean, onTick?: (seconds: number) => void) => {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const reset = useCallback(() => {
    setSeconds(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const setTime = useCallback((newTime: number) => {
    setSeconds(newTime);
  }, []);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          const newTime = prev + 1;
          onTick?.(newTime);
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, onTick]);

  return { seconds, reset, setTime };
};
