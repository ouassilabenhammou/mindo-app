import { StyleSheet, Text, View } from "react-native";

import SectieHeader from "@/features/taken/components/SectieHeader";
import TodoItem from "@/features/taken/components/TodoItem";
import { SECTIE_KLEUREN, SECTIE_LABELS } from "@/features/taken/constants/taken";
import type { SectieId, Taak } from "@/features/taken/types/taken";
import { colors, spacing } from "@/theme";

type SectieLijstProps = {
  sectieId: SectieId;
  taken: Taak[];
  isOpen: boolean;
  onToggle: () => void;
  onToggleVoltooid: (id: number) => void;
  onVerwijder: (id: number) => void;
  onBewerk: (taak: Taak) => void;
};

export default function SectieLijst({
  sectieId,
  taken,
  isOpen,
  onToggle,
  onToggleVoltooid,
  onVerwijder,
  onBewerk,
}: SectieLijstProps) {
  return (
    <View style={styles.container}>
      <SectieHeader
        titel={SECTIE_LABELS[sectieId]}
        aantal={taken.length}
        isOpen={isOpen}
        onPress={onToggle}
        kleurSterk={SECTIE_KLEUREN[sectieId].sterk}
        kleurZacht={SECTIE_KLEUREN[sectieId].zacht}
      />

      {isOpen && (
        <View style={styles.lijst}>
          {taken.length === 0 ? (
            <Text style={styles.leeg}>Geen taken</Text>
          ) : (
            taken.map((taak) => (
              <TodoItem
                key={taak.id}
                taak={taak}
                onToggleVoltooid={onToggleVoltooid}
                onVerwijder={onVerwijder}
                onBewerk={onBewerk}
              />
            ))
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  lijst: {
    gap: spacing.md,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xs,
  },
  leeg: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    color: colors.textSubtle,
    fontSize: 14,
  },
});
