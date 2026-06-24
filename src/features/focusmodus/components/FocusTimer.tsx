import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import type { focusTimerProps } from "@/features/focusmodus/types/focusmodus";
const STROKE_WIDTH = 30;

function formatTijd(seconden: number): string {
  const minuten = Math.floor(seconden / 60);
  const rest = seconden % 60;
  return `${minuten.toString().padStart(2, "0")}:${rest.toString().padStart(2, "0")}`;
}

export default function FocusTimer({
  remainingSeconds,
  progress,
  size = 290,
  donker = false,
}: focusTimerProps) {
  const radius = (size - STROKE_WIDTH) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const achtergrondKleur = donker ? "#262739" : "#E6E9EF";
  const voortgangKleur = "#5B67C7";
  const tekstKleur = donker ? "#FFFFFF" : "#2B2D42";
  const subtekstKleur = donker ? "#6E6F80" : "#9B9CAB";

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Text style={[styles.label, { color: subtekstKleur }]}>focus</Text>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={achtergrondKleur}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />

        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={voortgangKleur}
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>

      <Text style={[styles.tijd, { color: tekstKleur }]}>
        {formatTijd(remainingSeconds)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  tijdContainer: {
    position: "absolute",
    alignItems: "center",
  },
  tijd: {
    fontSize: 48,
    fontWeight: "200",
    fontVariant: ["tabular-nums"],
    letterSpacing: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 3,
  },
});
