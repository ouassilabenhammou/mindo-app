import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Voortgang() {
  return (
    <View style={styles.container}>
      <View style={styles.instellingKnop}>
        <Pressable onPress={() => router.push("/instellingen")}>
          <Text>Instellingen</Text>
        </Pressable>
      </View>
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
  instellingKnop: {
    position: "absolute",
    right: 16,
    zIndex: 1,
    height: 44,
    borderRadius: 22,
  },
});
