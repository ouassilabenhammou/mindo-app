// src/features/taken/TodoItem.tsx
import Checkbox from "expo-checkbox";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Taken } from "@/app/types/taken";

type TodoItemProps = {
  task: Taken;
  deleteTask: (id: number) => void;
  toggleCompleted: (id: number) => void;
};

export default function TodoItem({
  task,
  deleteTask,
  toggleCompleted,
}: TodoItemProps) {
  return (
    <View style={styles.item}>
      <Checkbox
        value={task.completed}
        onValueChange={() => toggleCompleted(task.id)}
      />

      <Text style={[styles.text, task.completed && styles.completed]}>
        {task.text}
      </Text>

      <Pressable onPress={() => deleteTask(task.id)}>
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
  text: {
    flex: 1,
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
