import { SymbolView } from "expo-symbols";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTabBarSpace } from "@/features/navigation/constants";
import TaakFormulier from "@/features/taken/components/TaakFormulier";
import TodoLijst from "@/features/taken/components/TodoLijst";
import { useTaken } from "@/features/taken/hooks/useTaken";
import type { Taak } from "@/features/taken/types/taken";
import { colors, radius, shadows, spacing, typography } from "@/theme";

export default function TakenScreen() {
  const insets = useSafeAreaInsets();
  const tabBarSpace = useTabBarSpace();
  const [formulierOpen, setFormulierOpen] = useState(false);

  const {
    openSecties,
    tekst,
    setTekst,
    geselecteerdePrioriteit,
    setGeselecteerdePrioriteit,
    geselecteerdeDuur,
    setGeselecteerdeDuur,
    geselecteerdeDatum,
    setGeselecteerdeDatum,
    isBewerken,
    startBewerken,
    takenPerSectie,
    slaTaakOp,
    resetFormulier,
    toggleTaakVoltooid,
    verwijderTaak,
    toggleSectie,
    prioriteerMetAI,
    isPrioriteren,
  } = useTaken();

  function openNieuweTaak() {
    resetFormulier();
    setFormulierOpen(true);
  }

  function openBewerken(taak: Taak) {
    startBewerken(taak);
    setFormulierOpen(true);
  }

  function sluitFormulier() {
    resetFormulier();
    setFormulierOpen(false);
  }

  async function handleOpslaan() {
    const gelukt = await slaTaakOp();
    if (gelukt) {
      setFormulierOpen(false);
    }
  }

  async function handlePrioriteer() {
    const result = await prioriteerMetAI();

    if (result?.success) {
      const breakdown = result.breakdown
        ? `\n\n${result.breakdown.deterministic} via regels, ${result.breakdown.ai_judged} via AI.`
        : "";
      Alert.alert(
        "Geprioriteerd ✨",
        `${result.updated} van de ${result.total} taken zijn ingedeeld.${breakdown}`,
      );
      return;
    }

    Alert.alert(
      "Fout",
      result?.message ?? "Kon taken niet prioriteren. Voeg eerst taken toe.",
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Taken</Text>
        <Pressable
          style={[
            styles.prioriteerKnop,
            isPrioriteren && styles.prioriteerKnopDisabled,
          ]}
          onPress={handlePrioriteer}
          disabled={isPrioriteren}
          accessibilityRole="button"
        >
          <SymbolView
            name="sparkles"
            size={16}
            tintColor={colors.accent}
            weight="semibold"
            fallback={<Text style={styles.prioriteerEmoji}>✨</Text>}
          />
          <Text style={styles.prioriteerTekst}>
            {isPrioriteren ? "Bezig…" : "Prioriteer met AI"}
          </Text>
        </Pressable>
      </View>

      <TodoLijst
        openSecties={openSecties}
        takenPerSectie={takenPerSectie}
        onToggleSectie={toggleSectie}
        onToggleTaakVoltooid={toggleTaakVoltooid}
        onVerwijderTaak={verwijderTaak}
        onBewerkTaak={openBewerken}
        bottomInset={tabBarSpace + 76}
      />

      <Pressable
        style={[styles.fab, { bottom: tabBarSpace }]}
        onPress={openNieuweTaak}
        accessibilityRole="button"
        accessibilityLabel="Nieuwe taak toevoegen"
      >
        <Text style={styles.fabTekst}>+</Text>
      </Pressable>

      <Modal
        visible={formulierOpen}
        transparent
        animationType="none"
        onRequestClose={sluitFormulier}
      >
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <Pressable style={styles.overlay} onPress={sluitFormulier}>
            <Pressable
              style={styles.sheet}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.sheetGreep} />
              <TaakFormulier
                tekst={tekst}
                onTekstChange={setTekst}
                geselecteerdePrioriteit={geselecteerdePrioriteit}
                onPrioriteitChange={setGeselecteerdePrioriteit}
                geselecteerdeDuur={geselecteerdeDuur}
                onDuurChange={setGeselecteerdeDuur}
                geselecteerdeDatum={geselecteerdeDatum}
                onDatumChange={setGeselecteerdeDatum}
                onOpslaan={handleOpslaan}
                isBewerken={isBewerken}
              />
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.screenTitle,
  },
  prioriteerKnop: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: radius.pill,
    gap: 6,
  },
  prioriteerKnopDisabled: {
    opacity: 0.5,
  },
  prioriteerEmoji: {
    fontSize: 15,
  },
  prioriteerTekst: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.accent,
  },
  fab: {
    position: "absolute",
    right: spacing.xl,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.accent,
  },
  fabTekst: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "300",
    lineHeight: 30,
    textAlign: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(27, 29, 42, 0.45)",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.md,
  },
  sheetGreep: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.borderStrong,
    marginBottom: spacing.lg,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
