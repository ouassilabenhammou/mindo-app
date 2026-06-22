import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs initialRouteName="taken">
      <Tabs.Screen name="taken" options={{ title: "Taken" }} />
      <Tabs.Screen name="agenda" options={{ title: "Agenda" }} />
      <Tabs.Screen name="focusmodus" options={{ title: "Focus Modus" }} />
      <Tabs.Screen name="profiel" options={{ title: "Profiel" }} />
      <Tabs.Screen name="mindo" options={{ title: "Mindo" }} />
    </Tabs>
  );
}
