import { useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useLayoutEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import CircularTimer from "@/features/focusmodus/components/CircularTimer";
import { useFocusTimer } from "@/features/focusmodus/hooks/useFocusTimer";

const FOCUS_DUUR_SECONDEN = 25 * 60;

export default function FocusModus() {
  const [isActief, setIsActief] = useState(false);
  const navigation = useNavigation();
  const { remaining, progress, isFinished, start, reset } =
    useFocusTimer(FOCUS_DUUR_SECONDEN);

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
      <View style={styles.focusScherm}>
        <StatusBar hidden />
        <CircularTimer
          remainingSeconds={remaining}
          progress={progress}
          donker
        />
        <Pressable style={styles.stopKnop} onPress={handleStop}>
          <Text style={styles.stopTekst}>Stop</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.titel}>Focus Modus</Text>
      <Text style={styles.ondertitel}>
        25 minuten ongestoorde focus. Druk op start om te beginnen.
      </Text>

      <View style={styles.timerWrapper}>
        <CircularTimer
          remainingSeconds={remaining}
          progress={progress}
        />
      </View>

      <Pressable style={styles.startKnop} onPress={handleStart}>
        <Text style={styles.startTekst}>Start</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  titel: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  ondertitel: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
    marginBottom: 48,
  },
  timerWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  startKnop: {
    backgroundColor: "#4A6FD6",
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 32,
  },
  startTekst: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  focusScherm: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    alignItems: "center",
    justifyContent: "center",
  },
  stopKnop: {
    position: "absolute",
    bottom: 48,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  stopTekst: {
    color: "#555",
    fontSize: 16,
    fontWeight: "500",
  },
});
