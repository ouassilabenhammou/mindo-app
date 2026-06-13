// src/features/taken/TodoList.tsx
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import type { Taken } from "@/app/types/taken";
import TodoItem from "@/features/taken/components/TodoItem";

export default function TodoList() {
  const [tasks, setTasks] = useState<Taken[]>([]);

  const [text, setText] = useState("");

  function addTask() {
    if (!text.trim()) return;

    const newTask: Taken = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setText("");
  }

  function deleteTask(id: number) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  function toggleCompleted(id: number) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  return (
    <View style={styles.container}>
      {tasks.map((task) => (
        <TodoItem
          key={task.id}
          task={task}
          deleteTask={deleteTask}
          toggleCompleted={toggleCompleted}
        />
      ))}

      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Nieuwe taak"
        onSubmitEditing={addTask}
        returnKeyType="done"
      />

      <Pressable style={styles.button} onPress={addTask}>
        <Text style={styles.buttonText}>Toevoegen</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    padding: 12,
  },
  button: {
    backgroundColor: "#4A6FD6",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
  },
});
