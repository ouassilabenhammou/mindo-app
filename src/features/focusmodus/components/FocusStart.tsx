import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { focusLayoutStyles } from "../styles/focusLayout";
import MinutenKiezer from "./MinutenKiezer";

import type { focusStartProps } from "@/features/focusmodus/types/focusmodus";

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
  return (
    <View style={focusLayoutStyles.container}>
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
    color: "#666",
    marginBottom: 8,
  },
  uitleg: {
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#F4F6FB",
    borderRadius: 16,
    marginBottom: 16,
  },
  stapRij: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stapBol: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#4A6FD6",
    alignItems: "center",
    justifyContent: "center",
  },
  stapNummer: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700",
  },
  stapTekst: {
    flex: 1,
    fontSize: 14,
    color: "#444",
    lineHeight: 19,
  },
  startKnop: {
    backgroundColor: "#4A6FD6",
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: "center",
    alignSelf: "stretch",
  },
  startKnopDisabled: {
    backgroundColor: "#C9D2EA",
  },
  startTekst: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
