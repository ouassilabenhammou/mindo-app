import { useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { Alert } from "react-native";

import FocusScherm from "@/features/focusmodus/components/FocusScherm";
import FocusStartScherm from "@/features/focusmodus/components/FocusStart";
import { useFocusTimer } from "@/features/focusmodus/hooks/useFocusTimer";
import { colors } from "@/theme";

export default function FocusModus() {
  const [isActief, setIsActief] = useState(false);
  const [minuten, setMinuten] = useState(0);
  const totaalSeconden = minuten * 60;
  const navigation = useNavigation();
  const {
    remaining,
    isPaused,
    start,
    pause,
    resume,
    reset,
    updateRemainingMinutes,
  } = useFocusTimer(totaalSeconden);

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: isActief
        ? {
            backgroundColor: colors.darkBackground,
            borderTopWidth: 0,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: 88,
            paddingTop: 10,
          }
        : undefined,
    });
  }, [isActief, navigation]);

  useEffect(() => {
    if (remaining === 0 && isActief) {
      reset();
      setIsActief(false);
      Alert.alert(
        "Sessie voltooid 🎉",
        "Goed bezig! Je focussessie zit erop. Tijd voor een korte pauze.",
      );
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
        totaalSeconden={totaalSeconden}
        isPaused={isPaused}
        onPause={pause}
        onResume={resume}
        onStop={handleStop}
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
