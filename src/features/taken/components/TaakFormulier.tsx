import dayjs from "dayjs";
import "dayjs/locale/nl";
import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import DatumKiezer from "@/features/taken/components/DatumKiezer";
import {
  DUUR_OPTIES,
  PRIORITEITEN,
  PRIORITEIT_LABELS,
} from "@/features/taken/constants/taken";
import type { Prioriteit } from "@/features/taken/types/taken";

dayjs.locale("nl");

type Paneel = "prioriteit" | "duur" | "datum" | null;

type TaakFormulierProps = {
  tekst: string;
  onTekstChange: (tekst: string) => void;
  geselecteerdePrioriteit: Prioriteit | null;
  onPrioriteitChange: (prioriteit: Prioriteit | null) => void;
  geselecteerdeDuur: number | null;
  onDuurChange: (duur: number | null) => void;
  geselecteerdeDatum: Date | null;
  onDatumChange: (datum: Date | null) => void;
  onOpslaan: () => void;
  isBewerken?: boolean;
};

export default function TaakFormulier({
  tekst,
  onTekstChange,
  geselecteerdePrioriteit,
  onPrioriteitChange,
  geselecteerdeDuur,
  onDuurChange,
  geselecteerdeDatum,
  onDatumChange,
  onOpslaan,
  isBewerken = false,
}: TaakFormulierProps) {
  const [actiefPaneel, setActiefPaneel] = useState<Paneel>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function wisselPaneel(paneel: Paneel) {
    setActiefPaneel((huidig) => (huidig === paneel ? null : paneel));
  }

  const duurLabel = geselecteerdeDuur
    ? DUUR_OPTIES.find((optie) => optie.value === geselecteerdeDuur)?.label
    : "Duur";

  const datumLabel = geselecteerdeDatum
    ? dayjs(geselecteerdeDatum).format("D MMM")
    : "Datum";

  const prioriteitLabel = geselecteerdePrioriteit
    ? PRIORITEIT_LABELS[geselecteerdePrioriteit]
    : "Prioriteit";

  const kanOpslaan = tekst.trim().length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.titel}>
        {isBewerken ? "Taak bewerken" : "Nieuwe taak"}
      </Text>

      <TextInput
        ref={inputRef}
        style={styles.input}
        value={tekst}
        onChangeText={onTekstChange}
        placeholder="Wat wil je doen?"
        placeholderTextColor="#9A9A9A"
        returnKeyType="done"
      />

      <View style={styles.actieRij}>
        <Pressable
          style={[
            styles.keuzeKnop,
            geselecteerdePrioriteit !== null && styles.keuzeKnopGevuld,
            actiefPaneel === "prioriteit" && styles.keuzeKnopActief,
          ]}
          onPress={() => wisselPaneel("prioriteit")}
        >
          <Text
            style={[
              styles.keuzeTekst,
              geselecteerdePrioriteit !== null && styles.keuzeTekstGevuld,
            ]}
          >
            {prioriteitLabel}
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.keuzeKnop,
            geselecteerdeDuur !== null && styles.keuzeKnopGevuld,
            actiefPaneel === "duur" && styles.keuzeKnopActief,
          ]}
          onPress={() => wisselPaneel("duur")}
        >
          <Text
            style={[
              styles.keuzeTekst,
              geselecteerdeDuur !== null && styles.keuzeTekstGevuld,
            ]}
          >
            {duurLabel}
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.keuzeKnop,
            geselecteerdeDatum !== null && styles.keuzeKnopGevuld,
            actiefPaneel === "datum" && styles.keuzeKnopActief,
          ]}
          onPress={() => wisselPaneel("datum")}
        >
          <Text
            style={[
              styles.keuzeTekst,
              geselecteerdeDatum !== null && styles.keuzeTekstGevuld,
            ]}
          >
            {datumLabel}
          </Text>
        </Pressable>
      </View>

      {actiefPaneel === "prioriteit" && (
        <View style={styles.chips}>
          {PRIORITEITEN.map((prioriteit) => {
            const isActief = geselecteerdePrioriteit === prioriteit;
            return (
              <Pressable
                key={prioriteit}
                style={[styles.chip, isActief && styles.chipActief]}
                onPress={() =>
                  onPrioriteitChange(isActief ? null : prioriteit)
                }
              >
                <Text
                  style={[
                    styles.chipTekst,
                    isActief && styles.chipTekstActief,
                  ]}
                >
                  {PRIORITEIT_LABELS[prioriteit]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {actiefPaneel === "duur" && (
        <View style={styles.chips}>
          {DUUR_OPTIES.map(({ value, label }) => {
            const isActief = geselecteerdeDuur === value;
            return (
              <Pressable
                key={value}
                style={[styles.chip, isActief && styles.chipActief]}
                onPress={() => onDuurChange(isActief ? null : value)}
              >
                <Text
                  style={[
                    styles.chipTekst,
                    isActief && styles.chipTekstActief,
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {actiefPaneel === "datum" && (
        <ScrollView style={styles.datumPaneel} keyboardShouldPersistTaps="handled">
          <DatumKiezer waarde={geselecteerdeDatum} onChange={onDatumChange} />
        </ScrollView>
      )}

      <Pressable
        style={[styles.opslaanKnop, !kanOpslaan && styles.opslaanKnopDisabled]}
        onPress={onOpslaan}
        disabled={!kanOpslaan}
        accessibilityRole="button"
      >
        <Text style={styles.opslaanTekst}>
          {isBewerken ? "Wijzigingen opslaan" : "Taak toevoegen"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  titel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: "#F6F6F6",
    borderRadius: 12,
  },
  actieRij: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  keuzeKnop: {
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F1F1F1",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  keuzeKnopGevuld: {
    backgroundColor: "#EEF2FB",
  },
  keuzeKnopActief: {
    borderColor: "#4A6FD6",
  },
  keuzeTekst: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  keuzeTekstGevuld: {
    color: "#4A6FD6",
    fontWeight: "600",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
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
  datumPaneel: {
    maxHeight: 380,
  },
  opslaanKnop: {
    marginTop: 4,
    backgroundColor: "#4A6FD6",
    borderRadius: 24,
    paddingVertical: 15,
    alignItems: "center",
  },
  opslaanKnopDisabled: {
    opacity: 0.4,
  },
  opslaanTekst: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
