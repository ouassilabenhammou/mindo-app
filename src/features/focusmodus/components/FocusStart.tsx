import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BEDIENING_HOOGTE,
  TIMER_SIZE,
  focusLayoutStyles,
} from "../styles/focusLayout";
import MinutenKiezer from "./MinutenKiezer";

import {
  isFocusUitlegVerborgen,
  markeerFocusUitlegVerborgen,
} from "@/features/focusmodus/storage";
import { useTabBarSpace } from "@/features/navigation/constants";
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
  const tabBarSpace = useTabBarSpace();
  const [toonUitleg, setToonUitleg] = useState(true);

  useEffect(() => {
    isFocusUitlegVerborgen().then((verborgen) => {
      if (verborgen) setToonUitleg(false);
    });
  }, []);

  const verbergUitleg = useCallback(() => {
    setToonUitleg(false);
    void markeerFocusUitlegVerborgen();
  }, []);

  const handleMinutenChange = useCallback(
    (waarde: number) => {
      // Bij het slepen van de timer verdwijnt de uitleg uit het zicht.
      if (toonUitleg) verbergUitleg();
      onMinutenChange?.(waarde);
    },
    [toonUitleg, verbergUitleg, onMinutenChange],
  );

  return (
    <View
      style={[focusLayoutStyles.container, { paddingTop: insets.top + spacing.md }]}
    >
      <StatusBar style="dark" />
      <View style={focusLayoutStyles.kop}>
        <Text style={[focusLayoutStyles.titel, styles.titel]}>Focus</Text>
      </View>

      <View style={focusLayoutStyles.timerWrapper}>
        <View style={focusLayoutStyles.ringBox}>
          <MinutenKiezer
            minuten={minuten}
            size={TIMER_SIZE}
            onMinutenChange={handleMinutenChange}
          />
        </View>
      </View>

      <View style={[focusLayoutStyles.footer, { marginBottom: tabBarSpace }]}>
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

      {toonUitleg && (
        <View
          style={[
            styles.uitleg,
            { bottom: tabBarSpace + BEDIENING_HOOGTE + spacing.sm },
          ]}
        >
          <View style={styles.uitlegKop}>
            <Text style={styles.uitlegTitel}>Zo werkt het</Text>
            <Pressable
              onPress={verbergUitleg}
              style={styles.sluitKnop}
              accessibilityRole="button"
              accessibilityLabel="Uitleg verbergen"
              hitSlop={10}
            >
              <SymbolView
                name="xmark"
                size={13}
                tintColor={colors.textMuted}
                weight="bold"
                fallback={<Text style={styles.sluitTeken}>✕</Text>}
              />
            </Pressable>
          </View>
          {STAPPEN.map((stap) => (
            <View key={stap.nummer} style={styles.stapRij}>
              <View style={styles.stapBol}>
                <Text style={styles.stapNummer}>{stap.nummer}</Text>
              </View>
              <Text style={styles.stapTekst}>{stap.tekst}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titel: {
    textAlign: "center",
  },
  uitleg: {
    position: "absolute",
    left: spacing.xxl,
    right: spacing.xxl,
    gap: spacing.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.secondarySoft,
    borderRadius: radius.lg,
    ...shadows.card,
  },
  uitlegKop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  uitlegTitel: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
    textTransform: "uppercase",
    color: colors.textMuted,
  },
  sluitKnop: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  sluitTeken: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textMuted,
    lineHeight: 15,
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
