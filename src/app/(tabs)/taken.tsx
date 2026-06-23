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

import TaakFormulier from "@/features/taken/components/TaakFormulier";
import TodoLijst from "@/features/taken/components/TodoLijst";
import { useTaken } from "@/features/taken/hooks/useTaken";
import type { Taak } from "@/features/taken/types/taken";

export default function TakenScreen() {
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
    <View style={styles.container}>
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
          <Text style={styles.prioriteerEmoji}>✨</Text>
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
      />

      <Pressable
        style={styles.fab}
        onPress={openNieuweTaak}
        accessibilityRole="button"
        accessibilityLabel="Nieuwe taak toevoegen"
      >
        <Text style={styles.fabTekst}>+</Text>
      </Pressable>

      <Modal
        visible={formulierOpen}
        transparent
        animationType="slide"
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  prioriteerKnop: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A6FD6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 28,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  prioriteerKnopDisabled: {
    opacity: 0.6,
  },
  prioriteerEmoji: {
    fontSize: 15,
  },
  prioriteerTekst: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4A6FD6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  fabTekst: {
    color: "#FFF",
    fontSize: 34,
    fontWeight: "300",
    lineHeight: 38,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  sheet: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 10,
  },
  sheetGreep: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#DADADA",
    marginBottom: 12,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
