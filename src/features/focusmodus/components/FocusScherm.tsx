import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TIMER_SIZE, focusLayoutStyles } from "../styles/focusLayout";
import CircularMinutePicker from "./MinutenKiezer";

import { useTabBarSpace } from "@/features/navigation/constants";
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
  const tabBarSpace = useTabBarSpace();
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
      <View style={focusLayoutStyles.kop}>
        <Text style={[focusLayoutStyles.titel, styles.titel]}>Focus</Text>
      </View>

      <View style={focusLayoutStyles.timerWrapper}>
        <View style={focusLayoutStyles.ringBox}>
          <CircularMinutePicker
            minuten={boogMinuten}
            size={TIMER_SIZE}
            resterendeSeconden={remainingSeconds}
            onMinutenChange={onMinutenChange}
            donker
          />
          <Text style={styles.voortgangTekst}>{percentage}% voltooid</Text>
        </View>
      </View>

      <View style={[focusLayoutStyles.footer, { marginBottom: tabBarSpace }]}>
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
    textAlign: "center",
  },
  voortgangTekst: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: spacing.xl,
    fontSize: 15,
    fontWeight: "600",
    color: colors.accent,
    textAlign: "center",
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
