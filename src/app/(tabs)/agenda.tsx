import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import WeekAgenda from "@/features/agenda/components/WeekAgenda";
import { colors, spacing } from "@/theme";

export default function Agenda() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingTop: insets.top + spacing.md }]}
    >
      <WeekAgenda />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
