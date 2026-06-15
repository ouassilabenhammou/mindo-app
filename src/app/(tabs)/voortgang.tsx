import { useAuth } from "@/features/auth/hooks/useAuth";
import { router } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Voortgang() {
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
    <View style={styles.container}>
      <Pressable
        style={[styles.uitlogKnop, { top: insets.top + 12 }]}
        onPress={bevestigUitloggen}
        accessibilityLabel="Uitloggen"
        accessibilityRole="button"
      >
        <Text style={styles.uitlogIcoon}>⎋</Text>
      </Pressable>

      <Text style={styles.titel}>Voortgang</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titel: {
    fontSize: 28,
    fontWeight: "700",
    paddingHorizontal: 16,
    marginTop: 16,
  },
  uitlogKnop: {
    position: "absolute",
    right: 16,
    zIndex: 1,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#4A6FD6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  uitlogIcoon: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "500",
  },
});
