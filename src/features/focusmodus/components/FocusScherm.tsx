import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { focusLayoutStyles } from "../styles/focusLayout";
import CircularMinutePicker from "./MinutenKiezer";

import type { focusSchermProps } from "@/features/focusmodus/types/focusmodus";
import { colors, radius, spacing } from "@/theme";

export default function FocusScherm({
  remainingSeconds,
  totaalSeconden,
  isPaused,
  onPause,
  onResume,
  onStop,
  onMinutenChange,
}: focusSchermProps) {
  const insets = useSafeAreaInsets();
  const boogMinuten = remainingSeconds / 60;

  const verstreken = Math.max(0, totaalSeconden - remainingSeconds);
  const percentage =
    totaalSeconden > 0
      ? Math.min(100, Math.round((verstreken / totaalSeconden) * 100))
      : 0;

  return (
    <View
      style={[
        focusLayoutStyles.container,
        styles.container,
        { paddingTop: insets.top + spacing.md },
      ]}
    >
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
    backgroundColor: colors.darkBackground,
  },
  titel: {
    color: colors.white,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.darkSurface,
  },
  statusPillGepauzeerd: {
    backgroundColor: colors.darkSurface,
  },
  statusStip: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.success,
  },
  statusStipGepauzeerd: {
    backgroundColor: colors.warning,
  },
  statusTekst: {
    color: "#E8E8EE",
    fontSize: 13,
    fontWeight: "600",
  },
  voortgangTekst: {
    marginTop: spacing.xl,
    fontSize: 15,
    fontWeight: "600",
    color: colors.accent,
  },
  uitleg: {
    color: "#9A9BAE",
    fontSize: 13,
    textAlign: "center",
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    lineHeight: 18,
  },
  knoppenRij: {
    flexDirection: "row",
    gap: spacing.md,
    alignSelf: "stretch",
  },
  pauzeKnop: {
    flex: 1,
    paddingVertical: 17,
    borderRadius: radius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.darkBorder,
    backgroundColor: colors.darkSurface,
  },
  pauzeTekst: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  voltooiKnop: {
    flex: 1,
    paddingVertical: 17,
    borderRadius: radius.md,
    alignItems: "center",
    backgroundColor: colors.accent,
  },
  voltooiTekst: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
