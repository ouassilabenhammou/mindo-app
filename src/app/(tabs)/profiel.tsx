import { BlurView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { router } from "expo-router";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { colors, radius, shadows, spacing, typography } from "@/theme";

const LIQUID_GLASS = isLiquidGlassAvailable();

export default function Voortgang() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const naam =
    (user?.user_metadata?.full_name as string | undefined)?.trim() ||
    user?.email ||
    "Gebruiker";

  return (
    <View
      style={[styles.container, { paddingTop: insets.top + spacing.md }]}
    >
      <View style={styles.header}>
        <Text style={styles.titel}>Profiel</Text>

        <View style={styles.naamSchaduw}>
          <View style={styles.naamClip}>
            {LIQUID_GLASS ? (
              <GlassView
                style={StyleSheet.absoluteFill}
                glassEffectStyle="regular"
                colorScheme="light"
              />
            ) : (
              <>
                <BlurView
                  intensity={Platform.OS === "android" ? 40 : 60}
                  tint="light"
                  style={StyleSheet.absoluteFill}
                />
                <View style={[StyleSheet.absoluteFill, styles.naamTint]} />
                <View style={styles.naamBorder} />
              </>
            )}

            <View style={styles.naamInhoud}>
              <Text style={styles.naamTekst} numberOfLines={1}>
                {naam}
              </Text>
            </View>
          </View>
        </View>
      </View>

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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },
  titel: {
    ...typography.screenTitle,
  },
  naamSchaduw: {
    borderRadius: radius.pill,
    shadowColor: "#1B1D2A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    flexShrink: 1,
  },
  naamClip: {
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  naamTint: {
    backgroundColor: "rgba(255, 255, 255, 0.55)",
  },
  naamBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255, 255, 255, 0.7)",
  },
  naamInhoud: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    maxWidth: 200,
  },
  naamTekst: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
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
