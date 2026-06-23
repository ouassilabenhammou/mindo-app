import dayjs from "dayjs";
import "dayjs/locale/nl";
import Checkbox from "expo-checkbox";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Taak } from "@/features/taken/types/taken";

dayjs.locale("nl");

type TodoItemProps = {
  taak: Taak;
  onToggleVoltooid: (id: number) => void;
  onVerwijder: (id: number) => void;
  onBewerk: (taak: Taak) => void;
};

export default function TodoItem({
  taak,
  onToggleVoltooid,
  onVerwijder,
  onBewerk,
}: TodoItemProps) {
  const heeftMeta = taak.duur !== null || taak.vervaldatum !== null;

  return (
    <View style={styles.item}>
      <Checkbox
        value={taak.completed}
        onValueChange={() => onToggleVoltooid(taak.id)}
        color={taak.completed ? "#4A6FD6" : undefined}
      />

      <Pressable
        style={styles.content}
        onPress={() => onBewerk(taak)}
        accessibilityRole="button"
        accessibilityLabel={`Bewerk taak ${taak.text}`}
      >
        <Text style={[styles.text, taak.completed && styles.completed]}>
          {taak.text}
        </Text>
        {heeftMeta && (
          <View style={styles.metaRij}>
            {taak.vervaldatum !== null && (
              <Text style={styles.datum}>
                {dayjs(taak.vervaldatum).format("D MMM • HH:mm")}
              </Text>
            )}
            {taak.duur !== null && (
              <Text style={styles.duur}>{taak.duur} min</Text>
            )}
          </View>
        )}
      </Pressable>

      <Pressable
        onPress={() => onVerwijder(taak.id)}
        hitSlop={10}
        style={styles.deleteKnop}
        accessibilityRole="button"
        accessibilityLabel={`Verwijder taak ${taak.text}`}
      >
        <Text style={styles.delete}>✕</Text>
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
    backgroundColor: "#FFF",
  },
  content: {
    flex: 1,
    gap: 4,
  },
  text: {
    fontSize: 16,
    color: "#1A1A1A",
  },
  metaRij: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  datum: {
    fontSize: 13,
    color: "#4A6FD6",
    fontWeight: "500",
  },
  duur: {
    fontSize: 13,
    color: "#888",
  },
  completed: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  deleteKnop: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FBECEC",
  },
  delete: {
    color: "#D94A4A",
    fontWeight: "700",
    fontSize: 13,
  },
});
