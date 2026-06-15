import { StyleSheet } from "react-native";

export const minutenKiezerStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    position: "absolute",
    width: 48,
    textAlign: "center",
    fontSize: 13,
  },
  centrum: {
    position: "absolute",
    alignItems: "center",
  },
  minutenWaarde: {
    fontSize: 48,
    fontWeight: "200",
    fontVariant: ["tabular-nums"],
    letterSpacing: 2,
  },
  minutenLabel: {
    fontSize: 14,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 3,
    marginTop: -4,
  },
  tijd: {
    fontSize: 48,
    fontWeight: "200",
    fontVariant: ["tabular-nums"],
    letterSpacing: 2,
  },
});
