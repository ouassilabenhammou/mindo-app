import { StyleSheet } from "react-native";

import { colors, spacing, typography } from "@/theme";

export const focusLayoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    backgroundColor: colors.background,
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
  footer: {
    minHeight: 54,
    marginBottom: spacing.xxxl,
    justifyContent: "center",
    alignItems: "center",
  },
});
