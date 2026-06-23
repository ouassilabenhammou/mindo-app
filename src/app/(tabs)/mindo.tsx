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
import { colors, radius, shadows, spacing, typography } from "@/theme";

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
      <Text style={styles.ondertitel}>
        Dump je gedachten, Mindo maakt er taken van.
      </Text>

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
          <ActivityIndicator style={styles.laden} color={colors.accent} />
        )}
      </ScrollView>

      <View style={[styles.invoer, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          style={styles.input}
          value={tekst}
          onChangeText={setTekst}
          placeholder="Typ je braindump..."
          placeholderTextColor={colors.textSubtle}
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
    backgroundColor: colors.background,
  },
  titel: {
    ...typography.screenTitle,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.md,
  },
  ondertitel: {
    ...typography.subtitle,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  berichten: {
    flex: 1,
  },
  berichtenInhoud: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.xl,
  },
  ronde: {
    gap: spacing.sm,
  },
  gebruikerBubble: {
    alignSelf: "flex-end",
    maxWidth: "85%",
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    borderBottomRightRadius: 6,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  gebruikerTekst: {
    fontSize: 16,
    color: colors.white,
  },
  taak: {
    alignSelf: "flex-start",
    maxWidth: "88%",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderTopLeftRadius: 6,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: 3,
    ...shadows.card,
  },
  taakTitel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  taakDatum: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.accent,
  },
  laden: {
    marginTop: spacing.sm,
  },
  invoer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  verstuurKnop: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.accent,
  },
  verstuurKnopDisabled: {
    backgroundColor: colors.borderStrong,
    shadowOpacity: 0,
    elevation: 0,
  },
  verstuurTekst: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
});
