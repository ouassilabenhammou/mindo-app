import { useState } from "react";
import {
  ActivityIndicator,
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
    takenPerSectie,
    voegTaakToe,
    resetFormulier,
    toggleTaakVoltooid,
    verwijderTaak,
    toggleSectie,
    prioriteerMetAI,
    isPrioriteren,
  } = useTaken();

  function openFormulier() {
    setFormulierOpen(true);
  }

  function sluitFormulier() {
    resetFormulier();
    setFormulierOpen(false);
  }

  async function handleToevoegen() {
    const gelukt = await voegTaakToe();
    if (gelukt) {
      setFormulierOpen(false);
    }
  }

  async function handlePrioriteer() {
    const gelukt = await prioriteerMetAI();

    if (gelukt) {
      Alert.alert("Klaar", "Je taken zijn ingedeeld bij Nu, Straks en Later.");
      return;
    }

    Alert.alert(
      "Prioriteren mislukt",
      "Voeg eerst taken toe of controleer je internetverbinding.",
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Taken</Text>
        <View style={styles.headerActies}>
          <Pressable
            style={[
              styles.prioriteerKnop,
              isPrioriteren && styles.prioriteerKnopDisabled,
            ]}
            onPress={handlePrioriteer}
            disabled={isPrioriteren}
          >
            {isPrioriteren ? (
              <ActivityIndicator size="small" color="#4A6FD6" />
            ) : (
              <Text style={styles.prioriteerTekst}>Prioriteer</Text>
            )}
          </Pressable>
          <Pressable style={styles.fab} onPress={openFormulier}>
            <Text style={styles.fabTekst}>+</Text>
          </Pressable>
        </View>
      </View>

      <TodoLijst
        openSecties={openSecties}
        takenPerSectie={takenPerSectie}
        onToggleSectie={toggleSectie}
        onToggleTaakVoltooid={toggleTaakVoltooid}
        onVerwijderTaak={verwijderTaak}
      />

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
              <TaakFormulier
                tekst={tekst}
                onTekstChange={setTekst}
                geselecteerdePrioriteit={geselecteerdePrioriteit}
                onPrioriteitChange={setGeselecteerdePrioriteit}
                geselecteerdeDuur={geselecteerdeDuur}
                onDuurChange={setGeselecteerdeDuur}
                onToevoegen={handleToevoegen}
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
  headerActies: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  prioriteerKnop: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#4A6FD6",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 88,
  },
  prioriteerKnopDisabled: {
    opacity: 0.6,
  },
  prioriteerTekst: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A6FD6",
  },
  fab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#4A6FD6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  fabTekst: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "300",
    lineHeight: 30,
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
    paddingTop: 16,
  },

  sheetTitel: {
    fontSize: 20,
    fontWeight: "600",
  },
  sluiten: {
    fontSize: 18,
    color: "#888",
    padding: 4,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
