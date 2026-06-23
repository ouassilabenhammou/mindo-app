import { useAuth } from "@/features/auth/hooks/useAuth";
import { router } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Instellingen() {
  const { signOut } = useAuth();
  const insets = useSafeAreaInsets();

  function bevestigUitloggen() {
    Alert.alert("Uitloggen", "Weet je zeker dat je wilt uitloggen?", [
      { text: "Annuleren", style: "cancel" },
      {
        text: "Uitloggen",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/");
        },
      },
    ]);
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <Pressable onPress={() => router.back()}>
        <Text>terug</Text>
      </Pressable>
      <Text style={styles.titel}>Instellingen</Text>

      <Pressable style={styles.uitlogKnop} onPress={bevestigUitloggen}>
        <Text style={styles.uitlogTekst}>Uitloggen</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  titel: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
  },
  uitlogKnop: {
    backgroundColor: "#4A6FD6",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  uitlogTekst: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
