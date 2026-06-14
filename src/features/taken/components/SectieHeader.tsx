import { Pressable, StyleSheet, Text } from "react-native";

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
      <Text style={styles.titel}>
        {titel} ({aantal})
      </Text>
      <Text style={styles.chevron}>{isOpen ? "▼" : "▶"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  titel: {
    fontSize: 17,
    fontWeight: "600",
  },
  chevron: {
    fontSize: 12,
    color: "#888",
  },
});
