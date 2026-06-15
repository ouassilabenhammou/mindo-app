import { useCallback, useEffect, useState } from "react";

export function useFocusTimer(totalSeconds: number) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isRunning && !isPaused) {
      setRemaining(totalSeconds);
    }
  }, [totalSeconds, isRunning, isPaused]);

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
    setIsPaused(false);
    setIsRunning(true);
  }, [totalSeconds]);

  const pause = useCallback(() => {
    setIsRunning(false);
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
    setIsRunning(true);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setRemaining(totalSeconds);
  }, [totalSeconds]);

  const progress = remaining / totalSeconds;
  const isFinished = remaining === 0 && !isRunning;

  return {
    remaining,
    progress,
    isRunning,
    isPaused,
    isFinished,
    start,
    pause,
    resume,
    reset,
  };
}
