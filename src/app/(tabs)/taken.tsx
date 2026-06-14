import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

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
  } = useTaken();

  function openFormulier() {
    setFormulierOpen(true);
  }

  function sluitFormulier() {
    resetFormulier();
    setFormulierOpen(false);
  }

  function handleToevoegen() {
    if (voegTaakToe()) {
      setFormulierOpen(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Taken</Text>
        <Pressable style={styles.fab} onPress={openFormulier}>
          <Text style={styles.fabTekst}>+</Text>
        </Pressable>
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
        animationType="slide"
        transparent
        onRequestClose={sluitFormulier}
      >
        <Pressable style={styles.overlay} onPress={sluitFormulier}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitel}>Nieuwe taak</Text>
              <Pressable onPress={sluitFormulier} hitSlop={8}>
                <Text style={styles.sluiten}>✕</Text>
              </Pressable>
            </View>
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
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
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
});
