// src/app/taken.tsx
import TodoList from "@/features/taken/components/TodoLijst";
import { StyleSheet, Text, View } from "react-native";

export default function TakenScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Taken</Text>
      <TodoList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});
