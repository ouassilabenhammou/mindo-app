import dayjs from "dayjs";
import "dayjs/locale/nl";
import Checkbox from "expo-checkbox";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Taak } from "@/features/taken/types/taken";
import { colors, radius, shadows, spacing } from "@/theme";

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
        style={styles.checkbox}
        value={taak.completed}
        onValueChange={() => onToggleVoltooid(taak.id)}
        color={taak.completed ? colors.accent : undefined}
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
    gap: spacing.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderColor: colors.borderStrong,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  metaRij: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  datum: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: "700",
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
    overflow: "hidden",
  },
  duur: {
    fontSize: 12,
    color: colors.textOnLavender,
    fontWeight: "600",
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
    overflow: "hidden",
  },
  completed: {
    textDecorationLine: "line-through",
    color: colors.textSubtle,
  },
  deleteKnop: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.dangerSoft,
  },
  delete: {
    color: colors.danger,
    fontWeight: "700",
    fontSize: 13,
  },
});
