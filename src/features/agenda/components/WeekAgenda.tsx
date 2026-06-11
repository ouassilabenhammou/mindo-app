import { Text, View } from "react-native";
import { WeeklyCalendar } from "react-native-simple-weekly-calendar";

export default function WeekAgenda() {
  const vandaag = new Date().toISOString().split("T")[0];

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
          console.log(date);
        }}
        dayComponent={({ date }) => {
          const isVandaag = date === vandaag;
          return (
            <View
              style={{
                backgroundColor: isVandaag ? "lightgrey" : "transparent",
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
