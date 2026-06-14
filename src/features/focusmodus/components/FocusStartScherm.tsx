import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import CircularMinutePicker from "./CircularMinutePicker";

type Props = {
  minuten: number;
  onMinutenChange: (minuten: number) => void;
  onStart: () => void;
};

export default function FocusStartScherm({
  minuten,
  onMinutenChange,
  onStart,
}: Props) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.titel}>Focus</Text>
      <View style={styles.timerWrapper}>
        <CircularMinutePicker
          minuten={minuten}
          onMinutenChange={onMinutenChange}
        />
      </View>

      <Pressable
        style={[styles.startKnop, minuten === 0 && styles.startKnopDisabled]}
        onPress={onStart}
        disabled={minuten === 0}
      >
        <Text style={styles.startTekst}>Start</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
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
  startKnopDisabled: {
    opacity: 0.4,
  },
  startTekst: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
