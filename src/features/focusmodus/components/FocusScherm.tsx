import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";

import CircularTimer from "./CircularTimer";

type Props = {
  remainingSeconds: number;
  progress: number;
  onStop: () => void;
};

export default function FocusScherm({
  remainingSeconds,
  progress,
  onStop,
}: Props) {
  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <CircularTimer
        remainingSeconds={remainingSeconds}
        progress={progress}
        donker
      />

      <Pressable style={styles.stopKnop} onPress={onStop}>
        <Text style={styles.stopTekst}>Stop</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
