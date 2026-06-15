import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Svg, { Circle, Line } from "react-native-svg";
import { scheduleOnRN } from "react-native-worklets";

import {
  DONKER,
  KNOB_RADIUS,
  LICHT,
  MAX_MINUTEN,
  MIN_MINUTEN,
  STROKE_WIDTH,
} from "@/features/focusmodus/constants/minutenKiezer";
import type { minutenKiezerProps } from "@/features/focusmodus/types/focusmodus";

const MARKERS: { label: string; minuten: number }[] = [
  { label: "60", minuten: MIN_MINUTEN },
  { label: "15", minuten: 15 },
  { label: "30", minuten: 30 },
  { label: "45", minuten: 45 },
];

function formatTijd(seconden: number): string {
  const minuten = Math.floor(seconden / 60);
  const rest = seconden % 60;
  return `${minuten.toString().padStart(2, "0")}:${rest.toString().padStart(2, "0")}`;
}

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

export default function MinutenKiezer({
  minuten,
  onMinutenChange,
  size = 290,
  donker = false,
  resterendeSeconden,
}: minutenKiezerProps) {
  const thema = donker ? DONKER : LICHT;
  const isFocusModus = resterendeSeconden !== undefined;
  const midden = size / 2;
  const straal = (size - STROKE_WIDTH) / 2;
  const omtrek = 2 * Math.PI * straal;
  const voortgang = minuten / MAX_MINUTEN;
  const strokeDashoffset = omtrek * (1 - voortgang);

  const labelStraal = straal - STROKE_WIDTH / 2 - 22;
  const knopPos = positieOpCirkel(minutenNaarHoek(minuten), straal, midden);

  const updateVanafPunt = useCallback(
    (x: number, y: number) => {
      if (!onMinutenChange) return;
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

  const cirkel = (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={midden}
          cy={midden}
          r={straal}
          stroke={thema.ringAchtergrond}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        {Array.from({ length: MAX_MINUTEN + 1 }, (_, minuut) => {
          const hoek = minutenNaarHoek(minuut);
          const isGroot = minuut % 5 === 0;

          const isActief = minuut <= minuten;

          return (
            <Line
              key={minuut}
              stroke={isActief ? thema.tickActief : thema.tickInactief}
              strokeWidth={isGroot ? 2 : 1}
              strokeLinecap="round"
            />
          );
        })}
        <Circle
          cx={midden}
          cy={midden}
          r={straal}
          stroke={thema.ringActief}
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
          fill={thema.ringActief}
          stroke={thema.knopRand}
          strokeWidth={3}
        />
      </Svg>

      {MARKERS.map(({ label, minuten: markerMinuten }) => {
        const hoek =
          markerMinuten === MAX_MINUTEN
            ? minutenNaarHoek(MAX_MINUTEN) - 10
            : minutenNaarHoek(markerMinuten);
        const pos = positieOpCirkel(hoek, labelStraal, midden);
        const isActief = Math.round(minuten) === markerMinuten;

        return (
          <Text
            key={label}
            style={[
              styles.marker,
              {
                left: pos.x - 24,
                top: pos.y - 10,
                color: isActief ? thema.markerActief : thema.markerInactief,
                fontWeight: isActief ? "600" : "400",
              },
            ]}
          >
            {label}
          </Text>
        );
      })}

      <View style={styles.centrum} pointerEvents="none">
        {isFocusModus ? (
          <Text style={[styles.tijd, { color: thema.centrumWaarde }]}>
            {formatTijd(resterendeSeconden)}
          </Text>
        ) : (
          <>
            <Text
              style={[styles.minutenWaarde, { color: thema.centrumWaarde }]}
            >
              {Math.round(minuten)}
            </Text>
            <Text style={[styles.minutenLabel, { color: thema.centrumLabel }]}>
              min
            </Text>
          </>
        )}
      </View>
    </View>
  );

  if (!onMinutenChange) {
    return cirkel;
  }

  return <GestureDetector gesture={gesture}>{cirkel}</GestureDetector>;
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
