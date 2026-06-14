import { ScrollView, StyleSheet, View } from "react-native";

import type { SectieId, SectieOpenState, Taak } from "@/app/types/taken";
import { SECTIE_VOLGORDE } from "@/features/taken/constants/taken";
import SectieLijst from "@/features/taken/components/SectieLijst";

type TodoLijstProps = {
  openSecties: SectieOpenState;
  takenPerSectie: Record<SectieId, Taak[]>;
  onToggleSectie: (sectieId: SectieId) => void;
  onToggleTaakVoltooid: (id: number) => void;
  onVerwijderTaak: (id: number) => void;
};

export default function TodoLijst({
  openSecties,
  takenPerSectie,
  onToggleSectie,
  onToggleTaakVoltooid,
  onVerwijderTaak,
}: TodoLijstProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.secties}
        contentContainerStyle={styles.sectiesContent}
        showsVerticalScrollIndicator={false}
      >
        {SECTIE_VOLGORDE.map((sectieId) => (
          <SectieLijst
            key={sectieId}
            sectieId={sectieId}
            taken={takenPerSectie[sectieId]}
            isOpen={openSecties[sectieId]}
            onToggle={() => onToggleSectie(sectieId)}
            onToggleVoltooid={onToggleTaakVoltooid}
            onVerwijder={onVerwijderTaak}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  secties: {
    flex: 1,
  },
  sectiesContent: {
    paddingBottom: 24,
  },
});
