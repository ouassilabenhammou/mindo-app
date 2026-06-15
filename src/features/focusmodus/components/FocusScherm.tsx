import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { focusLayoutStyles } from "../styles/focusLayout";
import CircularMinutePicker from "./CircularMinutePicker";

type Props = {
  remainingSeconds: number;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
};

export default function FocusScherm({
  remainingSeconds,
  isPaused,
  onPause,
  onResume,
  onStop,
}: Props) {
  const boogMinuten = remainingSeconds / 60;

  return (
    <View style={[focusLayoutStyles.container, styles.container]}>
      <StatusBar style="light" />
      <Text style={[focusLayoutStyles.titel, styles.titel]}>Focus</Text>
      <View style={focusLayoutStyles.timerWrapper}>
        <CircularMinutePicker
          minuten={boogMinuten}
          resterendeSeconden={remainingSeconds}
          donker
        />
      </View>
      <View style={focusLayoutStyles.footer}>
        <View style={styles.knoppenRij}>
          <Pressable
            style={styles.actieKnop}
            onPress={isPaused ? onResume : onPause}
          >
            <Text style={styles.actieTekst}>
              {isPaused ? "Hervat" : "Pauze"}
            </Text>
          </Pressable>
          <Pressable style={styles.actieKnop} onPress={onStop}>
            <Text style={styles.actieTekst}>Stop</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0A0A0A",
  },
  titel: {
    color: "#FFFFFF",
  },

  knoppenRij: {
    flexDirection: "row",
    gap: 32,
  },
  actieKnop: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  actieTekst: {
    color: "#555",
    fontSize: 16,
    fontWeight: "500",
  },
  timerTekst: {
    marginTop: 24,
    fontSize: 32,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
