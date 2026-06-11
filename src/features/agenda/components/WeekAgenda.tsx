import { useState } from "react";
import { Text, View } from "react-native";
import { WeeklyCalendar } from "react-native-simple-weekly-calendar";

import dayjs from "dayjs";
import "dayjs/locale/nl";

dayjs.locale("nl");

export default function WeekAgenda() {
  const vandaag = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(vandaag);

  return (
    <View>
      <WeeklyCalendar
        // Omzetten van dag naar Nederlands

        dayHeaderComponent={({ dayOfWeek, theme }) => {
          const dag = dayOfWeek.replace(".", "");

          return (
            <Text style={{ color: theme.dayHeaderTextColor }}>
              {dag.charAt(0).toUpperCase() + dag.slice(1)}
            </Text>
          );
        }}
        monthComponent={({ weekFirstDate, theme }) => {
          const maand = new Intl.DateTimeFormat("nl-NL", {
            month: "short",
            year: "numeric",
          }).format(new Date(weekFirstDate));
          return <Text style={{ color: theme.monthTextColor }}>{maand}</Text>;
        }}
        // Style aanpassen van kalender
        theme={{ calendarBackgroundColor: "transparent" }}
        initialDate={vandaag}
        markedDays={[{ date: vandaag }]}
        nextComponent={() => <View style={{ width: 40, height: 40 }} />}
        prevComponent={() => <View style={{ width: 40, height: 40 }} />}
        onDayPress={(date) => {
          setSelectedDate(date);
        }}
        dayComponent={({ date }) => {
          const isSelected = date === selectedDate;
          return (
            <View
              style={{
                backgroundColor: isSelected ? "grey" : "transparent",
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text>{new Date(date).getDate()}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}
