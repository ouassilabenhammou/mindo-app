import { useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";

import FocusScherm from "@/features/focusmodus/components/FocusScherm";
import FocusStartScherm from "@/features/focusmodus/components/FocusStart";
import { useFocusTimer } from "@/features/focusmodus/hooks/useFocusTimer";

export default function FocusModus() {
  const [isActief, setIsActief] = useState(false);
  const [minuten, setMinuten] = useState(0);
  const navigation = useNavigation();
  const {
    remaining,
    isPaused,
    start,
    pause,
    resume,
    reset,
    updateRemainingMinutes,
  } = useFocusTimer(minuten * 60);

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: isActief ? { backgroundColor: "black" } : undefined,
    });
  }, [isActief, navigation]);

  useEffect(() => {
    if (remaining === 0 && isActief) {
      reset();
      setIsActief(false);
    }
  }, [remaining, isActief, reset]);

  function handleStart() {
    start();
    setIsActief(true);
  }

  function handleStop() {
    reset();
    setIsActief(false);
  }

  if (isActief) {
    return (
      <FocusScherm
        remainingSeconds={remaining}
        isPaused={isPaused}
        onPause={pause}
        onResume={resume}
        onMinutenChange={updateRemainingMinutes}
      />
    );
  }

  return (
    <FocusStartScherm
      minuten={minuten}
      onMinutenChange={setMinuten}
      onStart={handleStart}
    />
  );
}
