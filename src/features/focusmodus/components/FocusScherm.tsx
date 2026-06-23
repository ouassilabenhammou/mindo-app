import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { focusLayoutStyles } from "../styles/focusLayout";
import CircularMinutePicker from "./MinutenKiezer";

import type { focusSchermProps } from "@/features/focusmodus/types/focusmodus";

export default function FocusScherm({
  remainingSeconds,
  totaalSeconden,
  isPaused,
  onPause,
  onResume,
  onStop,
  onMinutenChange,
}: focusSchermProps) {
  const boogMinuten = remainingSeconds / 60;

  const verstreken = Math.max(0, totaalSeconden - remainingSeconds);
  const percentage =
    totaalSeconden > 0
      ? Math.min(100, Math.round((verstreken / totaalSeconden) * 100))
      : 0;

  return (
    <View style={[focusLayoutStyles.container, styles.container]}>
      <StatusBar style="light" />
      <Text style={[focusLayoutStyles.titel, styles.titel]}>Focus</Text>

      <View
        style={[styles.statusPill, isPaused && styles.statusPillGepauzeerd]}
      >
        <View
          style={[styles.statusStip, isPaused && styles.statusStipGepauzeerd]}
        />
        <Text style={styles.statusTekst}>
          {isPaused ? "Gepauzeerd" : "Bezig met focussen"}
        </Text>
      </View>

      <View style={focusLayoutStyles.timerWrapper}>
        <CircularMinutePicker
          minuten={boogMinuten}
          resterendeSeconden={remainingSeconds}
          onMinutenChange={onMinutenChange}
          donker
        />
        <Text style={styles.voortgangTekst}>{percentage}% voltooid</Text>
      </View>

      <View style={focusLayoutStyles.footer}>
        <Text style={styles.uitleg}>
          {isPaused
            ? "Tik op Hervat om verder te gaan, of Voltooien om af te ronden."
            : "Tik op Pauze om te onderbreken, of Voltooien om af te ronden."}
        </Text>

        <View style={styles.knoppenRij}>
          <Pressable
            style={styles.pauzeKnop}
            onPress={isPaused ? onResume : onPause}
            accessibilityRole="button"
          >
            <Text style={styles.pauzeTekst}>
              {isPaused ? "Hervat" : "Pauze"}
            </Text>
          </Pressable>

          <Pressable
            style={styles.voltooiKnop}
            onPress={onStop}
            accessibilityRole="button"
          >
            <Text style={styles.voltooiTekst}>Voltooien</Text>
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
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#16210F",
  },
  statusPillGepauzeerd: {
    backgroundColor: "#2A2310",
  },
  statusStip: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6FD66F",
  },
  statusStipGepauzeerd: {
    backgroundColor: "#FFC94A",
  },
  statusTekst: {
    color: "#E8E8E8",
    fontSize: 13,
    fontWeight: "600",
  },
  voortgangTekst: {
    marginTop: 20,
    fontSize: 15,
    fontWeight: "500",
    color: "#9AA8C7",
  },
  uitleg: {
    color: "#888",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  knoppenRij: {
    flexDirection: "row",
    gap: 12,
    alignSelf: "stretch",
  },
  pauzeKnop: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  pauzeTekst: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  voltooiKnop: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 28,
    alignItems: "center",
    backgroundColor: "#4A6FD6",
  },
  voltooiTekst: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
