import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import type { Prioriteit } from "@/app/types/taken";
import {
  DUUR_OPTIES,
  PRIORITEIT_LABELS,
  PRIORITEITEN,
} from "@/features/taken/constants/taken";

type TaakFormulierProps = {
  tekst: string;
  onTekstChange: (tekst: string) => void;
  geselecteerdePrioriteit: Prioriteit | null;
  onPrioriteitChange: (prioriteit: Prioriteit | null) => void;
  geselecteerdeDuur: number | null;
  onDuurChange: (duur: number | null) => void;
  onToevoegen: () => void;
};

export default function TaakFormulier({
  tekst,
  onTekstChange,
  geselecteerdePrioriteit,
  onPrioriteitChange,
  geselecteerdeDuur,
  onDuurChange,
  onToevoegen,
}: TaakFormulierProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={tekst}
        onChangeText={onTekstChange}
        placeholder="Nieuwe taak"
        onSubmitEditing={onToevoegen}
        returnKeyType="done"
      />

      <View style={styles.rij}>
        <Text style={styles.label}>Prioriteit</Text>
        <View style={styles.chips}>
          <Pressable
            style={[
              styles.chip,
              geselecteerdePrioriteit === null && styles.chipActief,
            ]}
            onPress={() => onPrioriteitChange(null)}
          >
            <Text
              style={[
                styles.chipTekst,
                geselecteerdePrioriteit === null && styles.chipTekstActief,
              ]}
            >
              Geen
            </Text>
          </Pressable>
          {PRIORITEITEN.map((prioriteit) => (
            <Pressable
              key={prioriteit}
              style={[
                styles.chip,
                geselecteerdePrioriteit === prioriteit && styles.chipActief,
              ]}
              onPress={() => onPrioriteitChange(prioriteit)}
            >
              <Text
                style={[
                  styles.chipTekst,
                  geselecteerdePrioriteit === prioriteit &&
                    styles.chipTekstActief,
                ]}
              >
                {PRIORITEIT_LABELS[prioriteit]}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.rij}>
        <Text style={styles.label}>Duur</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.duurRij}
        >
          <Pressable
            style={[
              styles.chip,
              geselecteerdeDuur === null && styles.chipActief,
            ]}
            onPress={() => onDuurChange(null)}
          >
            <Text
              style={[
                styles.chipTekst,
                geselecteerdeDuur === null && styles.chipTekstActief,
              ]}
            >
              Geen
            </Text>
          </Pressable>
          {DUUR_OPTIES.map((duur) => (
            <Pressable
              key={duur}
              style={[
                styles.chip,
                geselecteerdeDuur === duur && styles.chipActief,
              ]}
              onPress={() => onDuurChange(duur)}
            >
              <Text
                style={[
                  styles.chipTekst,
                  geselecteerdeDuur === duur && styles.chipTekstActief,
                ]}
              >
                {duur} min
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <Pressable style={styles.button} onPress={onToevoegen}>
        <Text style={styles.buttonText}>Toevoegen</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  rij: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  duurRij: {
    gap: 8,
    paddingRight: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#F8F8F8",
  },
  chipActief: {
    backgroundColor: "#4A6FD6",
    borderColor: "#4A6FD6",
  },
  chipTekst: {
    fontSize: 14,
    color: "#333",
  },
  chipTekstActief: {
    color: "#FFF",
    fontWeight: "600",
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
