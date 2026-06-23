import { useCallback, useEffect, useState } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { WeeklyCalendar } from "react-native-simple-weekly-calendar";

import dayjs from "dayjs";
import "dayjs/locale/nl";
import isoWeek from "dayjs/plugin/isoWeek";

import { fetchCanvasDeadlines } from "@/features/canvas/services/canvas";
import type { Deadline } from "@/features/canvas/types/canvas";
import { CATEGORY_KLEUREN } from "@/features/taken/constants/taken";
import { haalTakenMetVervaldatum } from "@/features/taken/services/takenService";
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
  return CATEGORY_KLEUREN[category ?? ""] ?? "#9F8FE8";
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
    const channel = supabase
      .channel("agenda-taken-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        laadTaken,
      )
      .subscribe();

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

  return (
    <View>
      <WeeklyCalendar
        dayHeaderComponent={() => null}
        monthComponent={({ weekFirstDate, theme }) => {
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "600",
                  color: theme.monthTextColor,
                }}
              >
                {dagNaamLabel}
              </Text>

              <Text style={{ color: theme.monthTextColor, fontSize: 14 }}>
                {maand.toUpperCase()}
              </Text>
            </View>
          );
        }}
        theme={{ calendarBackgroundColor: "transparent" }}
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

          return (
            <View style={{ width: dayWidth - 8, alignItems: "center" }}>
              <View
                style={{
                  backgroundColor: isSelected ? "lightgrey" : "transparent",
                  width: 65,
                  height: 65,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: isSelected ? "black" : isVandaag ? "blue" : "grey",
                    }}
                  >
                    {dagLabel}
                  </Text>

                  <Text
                    style={{
                      fontSize: 22,
                      color: isSelected ? "black" : isVandaag ? "blue" : "grey",
                    }}
                  >
                    {dayjs(date).format("D")}
                  </Text>

                  {heeftItems && (
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 3,
                      }}
                    >
                      {takenVoorDezeDag.length > 0 && (
                        <View
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: kleurVoorCategory(
                              takenVoorDezeDag[0].category,
                            ),
                          }}
                        />
                      )}
                      {deadlinesVoorDezeDag.length > 0 && (
                        <View
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: "red",
                          }}
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

      <View>
        {takenVoorGeselecteerdeDag.map((taak) => (
          <View
            key={taak.id}
            style={{
              marginBottom: 12,
              padding: 12,
              borderRadius: 12,
              backgroundColor: kleurVoorCategory(taak.category),
            }}
          >
            <Text style={{ fontWeight: "600", fontSize: 16, color: "#FFF" }}>
              {taak.title}
            </Text>
            <Text style={{ marginTop: 4, color: "#FFF" }}>
              {dayjs(taak.due_date).format("HH:mm")}
            </Text>
          </View>
        ))}

        {deadlinesVoorGeselecteerdeDag.length === 0 &&
        takenVoorGeselecteerdeDag.length === 0 ? (
          <Text style={{ color: "grey" }}>
            Geen taken of Canvas-deadlines voor deze dag.
          </Text>
        ) : (
          deadlinesVoorGeselecteerdeDag.map((deadline) => {
            const isVerlopen = deadline.overdue && !deadline.submitted;

            return (
              <View
                key={deadline.id}
                style={{
                  marginBottom: 12,
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: "lightgrey",
                }}
              >
                <Text style={{ fontWeight: "600", fontSize: 16 }}>
                  {deadline.title}
                </Text>

                {deadline.due_at && (
                  <Text style={{ marginTop: 4 }}>
                    {dayjs(deadline.due_at).format("HH:mm")}
                  </Text>
                )}
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}
