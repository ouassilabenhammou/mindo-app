import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { WeeklyCalendar } from "react-native-simple-weekly-calendar";

import { colors, radius, shadows, spacing, typography } from "@/theme";

import dayjs from "dayjs";
import "dayjs/locale/nl";
import isoWeek from "dayjs/plugin/isoWeek";

import MaandOverzicht from "@/features/agenda/components/MaandOverzicht";
import { fetchCanvasDeadlines } from "@/features/canvas/services/canvas";
import type { Deadline } from "@/features/canvas/types/canvas";
import { CATEGORY_KLEUREN } from "@/features/taken/constants/taken";
import { haalTakenMetVervaldatum } from "@/features/taken/services/takenService";
import { subscribeToTable } from "@/lib/realtime";
import { supabase } from "@/lib/supabase";

dayjs.locale("nl");
dayjs.extend(isoWeek);

type TaakMetVervaldatum = {
  id: string;
  title: string;
  due_date: string;
  category: string;
  is_completed: boolean;
};

function kleurVoorCategory(category: string | null | undefined) {
  return CATEGORY_KLEUREN[category ?? ""] ?? "#7A68D6";
}

function hoortTaakBijDatum(taak: TaakMetVervaldatum, date: string) {
  return dayjs(taak.due_date).isSame(dayjs(date), "day");
}

function hoortDeadlineBijDatum(deadline: Deadline, date: string) {
  if (!deadline.due_at) return false;

  const geselecteerdeDag = dayjs(date);
  const deadlineDag = dayjs(deadline.due_at);

  const isVandaag = geselecteerdeDag.isSame(dayjs(), "day");
  const opDezeDag = deadlineDag.isSame(geselecteerdeDag, "day");
  const isVerlopen = deadline.overdue && !deadline.submitted;

  if (isVandaag && isVerlopen) {
    return true;
  }

  return opDezeDag;
}

export default function WeekAgenda() {
  const vandaag = dayjs().format("YYYY-MM-DD");

  const [selectedWeekday, setSelectedWeekday] = useState(
    dayjs(vandaag).isoWeekday(),
  );

  const [visibleWeekFirstDate, setVisibleWeekFirstDate] = useState(
    dayjs(vandaag).startOf("isoWeek").format("YYYY-MM-DD"),
  );

  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [taken, setTaken] = useState<TaakMetVervaldatum[]>([]);
  const [maandOverzichtOpen, setMaandOverzichtOpen] = useState(false);

  const { width } = useWindowDimensions();
  const dayWidth = (width - 40) / 7;

  const activeDate = dayjs(visibleWeekFirstDate)
    .isoWeekday(selectedWeekday)
    .format("YYYY-MM-DD");

  const laadTaken = useCallback(() => {
    haalTakenMetVervaldatum()
      .then(({ data, error }) => {
        if (error) {
          console.log(error.message);
          return;
        }

        setTaken((data ?? []) as TaakMetVervaldatum[]);
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  }, []);

  useEffect(() => {
    fetchCanvasDeadlines()
      .then((response) => {
        setDeadlines(response.deadlines);
      })
      .catch((error: Error) => {
        console.log(error.message);
      });

    laadTaken();

    // Houd de agenda automatisch up-to-date wanneer taken (met datum)
    // worden toegevoegd, bewerkt, voltooid of verwijderd.
    const channel = subscribeToTable("tasks", laadTaken);

    return () => {
      supabase.removeChannel(channel);
    };
  }, [laadTaken]);

  const deadlinesVoorGeselecteerdeDag = deadlines.filter((deadline) =>
    hoortDeadlineBijDatum(deadline, activeDate),
  );

  const takenVoorGeselecteerdeDag = taken.filter((taak) =>
    hoortTaakBijDatum(taak, activeDate),
  );

  const heeftItemsOpDatum = useCallback(
    (date: string) =>
      taken.some((taak) => hoortTaakBijDatum(taak, date)) ||
      deadlines.some((deadline) => hoortDeadlineBijDatum(deadline, date)),
    [taken, deadlines],
  );

  function selecteerDatum(date: string) {
    setSelectedWeekday(dayjs(date).isoWeekday());
    setVisibleWeekFirstDate(dayjs(date).startOf("isoWeek").format("YYYY-MM-DD"));
  }

  return (
    <View>
      <WeeklyCalendar
        dayHeaderComponent={() => null}
        monthComponent={({ weekFirstDate }) => {
          const zichtbareWeekStart = dayjs(weekFirstDate)
            .startOf("isoWeek")
            .format("YYYY-MM-DD");

          const selectedDateInCurrentWeek = dayjs(zichtbareWeekStart)
            .isoWeekday(selectedWeekday)
            .format("YYYY-MM-DD");

          if (visibleWeekFirstDate !== zichtbareWeekStart) {
            setTimeout(() => {
              setVisibleWeekFirstDate(zichtbareWeekStart);
            }, 0);
          }

          const dagNaam = dayjs(selectedDateInCurrentWeek).format("dddd");
          const dagNaamLabel =
            dagNaam.charAt(0).toUpperCase() + dagNaam.slice(1);

          const maand = new Intl.DateTimeFormat("nl-NL", {
            month: "short",
            year: "numeric",
          }).format(new Date(selectedDateInCurrentWeek));

          return (
            <View style={styles.maandHeader}>
              <Text style={styles.dagNaam}>{dagNaamLabel}</Text>

              <Pressable
                style={styles.maandKnop}
                onPress={() => setMaandOverzichtOpen(true)}
                accessibilityRole="button"
                accessibilityLabel="Maandoverzicht openen"
                hitSlop={8}
              >
                <Text style={styles.maandLabel}>{maand.toUpperCase()}</Text>
                <Text style={styles.maandKnopIcoon}>▾</Text>
              </Pressable>
            </View>
          );
        }}
        theme={{
          calendarBackgroundColor: "transparent",
          monthTextColor: colors.text,
        }}
        initialDate={vandaag}
        markedDays={[{ date: vandaag }]}
        nextComponent={() => <View />}
        prevComponent={() => <View />}
        onDayPress={(date) => {
          setSelectedWeekday(dayjs(date).isoWeekday());
          setVisibleWeekFirstDate(
            dayjs(date).startOf("isoWeek").format("YYYY-MM-DD"),
          );
        }}
        dayComponent={({ date }) => {
          const isSelected = dayjs(date).isSame(dayjs(activeDate), "day");

          const dag = dayjs(date).format("ddd").replace(".", "");
          const dagLabel = dag.charAt(0).toUpperCase() + dag.slice(1);

          const isVandaag = dayjs(date).isSame(dayjs(), "day");

          const deadlinesVoorDezeDag = deadlines.filter((deadline) =>
            hoortDeadlineBijDatum(deadline, date),
          );

          const takenVoorDezeDag = taken.filter((taak) =>
            hoortTaakBijDatum(taak, date),
          );

          const heeftItems =
            deadlinesVoorDezeDag.length > 0 || takenVoorDezeDag.length > 0;

          const tekstKleur = isSelected
            ? colors.white
            : isVandaag
              ? colors.accent
              : colors.textMuted;

          return (
            <View style={{ width: dayWidth - 8, alignItems: "center" }}>
              <View
                style={[
                  styles.dagBol,
                  isSelected && styles.dagBolGeselecteerd,
                  isVandaag && !isSelected && styles.dagBolVandaag,
                ]}
              >
                <View style={styles.dagInhoud}>
                  <Text style={[styles.dagNaamKlein, { color: tekstKleur }]}>
                    {dagLabel}
                  </Text>

                  <Text style={[styles.dagNummer, { color: tekstKleur }]}>
                    {dayjs(date).format("D")}
                  </Text>

                  {heeftItems && (
                    <View style={styles.stippen}>
                      {takenVoorDezeDag.length > 0 && (
                        <View
                          style={[
                            styles.stip,
                            {
                              backgroundColor: isSelected
                                ? colors.white
                                : kleurVoorCategory(
                                    takenVoorDezeDag[0].category,
                                  ),
                            },
                          ]}
                        />
                      )}
                      {deadlinesVoorDezeDag.length > 0 && (
                        <View
                          style={[
                            styles.stip,
                            {
                              backgroundColor: isSelected
                                ? colors.white
                                : colors.danger,
                            },
                          ]}
                        />
                      )}
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        }}
      />

      <View style={styles.lijst}>
        {takenVoorGeselecteerdeDag.map((taak) => (
          <View
            key={taak.id}
            style={[
              styles.taakKaart,
              { borderLeftColor: kleurVoorCategory(taak.category) },
            ]}
          >
            <View
              style={[
                styles.kaartStip,
                { backgroundColor: kleurVoorCategory(taak.category) },
              ]}
            />
            <View style={styles.kaartInhoud}>
              <Text style={styles.kaartTitel}>{taak.title}</Text>
              <Text style={styles.kaartTijd}>
                {dayjs(taak.due_date).format("HH:mm")}
              </Text>
            </View>
          </View>
        ))}

        {deadlinesVoorGeselecteerdeDag.length === 0 &&
        takenVoorGeselecteerdeDag.length === 0 ? (
          <View style={styles.leegKaart}>
            <Text style={styles.leegTekst}>
              Geen taken of Canvas-deadlines voor deze dag.
            </Text>
          </View>
        ) : (
          deadlinesVoorGeselecteerdeDag.map((deadline) => (
            <View
              key={deadline.id}
              style={[
                styles.taakKaart,
                { borderLeftColor: colors.danger },
              ]}
            >
              <View
                style={[
                  styles.kaartStip,
                  { backgroundColor: colors.danger },
                ]}
              />
              <View style={styles.kaartInhoud}>
                <Text style={styles.kaartTitel}>{deadline.title}</Text>

                {deadline.due_at && (
                  <Text style={styles.kaartTijd}>
                    {dayjs(deadline.due_at).format("HH:mm")}
                  </Text>
                )}
              </View>
            </View>
          ))
        )}
      </View>

      <MaandOverzicht
        zichtbaar={maandOverzichtOpen}
        geselecteerdeDatum={activeDate}
        onSluit={() => setMaandOverzichtOpen(false)}
        onSelecteerDatum={selecteerDatum}
        heeftItemsOpDatum={heeftItemsOpDatum}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  maandHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
  },
  dagNaam: {
    ...typography.screenTitle,
    fontSize: 26,
  },
  maandKnop: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
  },
  maandLabel: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
  },
  maandKnopIcoon: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: "700",
  },
  dagBol: {
    width: 56,
    height: 72,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  dagBolGeselecteerd: {
    backgroundColor: colors.primary,
  },
  dagBolVandaag: {
    backgroundColor: colors.accentSoft,
  },
  dagInhoud: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  dagNaamKlein: {
    fontSize: 13,
    fontWeight: "600",
  },
  dagNummer: {
    fontSize: 20,
    fontWeight: "700",
  },
  stippen: {
    flexDirection: "row",
    gap: 3,
  },
  stip: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
  },
  lijst: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  taakKaart: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderLeftWidth: 4,
    ...shadows.card,
  },
  kaartStip: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
  },
  kaartInhoud: {
    flex: 1,
  },
  kaartTitel: {
    ...typography.bodyStrong,
  },
  kaartTijd: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "500",
    color: colors.textMuted,
  },
  leegKaart: {
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSoft,
    alignItems: "center",
  },
  leegTekst: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: "center",
  },
});
