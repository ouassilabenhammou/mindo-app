import Checkbox from "expo-checkbox";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Taak } from "@/app/types/taken";

type TodoItemProps = {
  taak: Taak;
  onToggleVoltooid: (id: number) => void;
  onVerwijder: (id: number) => void;
};

export default function TodoItem({
  taak,
  onToggleVoltooid,
  onVerwijder,
}: TodoItemProps) {
  return (
    <View style={styles.item}>
      <Checkbox
        value={taak.completed}
        onValueChange={() => onToggleVoltooid(taak.id)}
      />

      <View style={styles.content}>
        <Text style={[styles.text, taak.completed && styles.completed]}>
          {taak.text}
        </Text>
        {taak.duur !== null && (
          <Text style={styles.duur}>{taak.duur} min</Text>
        )}
      </View>

      <Pressable onPress={() => onVerwijder(taak.id)} hitSlop={8}>
        <Text style={styles.delete}>X</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 12,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  text: {
    fontSize: 16,
  },
  duur: {
    fontSize: 13,
    color: "#888",
  },
  completed: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  delete: {
    color: "#D94A4A",
    fontWeight: "700",
  },
});
