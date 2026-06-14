import { useCallback, useEffect, useState } from "react";

export function useFocusTimer(totalSeconds: number) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      setRemaining(totalSeconds);
    }
  }, [totalSeconds, isRunning]);

  useEffect(() => {
    if (!isRunning || remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          setIsRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, remaining]);

  const start = useCallback(() => {
    setRemaining(totalSeconds);
    setIsRunning(true);
  }, [totalSeconds]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setRemaining(totalSeconds);
  }, [totalSeconds]);

  const progress = remaining / totalSeconds;
  const isFinished = remaining === 0 && !isRunning;

  return { remaining, progress, isRunning, isFinished, start, reset };
}
