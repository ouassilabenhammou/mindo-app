import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@/theme";

type SectieHeaderProps = {
  titel: string;
  aantal: number;
  isOpen: boolean;
  onPress: () => void;
};

export default function SectieHeader({
  titel,
  aantal,
  isOpen,
  onPress,
}: SectieHeaderProps) {
  return (
    <Pressable style={styles.header} onPress={onPress}>
      <View style={styles.linkerkant}>
        <Text style={styles.titel}>{titel}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeTekst}>{aantal}</Text>
        </View>
      </View>
      <Text style={styles.chevron}>{isOpen ? "⌄" : "›"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  linkerkant: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  titel: {
    ...typography.sectionTitle,
  },
  badge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeTekst: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textOnLavender,
  },
  chevron: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textSubtle,
  },
});
