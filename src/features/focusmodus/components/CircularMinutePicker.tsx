import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";
import Svg, { Circle, Line } from "react-native-svg";

const STROKE_WIDTH = 30;
const KNOB_RADIUS = 14;
const MIN_MINUTEN = 0;
const MAX_MINUTEN = 60;

const MARKERS: { label: string; minuten: number }[] = [
  { label: "Start", minuten: MIN_MINUTEN },
  { label: "15", minuten: 15 },
  { label: "30", minuten: 30 },
  { label: "45", minuten: 45 },
  { label: "60", minuten: 60 },
];

type CircularMinutePickerProps = {
  minuten: number;
  onMinutenChange: (minuten: number) => void;
  size?: number;
};

function minutenNaarHoek(minuten: number): number {
  return (minuten / MAX_MINUTEN) * 360 - 90;
}

function hoekNaarMinuten(hoek: number): number {
  const genormaliseerd = (((hoek + 90) % 360) + 360) % 360;
  const ruw = (genormaliseerd / 360) * MAX_MINUTEN;
  return Math.max(MIN_MINUTEN, Math.min(MAX_MINUTEN, Math.round(ruw)));
}

function positieOpCirkel(
  hoekGraden: number,
  straal: number,
  midden: number,
): { x: number; y: number } {
  const hoekRad = (hoekGraden * Math.PI) / 180;
  return {
    x: midden + straal * Math.cos(hoekRad),
    y: midden + straal * Math.sin(hoekRad),
  };
}

export default function CircularMinutePicker({
  minuten,
  onMinutenChange,
  size = 290,
}: CircularMinutePickerProps) {
  const midden = size / 2;
  const straal = (size - STROKE_WIDTH) / 2;
  const omtrek = 2 * Math.PI * straal;
  const voortgang = minuten / MAX_MINUTEN;
  const strokeDashoffset = omtrek * (1 - voortgang);
  const tickBinnen = straal - STROKE_WIDTH / 2 - 2;
  const tickBuiten = straal - STROKE_WIDTH / 2 - 9;
  const tickBuitenGroot = straal - STROKE_WIDTH / 2 - 13;
  const labelStraal = straal - STROKE_WIDTH / 2 - 22;
  const knopPos = positieOpCirkel(minutenNaarHoek(minuten), straal, midden);

  const updateVanafPunt = useCallback(
    (x: number, y: number) => {
      const dx = x - midden;
      const dy = y - midden;
      const hoek = (Math.atan2(dy, dx) * 180) / Math.PI;
      onMinutenChange(hoekNaarMinuten(hoek));
    },
    [midden, onMinutenChange],
  );

  const panGesture = Gesture.Pan()
    .minDistance(0)
    .onUpdate((e) => {
      scheduleOnRN(updateVanafPunt, e.x, e.y);
    });

  const tapGesture = Gesture.Tap().onEnd((e) => {
    scheduleOnRN(updateVanafPunt, e.x, e.y);
  });

  const gesture = Gesture.Simultaneous(panGesture, tapGesture);

  return (
    <GestureDetector gesture={gesture}>
      <View style={[styles.container, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <Circle
            cx={midden}
            cy={midden}
            r={straal}
            stroke="#E8EEF8"
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          {Array.from({ length: MAX_MINUTEN + 1 }, (_, minuut) => {
            const hoek = minutenNaarHoek(minuut);
            const isGroot = minuut % 5 === 0;
            const buitenR = isGroot ? tickBuitenGroot : tickBuiten;
            const binnen = positieOpCirkel(hoek, tickBinnen, midden);
            const buiten = positieOpCirkel(hoek, buitenR, midden);
            const isActief = minuut <= minuten;

            return (
              <Line
                key={minuut}
                x1={binnen.x}
                y1={binnen.y}
                x2={buiten.x}
                y2={buiten.y}
                stroke={isActief ? "#4A6FD6" : "#C5CEE0"}
                strokeWidth={isGroot ? 2 : 1}
                strokeLinecap="round"
              />
            );
          })}
          <Circle
            cx={midden}
            cy={midden}
            r={straal}
            stroke="#4A6FD6"
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={omtrek}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90, ${midden}, ${midden})`}
          />
          <Circle
            cx={knopPos.x}
            cy={knopPos.y}
            r={KNOB_RADIUS}
            fill="#4A6FD6"
            stroke="#FFFFFF"
            strokeWidth={3}
          />
        </Svg>

        {MARKERS.map(({ label, minuten: markerMinuten }) => {
          const hoek =
            markerMinuten === MAX_MINUTEN
              ? minutenNaarHoek(MAX_MINUTEN) - 10
              : minutenNaarHoek(markerMinuten);
          const pos = positieOpCirkel(hoek, labelStraal, midden);
          const isActief = minuten === markerMinuten;

          return (
            <Text
              key={label}
              style={[
                styles.marker,
                {
                  left: pos.x - 24,
                  top: pos.y - 10,
                  color: isActief ? "#4A6FD6" : "#888888",
                  fontWeight: isActief ? "600" : "400",
                },
              ]}
            >
              {label}
            </Text>
          );
        })}

        <View style={styles.centrum} pointerEvents="none">
          <Text style={styles.minutenWaarde}>{minuten}</Text>
          <Text style={styles.minutenLabel}>min</Text>
        </View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
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
    color: "#1A1A1A",
    fontVariant: ["tabular-nums"],
    letterSpacing: 2,
  },
  minutenLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#888888",
    textTransform: "uppercase",
    letterSpacing: 3,
    marginTop: -4,
  },
});
