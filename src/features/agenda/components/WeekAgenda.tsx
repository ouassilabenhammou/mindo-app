import { useEffect, useState } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { WeeklyCalendar } from "react-native-simple-weekly-calendar";

import dayjs from "dayjs";
import "dayjs/locale/nl";

import { fetchCanvasDeadlines } from "@/app/services/Canvas";
import type { Deadline } from "@/app/types/canvas";

dayjs.locale("nl");

function hoortDeadlineBijDatum(deadline: Deadline, date: string) {
  if (!deadline.due_at) return false;

  const geselecteerdeDag = dayjs(date);
  const deadlineDag = dayjs(deadline.due_at);

  const isVandaag = geselecteerdeDag.isSame(dayjs(), "day");
  const opDezeDag = deadlineDag.isSame(geselecteerdeDag, "day");
  const isVerlopenEnNietIngeleverd = deadline.overdue && !deadline.submitted;

  if (isVandaag && isVerlopenEnNietIngeleverd) {
    return true;
  }

  return opDezeDag;
}

export default function WeekAgenda() {
  const vandaag = new Date().toISOString().split("T")[0];

  const [selectedWeekday, setSelectedWeekday] = useState(dayjs(vandaag).day());
  const [visibleWeekFirstDate, setVisibleWeekFirstDate] = useState(vandaag);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);

  const { width } = useWindowDimensions();
  const dayWidth = (width - 40) / 7;

  const activeDate = dayjs(visibleWeekFirstDate)
    .day(selectedWeekday)
    .format("YYYY-MM-DD");

  useEffect(() => {
    fetchCanvasDeadlines()
      .then((response) => {
        setDeadlines(response.deadlines);
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  }, []);

  const deadlinesVoorGeselecteerdeDag = deadlines.filter((deadline) =>
    hoortDeadlineBijDatum(deadline, activeDate),
  );

  return (
    <View>
      <WeeklyCalendar
        dayHeaderComponent={() => null}
        monthComponent={({ weekFirstDate, theme }) => {
          const selectedDateInCurrentWeek = dayjs(weekFirstDate)
            .day(selectedWeekday)
            .format("YYYY-MM-DD");

          if (visibleWeekFirstDate !== weekFirstDate) {
            setTimeout(() => {
              setVisibleWeekFirstDate(weekFirstDate);
            }, 0);
          }

          const dagNaam = dayjs(selectedDateInCurrentWeek).format("dddd");
          const dagNaamLabel =
            dagNaam.charAt(0).toUpperCase() + dagNaam.slice(1);

          const maand = new Intl.DateTimeFormat("nl-NL", {
            month: "short",
            year: "numeric",
          }).format(new Date(weekFirstDate));

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
          setSelectedWeekday(dayjs(date).day());
          setVisibleWeekFirstDate(
            dayjs(date).startOf("week").add(1, "day").format("YYYY-MM-DD"),
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
              </View>
            </View>
          );
        }}
      />

      <View style={{ marginTop: 16 }}>
        {deadlinesVoorGeselecteerdeDag.length === 0 ? (
          <Text style={{ color: "grey" }}>
            Geen Canvas-deadlines voor deze dag.
          </Text>
        ) : (
          deadlinesVoorGeselecteerdeDag.map((deadline) => {
            const isVerlopenEnNietIngeleverd =
              deadline.overdue && !deadline.submitted;

            return (
              <View
                key={deadline.id}
                style={{
                  marginBottom: 12,
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: "#F2F2F2",
                  borderWidth: isVerlopenEnNietIngeleverd ? 1 : 0,
                  borderColor: isVerlopenEnNietIngeleverd
                    ? "red"
                    : "transparent",
                }}
              >
                {isVerlopenEnNietIngeleverd && (
                  <Text
                    style={{
                      color: "red",
                      fontSize: 12,
                      fontWeight: "600",
                      marginBottom: 4,
                    }}
                  >
                    Verlopen
                  </Text>
                )}

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
