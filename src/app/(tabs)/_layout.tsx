import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { SFSymbol } from "sf-symbols-typescript";
import { type ColorValue, Platform, StyleSheet, View } from "react-native";

import { colors, radius, shadows } from "@/theme";

function TabIcon({ name, color }: { name: SFSymbol; color: ColorValue }) {
  return (
    <SymbolView
      name={name}
      size={26}
      tintColor={color}
      weight="semibold"
      resizeMode="scaleAspectFit"
      fallback={
        <View
          style={[styles.fallbackDot, { backgroundColor: color }]}
        />
      }
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="taken"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item,
        tabBarStyle: styles.bar,
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
          tabBarIcon: ({ color }) => (
            <TabIcon name="timer" color={color} />
          ),
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
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    height: Platform.OS === "ios" ? 88 : 70,
    paddingTop: 10,
    ...shadows.card,
    shadowOffset: { width: 0, height: -6 },
  },
  item: {
    paddingTop: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.1,
    marginTop: 2,
  },
  fallbackDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
});
