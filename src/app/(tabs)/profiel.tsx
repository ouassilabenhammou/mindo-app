import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, radius, shadows, spacing, typography } from "@/theme";

export default function Voortgang() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingTop: insets.top + spacing.md }]}
    >
      <Text style={styles.titel}>Profiel</Text>

      <Pressable
        style={styles.rij}
        onPress={() => router.push("/instellingen")}
        accessibilityRole="button"
      >
        <Text style={styles.rijTekst}>Instellingen</Text>
        <Text style={styles.chevron}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },
  titel: {
    ...typography.screenTitle,
    marginBottom: spacing.xl,
  },
  rij: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 18,
    paddingHorizontal: spacing.lg,
    ...shadows.card,
  },
  rijTekst: {
    ...typography.bodyStrong,
  },
  chevron: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textSubtle,
  },
});
