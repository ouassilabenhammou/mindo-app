import { useAuth } from "@/features/auth/hooks/useAuth";
import LoginScreen from "@/features/auth/screens/LoginScreen";
import { isOnboardingVoltooid } from "@/features/onboarding/storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { colors } from "@/theme";

export default function Index() {
  const { session, loading } = useAuth();
  const [onboardingKlaar, setOnboardingKlaar] = useState<boolean | null>(null);

  useEffect(() => {
    isOnboardingVoltooid().then(setOnboardingKlaar);
  }, []);

  if (loading || onboardingKlaar === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!onboardingKlaar) {
    return <Redirect href="/onboarding" />;
  }

  if (!session) {
    return <LoginScreen />;
  }

  return <Redirect href="/agenda" />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
});
