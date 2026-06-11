import { useState } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { WeeklyCalendar } from "react-native-simple-weekly-calendar";

import dayjs from "dayjs";
import "dayjs/locale/nl";

dayjs.locale("nl");

export default function WeekAgenda() {
  const vandaag = new Date().toISOString().split("T")[0];
  const [selectedWeekday, setSelectedWeekday] = useState(dayjs(vandaag).day());

  const { width } = useWindowDimensions();
  const dayWidth = (width - 40) / 7;

  return (
    <View>
      <WeeklyCalendar
        dayHeaderComponent={() => null}
        monthComponent={({ weekFirstDate, theme }) => {
          const selectedDateInCurrentWeek = dayjs(weekFirstDate)
            .day(selectedWeekday)
            .format("YYYY-MM-DD");
          const dagNaam = dayjs(selectedDateInCurrentWeek).format("dddd");
          const dagNaamLabel =
            dagNaam.charAt(0).toUpperCase() + dagNaam.slice(1);
          const maand = new Intl.DateTimeFormat("nl-NL", {
            month: "short",
            year: "numeric",
          }).format(new Date(weekFirstDate));

          const maandLabel = maand.toUpperCase();

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
              <Text
                style={{
                  color: theme.monthTextColor,
                  fontSize: 14,
                }}
              >
                {maandLabel}
              </Text>
            </View>
          );
        }}
        // Style aanpassen van kalender
        theme={{ calendarBackgroundColor: "transparent" }}
        initialDate={vandaag}
        markedDays={[{ date: vandaag }]}
        nextComponent={() => <View />}
        prevComponent={() => <View />}
        onDayPress={(date) => {
          setSelectedWeekday(dayjs(date).day());
        }}
        // Dag component
        dayComponent={({ date }) => {
          const isSelected = dayjs(date).day() === selectedWeekday;
          const dag = dayjs(date).format("ddd").replace(".", "");
          const dagLabel = dag.charAt(0).toUpperCase() + dag.slice(1);

          return (
            <View
              style={{
                width: dayWidth - 8,
                alignItems: "center",
              }}
            >
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
                  <Text style={{ fontSize: 14 }}>{dagLabel}</Text>
                  <Text style={{ fontSize: 22 }}>
                    {dayjs(date).format("D")}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
