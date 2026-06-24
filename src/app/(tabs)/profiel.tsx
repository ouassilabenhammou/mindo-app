import { BlurView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { colors, radius, spacing, typography } from "@/theme";

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

        <View style={styles.naamSchaduw}>
          <View style={styles.instellingenClip}>
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

            <Pressable
              style={styles.instellingenKnop}
              onPress={() => router.push("/instellingen")}
              accessibilityRole="button"
              accessibilityLabel="Instellingen"
              hitSlop={8}
            >
              <SymbolView
                name="gearshape"
                size={22}
                tintColor={colors.text}
                weight="regular"
                fallback={<Text style={styles.instellingenFallback}>⚙</Text>}
              />
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.binnenkort}>
        <Text style={styles.binnenkortTekst}>Binnenkort beschikbaar</Text>
      </View>
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
    maxWidth: 240,
  },
  naamTekst: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  instellingenClip: {
    borderRadius: radius.pill,
    overflow: "hidden",
    marginLeft: spacing.md,
  },
  instellingenKnop: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  instellingenFallback: {
    fontSize: 20,
    color: colors.text,
  },
  binnenkort: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  binnenkortTekst: {
    ...typography.subtitle,
    color: colors.textSubtle,
  },
});
