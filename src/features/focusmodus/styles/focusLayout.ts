import { StyleSheet } from "react-native";

import { colors, spacing, typography } from "@/theme";

/** Diameter van de timer-cirkel. Gedeeld zodat start- en focusscherm gelijk zijn. */
export const TIMER_SIZE = 290;

/**
 * Vaste hoogtes voor de kop en het bedieningsgebied. Doordat deze in beide
 * schermen identiek zijn, valt de timer-ring altijd op exact dezelfde hoogte.
 */
export const KOP_HOOGTE = 96;
export const BEDIENING_HOOGTE = 150;

export const focusLayoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    backgroundColor: colors.background,
  },
  kop: {
    height: KOP_HOOGTE,
    justifyContent: "flex-start",
  },
  titel: {
    ...typography.screenTitle,
    marginBottom: spacing.sm,
  },
  timerWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ringBox: {
    width: TIMER_SIZE,
    height: TIMER_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    height: BEDIENING_HOOGTE,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
