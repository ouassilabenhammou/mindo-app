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
import { colors, radius, shadows, spacing, typography } from "@/theme";

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
        placeholderTextColor={colors.textSubtle}
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
    gap: spacing.md,
  },
  titel: {
    ...typography.sectionTitle,
    fontSize: 19,
  },
  input: {
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actieRij: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  keuzeKnop: {
    paddingHorizontal: spacing.lg,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSoft,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  keuzeKnopGevuld: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentSoft,
  },
  keuzeKnopActief: {
    borderColor: colors.accent,
  },
  keuzeTekst: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: "600",
  },
  keuzeTekstGevuld: {
    color: colors.accent,
    fontWeight: "700",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSoft,
  },
  chipActief: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipTekst: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textMuted,
  },
  chipTekstActief: {
    color: colors.white,
    fontWeight: "700",
  },
  datumPaneel: {
    maxHeight: 380,
  },
  opslaanKnop: {
    marginTop: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: "center",
    ...shadows.primary,
  },
  opslaanKnopDisabled: {
    opacity: 0.35,
  },
  opslaanTekst: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
