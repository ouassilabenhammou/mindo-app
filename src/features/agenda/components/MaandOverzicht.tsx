import dayjs from "dayjs";
import "dayjs/locale/nl";
import isoWeek from "dayjs/plugin/isoWeek";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors, radius, shadows, spacing, typography } from "@/theme";

dayjs.locale("nl");
dayjs.extend(isoWeek);

const WEEKDAGEN = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

type MaandOverzichtProps = {
  zichtbaar: boolean;
  geselecteerdeDatum: string;
  onSluit: () => void;
  onSelecteerDatum: (datum: string) => void;
  heeftItemsOpDatum: (datum: string) => boolean;
};

export default function MaandOverzicht({
  zichtbaar,
  geselecteerdeDatum,
  onSluit,
  onSelecteerDatum,
  heeftItemsOpDatum,
}: MaandOverzichtProps) {
  const [zichtbareMaand, setZichtbareMaand] = useState(() =>
    dayjs(geselecteerdeDatum).startOf("month"),
  );

  useEffect(() => {
    if (zichtbaar) {
      setZichtbareMaand(dayjs(geselecteerdeDatum).startOf("month"));
    }
  }, [zichtbaar, geselecteerdeDatum]);

  const vandaag = dayjs();
  const geselecteerd = dayjs(geselecteerdeDatum);

  const eersteDag = zichtbareMaand.startOf("month").startOf("isoWeek");
  const dagen = Array.from({ length: 42 }, (_, i) => eersteDag.add(i, "day"));

  function kies(dag: dayjs.Dayjs) {
    onSelecteerDatum(dag.format("YYYY-MM-DD"));
    onSluit();
  }

  return (
    <Modal
      visible={zichtbaar}
      transparent
      animationType="fade"
      onRequestClose={onSluit}
    >
      <Pressable style={styles.overlay} onPress={onSluit}>
        <Pressable style={styles.kaart} onPress={(e) => e.stopPropagation()}>
          <View style={styles.maandRij}>
            <Pressable
              style={styles.navKnop}
              onPress={() => setZichtbareMaand((m) => m.subtract(1, "month"))}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Vorige maand"
            >
              <Text style={styles.navTekst}>‹</Text>
            </Pressable>
            <Text style={styles.maandTitel}>
              {zichtbareMaand
                .format("MMMM YYYY")
                .replace(/^./, (c) => c.toUpperCase())}
            </Text>
            <Pressable
              style={styles.navKnop}
              onPress={() => setZichtbareMaand((m) => m.add(1, "month"))}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Volgende maand"
            >
              <Text style={styles.navTekst}>›</Text>
            </Pressable>
          </View>

          <View style={styles.weekdagRij}>
            {WEEKDAGEN.map((dag) => (
              <Text key={dag} style={styles.weekdag}>
                {dag}
              </Text>
            ))}
          </View>

          <View style={styles.grid}>
            {dagen.map((dag) => {
              const inMaand = dag.month() === zichtbareMaand.month();
              const isGeselecteerd = geselecteerd.isSame(dag, "day");
              const isVandaag = dag.isSame(vandaag, "day");
              const heeftItems = heeftItemsOpDatum(dag.format("YYYY-MM-DD"));

              return (
                <Pressable
                  key={dag.toISOString()}
                  style={styles.dagCel}
                  onPress={() => kies(dag)}
                  accessibilityRole="button"
                  accessibilityLabel={dag.format("D MMMM YYYY")}
                >
                  <View
                    style={[
                      styles.dagBol,
                      isGeselecteerd && styles.dagBolGeselecteerd,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dagTekst,
                        !inMaand && styles.dagBuitenMaand,
                        isVandaag && !isGeselecteerd && styles.dagVandaag,
                        isGeselecteerd && styles.dagTekstGeselecteerd,
                      ]}
                    >
                      {dag.format("D")}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.stip,
                      heeftItems && !isGeselecteerd && styles.stipZichtbaar,
                    ]}
                  />
                </Pressable>
              );
            })}
          </View>

          <Pressable
            style={styles.sluitKnop}
            onPress={onSluit}
            accessibilityRole="button"
          >
            <Text style={styles.sluitTekst}>Sluiten</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    backgroundColor: "rgba(27, 29, 42, 0.45)",
  },
  kaart: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadows.raised,
  },
  maandRij: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navKnop: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceSoft,
  },
  navTekst: {
    fontSize: 22,
    lineHeight: 24,
    color: colors.text,
  },
  maandTitel: {
    ...typography.sectionTitle,
  },
  weekdagRij: {
    flexDirection: "row",
  },
  weekdag: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSubtle,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dagCel: {
    width: `${100 / 7}%`,
    alignItems: "center",
    paddingVertical: 3,
  },
  dagBol: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  dagBolGeselecteerd: {
    backgroundColor: colors.accent,
  },
  dagTekst: {
    fontSize: 15,
    color: colors.text,
  },
  dagBuitenMaand: {
    color: colors.textSubtle,
    opacity: 0.6,
  },
  dagVandaag: {
    color: colors.accent,
    fontWeight: "700",
  },
  dagTekstGeselecteerd: {
    color: colors.white,
    fontWeight: "700",
  },
  stip: {
    width: 5,
    height: 5,
    borderRadius: radius.pill,
    marginTop: 2,
    backgroundColor: "transparent",
  },
  stipZichtbaar: {
    backgroundColor: colors.accent,
  },
  sluitKnop: {
    marginTop: spacing.xs,
    alignSelf: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSoft,
  },
  sluitTekst: {
    ...typography.button,
    color: colors.text,
    fontSize: 15,
  },
});
