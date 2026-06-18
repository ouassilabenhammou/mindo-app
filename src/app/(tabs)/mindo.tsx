import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { braindumpNaarTaken } from "@/features/ai/services/mistral";
import type { BraindumpTaak } from "@/features/ai/types/braindump";

type BraindumpBericht = {
  id: string;
  input: string;
  taken: BraindumpTaak[];
};

export default function Mindo() {
  const insets = useSafeAreaInsets();
  const [tekst, setTekst] = useState("");
  const [berichten, setBerichten] = useState<BraindumpBericht[]>([]);
  const [isBezig, setIsBezig] = useState(false);

  async function verstuur() {
    const input = tekst.trim();
    if (!input || isBezig) return;

    const id = Date.now().toString();
    setTekst("");
    setIsBezig(true);

    const taken = (await braindumpNaarTaken(input)) ?? [];
    setBerichten((prev) => [...prev, { id, input, taken }]);
    setIsBezig(false);
  }

  const kanVersturen = tekst.trim().length > 0 && !isBezig;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.titel}>Mindo</Text>

      <ScrollView
        style={styles.berichten}
        contentContainerStyle={styles.berichtenInhoud}
        keyboardShouldPersistTaps="handled"
      >
        {berichten.map((bericht) => (
          <View key={bericht.id} style={styles.ronde}>
            <View style={styles.gebruikerBubble}>
              <Text style={styles.gebruikerTekst}>{bericht.input}</Text>
            </View>

            {bericht.taken.map((taak, index) => (
              <View key={`${bericht.id}-${index}`} style={styles.taak}>
                <Text style={styles.taakTitel}>{taak.titel}</Text>
                {taak.datum !== null && (
                  <Text style={styles.taakDatum}>{taak.datum}</Text>
                )}
              </View>
            ))}
          </View>
        ))}

        {isBezig && (
          <ActivityIndicator style={styles.laden} color="#4A6FD6" />
        )}
      </ScrollView>

      <View style={[styles.invoer, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          style={styles.input}
          value={tekst}
          onChangeText={setTekst}
          placeholder="Typ je braindump..."
          placeholderTextColor="#9A9A9A"
          multiline
          editable={!isBezig}
        />
        <Pressable
          style={[
            styles.verstuurKnop,
            !kanVersturen && styles.verstuurKnopDisabled,
          ]}
          onPress={verstuur}
          disabled={!kanVersturen}
        >
          <Text style={styles.verstuurTekst}>↑</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titel: {
    fontSize: 28,
    fontWeight: "700",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  berichten: {
    flex: 1,
  },
  berichtenInhoud: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 20,
  },
  ronde: {
    gap: 8,
  },
  gebruikerBubble: {
    alignSelf: "flex-end",
    maxWidth: "85%",
    backgroundColor: "#E8EDFB",
    borderRadius: 16,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  gebruikerTekst: {
    fontSize: 16,
    color: "#1A1A1A",
  },
  taak: {
    alignSelf: "flex-start",
    maxWidth: "85%",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 2,
  },
  taakTitel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  taakDatum: {
    fontSize: 13,
    color: "#888",
  },
  laden: {
    marginTop: 8,
  },
  invoer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    backgroundColor: "#FFF",
  },
  input: {
    flex: 1,
    maxHeight: 120,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
  },
  verstuurKnop: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#4A6FD6",
    alignItems: "center",
    justifyContent: "center",
  },
  verstuurKnopDisabled: {
    opacity: 0.4,
  },
  verstuurTekst: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
