import { useAuth } from "@/features/auth/hooks/useAuth";
import { colors, radius, spacing, typography } from "@/theme";
import { router } from "expo-router";
import { Alert, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Instellingen() {
  const { signOut } = useAuth();
  const insets = useSafeAreaInsets();

  async function uitloggen() {
    await signOut();
    router.replace("/");
  }

  function bevestigUitloggen() {
    // React Native Web roept de knop-callbacks van Alert.alert niet aan,
    // dus gebruiken we daar window.confirm. Op native blijft Alert werken.
    if (Platform.OS === "web") {
      if (window.confirm("Weet je zeker dat je wilt uitloggen?")) {
        void uitloggen();
      }
      return;
    }

    Alert.alert("Uitloggen", "Weet je zeker dat je wilt uitloggen?", [
      { text: "Annuleren", style: "cancel" },
      {
        text: "Uitloggen",
        style: "destructive",
        onPress: () => {
          void uitloggen();
        },
      },
    ]);
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <Pressable
        style={styles.terugKnop}
        onPress={() => router.back()}
        accessibilityRole="button"
        hitSlop={8}
      >
        <Text style={styles.terugTekst}>‹ Terug</Text>
      </Pressable>
      <Text style={styles.titel}>Instellingen</Text>

      <Pressable
        style={styles.uitlogKnop}
        onPress={bevestigUitloggen}
        accessibilityRole="button"
      >
        <Text style={styles.uitlogTekst}>Uitloggen</Text>
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
  terugKnop: {
    alignSelf: "flex-start",
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  terugTekst: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textMuted,
  },
  titel: {
    ...typography.screenTitle,
    marginBottom: spacing.xxl,
  },
  uitlogKnop: {
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  uitlogTekst: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: "700",
  },
});
