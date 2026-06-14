import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import type { Prioriteit } from "@/app/types/taken";
import { DUUR_OPTIES } from "@/features/taken/constants/taken";

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
  const [toonDuurOpties, setToonDuurOpties] = useState(false);
  const [toonPrioriteitOpties, setToonPrioriteitOpties] = useState(false);

  const standaardDuur = DUUR_OPTIES[0];
  const extraDuurOpties = DUUR_OPTIES.slice(1);
  const inputRef = useRef<TextInput>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        autoFocus
        style={styles.input}
        value={tekst}
        onChangeText={onTekstChange}
        placeholder="Nieuwe taak"
        placeholderTextColor="#9A9A9A"
        onSubmitEditing={onToevoegen}
        returnKeyType="done"
      />
      <View style={styles.actieRij}>
        <Pressable
          style={styles.lijstKnop}
          onPress={() => setToonPrioriteitOpties(!toonPrioriteitOpties)}
        >
          <Text style={styles.lijstTekst}>Taken</Text>
        </Pressable>

        <Pressable
          style={[
            styles.duurKnop,
            geselecteerdeDuur === standaardDuur.value && styles.chipActief,
          ]}
          onPress={() => {
            onDuurChange(standaardDuur.value);
            setToonDuurOpties(!toonDuurOpties);
          }}
        >
          <Text
            style={[
              styles.duurTekst,
              geselecteerdeDuur === standaardDuur.value &&
                styles.chipTekstActief,
            ]}
          >
            {geselecteerdeDuur
              ? DUUR_OPTIES.find((optie) => optie.value === geselecteerdeDuur)
                  ?.label
              : standaardDuur.label}
          </Text>
        </Pressable>

        <Pressable style={styles.icoonKnop}>
          <Text style={styles.icoonTekst}>•••</Text>
        </Pressable>

        <Pressable style={styles.verstuurKnop} onPress={onToevoegen}>
          <Text style={styles.verstuurTekst}>↑</Text>
        </Pressable>
      </View>

      {toonDuurOpties && (
        <View style={styles.chips}>
          {extraDuurOpties.map(({ value, label }) => (
            <Pressable
              key={value}
              style={[
                styles.chip,
                geselecteerdeDuur === value && styles.chipActief,
              ]}
              onPress={() => {
                onDuurChange(value);
                setToonDuurOpties(false);
              }}
            >
              <Text
                style={[
                  styles.chipTekst,
                  geselecteerdeDuur === value && styles.chipTekstActief,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  input: {
    padding: 12,
    fontSize: 16,
  },
  actieRij: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  lijstKnop: {
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F1F1",
    justifyContent: "center",
  },
  lijstTekst: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  duurKnop: {
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F1F1",
    justifyContent: "center",
  },
  duurTekst: {
    fontSize: 14,
    color: "#333",
  },
  icoonKnop: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F1F1",
    alignItems: "center",
    justifyContent: "center",
  },
  icoonTekst: {
    fontSize: 18,
    color: "#555",
    lineHeight: 18,
  },
  verstuurKnop: {
    marginLeft: "auto",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#4A6FD6",
    alignItems: "center",
    justifyContent: "center",
  },
  verstuurTekst: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
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
});
