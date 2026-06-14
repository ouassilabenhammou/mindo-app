import { useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";

import FocusScherm from "@/features/focusmodus/components/FocusScherm";
import FocusStartScherm from "@/features/focusmodus/components/FocusStartScherm";
import { useFocusTimer } from "@/features/focusmodus/hooks/useFocusTimer";

export default function FocusModus() {
  const [isActief, setIsActief] = useState(false);
  const [minuten, setMinuten] = useState(0);
  const navigation = useNavigation();
  const { remaining, progress, isFinished, start, reset } = useFocusTimer(
    minuten * 60,
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: isActief ? { display: "none" } : undefined,
    });
  }, [isActief, navigation]);

  useEffect(() => {
    if (isFinished && isActief) {
      setIsActief(false);
    }
  }, [isFinished, isActief]);

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
        progress={progress}
        onStop={handleStop}
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
