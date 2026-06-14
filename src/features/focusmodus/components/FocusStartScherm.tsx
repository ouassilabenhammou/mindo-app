import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";

import CircularTimer from "./CircularTimer";

type Props = {
  remainingSeconds: number;
  progress: number;
  onStart: () => void;
};

export default function FocusStartScherm({
  remainingSeconds,
  progress,
  onStart,
}: Props) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.titel}>Focus Modus</Text>
      <Text style={styles.ondertitel}>
        25 minuten ongestoorde focus. Druk op start om te beginnen.
      </Text>

      <View style={styles.timerWrapper}>
        <CircularTimer remainingSeconds={remainingSeconds} progress={progress} />
      </View>

      <Pressable style={styles.startKnop} onPress={onStart}>
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
});
