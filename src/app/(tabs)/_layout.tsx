import { Tabs, useSegments } from "expo-router";
import { SymbolView } from "expo-symbols";
import { type ColorValue, StyleSheet, View } from "react-native";
import type { SFSymbol } from "sf-symbols-typescript";

import FloatingTabBar from "@/features/navigation/components/FloatingTabBar";
import MindoButton from "@/features/navigation/components/MindoButton";
import { symbool } from "@/lib/symbols";
import { colors } from "@/theme";

function TabIcon({ name, color }: { name: SFSymbol; color: ColorValue }) {
  return (
    <SymbolView
      name={symbool(name)}
      size={26}
      tintColor={color}
      weight="semibold"
      resizeMode="scaleAspectFit"
      fallback={
        <View style={[styles.fallbackDot, { backgroundColor: color }]} />
      }
    />
  );
}

export default function TabLayout() {
  const segments = useSegments();
  const actiefScherm = segments[segments.length - 1];
  const toonMindoKnop = actiefScherm !== "mindo";

  return (
    <View style={styles.root}>
      <Tabs
        initialRouteName="taken"
        tabBar={(props) => <FloatingTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textSubtle,
        }}
      >
        <Tabs.Screen
          name="taken"
          options={{
            title: "Taken",
            tabBarIcon: ({ color }) => (
              <TabIcon name="checklist" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="agenda"
          options={{
            title: "Agenda",
            tabBarIcon: ({ color }) => (
              <TabIcon name="calendar" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="focusmodus"
          options={{
            title: "Focus",
            tabBarIcon: ({ color }) => <TabIcon name="timer" color={color} />,
          }}
        />
        <Tabs.Screen
          name="profiel"
          options={{
            title: "Profiel",
            tabBarIcon: ({ color }) => (
              <TabIcon name="person.crop.circle" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="mindo"
          options={{
            title: "Mindo",
            tabBarIcon: ({ color }) => (
              <TabIcon name="sparkles" color={color} />
            ),
          }}
        />
      </Tabs>

      {toonMindoKnop && <MindoButton />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fallbackDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
});
