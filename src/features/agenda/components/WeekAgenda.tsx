import { useState } from "react";
import { Text, View } from "react-native";
import { WeeklyCalendar } from "react-native-simple-weekly-calendar";

export default function WeekAgenda() {
  const vandaag = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(vandaag);
  return (
    <View>
      <Text>Week Agenda</Text>
      <WeeklyCalendar
        // Style aanpassen van kalender
        theme={{ calendarBackgroundColor: "none" }}
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
