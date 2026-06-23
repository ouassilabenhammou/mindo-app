import dayjs from "dayjs";
import "dayjs/locale/nl";
import isoWeek from "dayjs/plugin/isoWeek";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

dayjs.locale("nl");
dayjs.extend(isoWeek);

type DatumKiezerProps = {
  waarde: Date | null;
  onChange: (datum: Date | null) => void;
};

const WEEKDAGEN = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

const TIJDSTIPPEN = [
  { label: "Ochtend", uur: 9 },
  { label: "Middag", uur: 13 },
  { label: "Avond", uur: 18 },
];

function metTijd(basis: dayjs.Dayjs, vorige: Date | null): Date {
  const uur = vorige ? dayjs(vorige).hour() : 9;
  const minuut = vorige ? dayjs(vorige).minute() : 0;
  return basis.hour(uur).minute(minuut).second(0).millisecond(0).toDate();
}

export default function DatumKiezer({ waarde, onChange }: DatumKiezerProps) {
  const [zichtbareMaand, setZichtbareMaand] = useState(() =>
    dayjs(waarde ?? new Date()).startOf("month"),
  );

  const geselecteerd = waarde ? dayjs(waarde) : null;
  const vandaag = dayjs();

  const eersteDag = zichtbareMaand.startOf("month").startOf("isoWeek");
  const dagen = Array.from({ length: 42 }, (_, i) => eersteDag.add(i, "day"));

  function kiesDag(dag: dayjs.Dayjs) {
    onChange(metTijd(dag, waarde));
  }

  function kiesSnel(dag: dayjs.Dayjs) {
    setZichtbareMaand(dag.startOf("month"));
    onChange(metTijd(dag, waarde));
  }

  function kiesTijd(uur: number) {
    const basis = geselecteerd ?? vandaag;
    onChange(basis.hour(uur).minute(0).second(0).millisecond(0).toDate());
  }

  return (
    <View style={styles.container}>
      <View style={styles.snelRij}>
        <Pressable
          style={styles.snelChip}
          onPress={() => kiesSnel(vandaag)}
          accessibilityRole="button"
        >
          <Text style={styles.snelTekst}>Vandaag</Text>
        </Pressable>
        <Pressable
          style={styles.snelChip}
          onPress={() => kiesSnel(vandaag.add(1, "day"))}
          accessibilityRole="button"
        >
          <Text style={styles.snelTekst}>Morgen</Text>
        </Pressable>
        <Pressable
          style={styles.snelChip}
          onPress={() => kiesSnel(vandaag.add(7, "day"))}
          accessibilityRole="button"
        >
          <Text style={styles.snelTekst}>Volgende week</Text>
        </Pressable>
        {waarde && (
          <Pressable
            style={[styles.snelChip, styles.wisChip]}
            onPress={() => onChange(null)}
            accessibilityRole="button"
          >
            <Text style={styles.wisTekst}>Wissen</Text>
          </Pressable>
        )}
      </View>

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
          {zichtbareMaand.format("MMMM YYYY").replace(/^./, (c) =>
            c.toUpperCase(),
          )}
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
          const isGeselecteerd = geselecteerd?.isSame(dag, "day") ?? false;
          const isVandaag = dag.isSame(vandaag, "day");

          return (
            <Pressable
              key={dag.toISOString()}
              style={styles.dagCel}
              onPress={() => kiesDag(dag)}
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
            </Pressable>
          );
        })}
      </View>

      <View style={styles.tijdRij}>
        {TIJDSTIPPEN.map(({ label, uur }) => {
          const isActief = geselecteerd?.hour() === uur;
          return (
            <Pressable
              key={label}
              style={[styles.tijdChip, isActief && styles.tijdChipActief]}
              onPress={() => kiesTijd(uur)}
              accessibilityRole="button"
            >
              <Text
                style={[styles.tijdTekst, isActief && styles.tijdTekstActief]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingTop: 4,
  },
  snelRij: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  snelChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: "#EEF2FB",
  },
  snelTekst: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A6FD6",
  },
  wisChip: {
    backgroundColor: "#FBECEC",
  },
  wisTekst: {
    fontSize: 13,
    fontWeight: "600",
    color: "#D94A4A",
  },
  maandRij: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navKnop: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F1F1",
  },
  navTekst: {
    fontSize: 22,
    lineHeight: 24,
    color: "#333",
  },
  maandTitel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  weekdagRij: {
    flexDirection: "row",
  },
  weekdag: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "#9A9A9A",
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
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  dagBolGeselecteerd: {
    backgroundColor: "#4A6FD6",
  },
  dagTekst: {
    fontSize: 15,
    color: "#1A1A1A",
  },
  dagBuitenMaand: {
    color: "#CFCFCF",
  },
  dagVandaag: {
    color: "#4A6FD6",
    fontWeight: "700",
  },
  dagTekstGeselecteerd: {
    color: "#FFF",
    fontWeight: "700",
  },
  tijdRij: {
    flexDirection: "row",
    gap: 8,
  },
  tijdChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: "#F1F1F1",
    alignItems: "center",
  },
  tijdChipActief: {
    backgroundColor: "#4A6FD6",
  },
  tijdTekst: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  tijdTekstActief: {
    color: "#FFF",
    fontWeight: "600",
  },
});
