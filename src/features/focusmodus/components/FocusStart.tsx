import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { focusLayoutStyles } from "../styles/focusLayout";
import MinutenKiezer from "./MinutenKiezer";

import type { focusStartProps } from "@/features/focusmodus/types/focusmodus";
import { colors, radius, shadows, spacing } from "@/theme";

const STAPPEN = [
  {
    nummer: "1",
    tekst: "Sleep rond de cirkel om het aantal minuten te kiezen.",
  },
  {
    nummer: "2",
    tekst: "Druk op Start. De timer telt af terwijl jij gefocust werkt.",
  },
  {
    nummer: "3",
    tekst:
      "Pauzeer wanneer nodig of tik op Voltooien om de sessie af te ronden.",
  },
];

export default function FocusStartScherm({
  minuten,
  onMinutenChange,
  onStart,
}: focusStartProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[focusLayoutStyles.container, { paddingTop: insets.top + spacing.md }]}
    >
      <StatusBar style="dark" />
      <Text style={focusLayoutStyles.titel}>Focus</Text>
      <Text style={styles.ondertitel}>
        Werk geconcentreerd met een aftellende timer.
      </Text>

      <View style={focusLayoutStyles.timerWrapper}>
        <MinutenKiezer minuten={minuten} onMinutenChange={onMinutenChange} />
      </View>

      <View style={styles.uitleg}>
        {STAPPEN.map((stap) => (
          <View key={stap.nummer} style={styles.stapRij}>
            <View style={styles.stapBol}>
              <Text style={styles.stapNummer}>{stap.nummer}</Text>
            </View>
            <Text style={styles.stapTekst}>{stap.tekst}</Text>
          </View>
        ))}
      </View>

      <View style={focusLayoutStyles.footer}>
        <Pressable
          style={[styles.startKnop, minuten === 0 && styles.startKnopDisabled]}
          onPress={onStart}
          disabled={minuten === 0}
          accessibilityRole="button"
        >
          <Text style={styles.startTekst}>
            {minuten === 0 ? "Kies eerst minuten" : `Start ${minuten} min`}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ondertitel: {
    fontSize: 15,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  uitleg: {
    gap: spacing.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.secondarySoft,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
  },
  stapRij: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  stapBol: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  stapNummer: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
  stapTekst: {
    flex: 1,
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  startKnop: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 18,
    alignItems: "center",
    alignSelf: "stretch",
    ...shadows.primary,
  },
  startKnopDisabled: {
    backgroundColor: colors.borderStrong,
    shadowOpacity: 0,
    elevation: 0,
  },
  startTekst: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
