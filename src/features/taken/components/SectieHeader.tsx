import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@/theme";

type SectieHeaderProps = {
  titel: string;
  aantal: number;
  isOpen: boolean;
  onPress: () => void;
  kleurSterk: string;
  kleurZacht: string;
};

export default function SectieHeader({
  titel,
  aantal,
  isOpen,
  onPress,
  kleurSterk,
  kleurZacht,
}: SectieHeaderProps) {
  return (
    <Pressable style={styles.header} onPress={onPress}>
      <View style={styles.linkerkant}>
        <View style={[styles.label, { backgroundColor: kleurZacht }]}>
          <View style={[styles.stip, { backgroundColor: kleurSterk }]} />
          <Text style={[styles.titel, { color: kleurSterk }]}>{titel}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: kleurSterk }]}>
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
  label: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  stip: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  titel: {
    ...typography.sectionTitle,
    fontSize: 15,
  },
  badge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 7,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeTekst: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.white,
  },
  chevron: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textSubtle,
  },
});
