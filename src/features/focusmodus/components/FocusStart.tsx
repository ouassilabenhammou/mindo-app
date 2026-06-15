import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { focusLayoutStyles } from "../styles/focusLayout";
import CircularMinutePicker from "./MinutenKiezer";

import type { focusStartProps } from "@/features/focusmodus/types/focusmodus";
export default function FocusStartScherm({
  minuten,
  onMinutenChange,
  onStart,
}: focusStartProps) {
  return (
    <View style={focusLayoutStyles.container}>
      <StatusBar style="dark" />
      <Text style={focusLayoutStyles.titel}>Focus</Text>
      <View style={focusLayoutStyles.timerWrapper}>
        <CircularMinutePicker
          minuten={minuten}
          onMinutenChange={onMinutenChange}
        />
      </View>

      <View style={focusLayoutStyles.footer}>
        <Pressable
          style={[styles.startKnop, minuten === 0 && styles.startKnopDisabled]}
          onPress={onStart}
          disabled={minuten === 0}
        >
          <Text style={styles.startTekst}>Start</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  startKnop: {
    backgroundColor: "#4A6FD6",
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: "center",
    alignSelf: "stretch",
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
