import { Image } from "expo-image";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text } from "react-native";

import { colors, spacing } from "@/theme";

const logo = require("../../../../assets/images/mindo-logo.png");

type AppSplashProps = {
  onFinish: () => void;
};

/**
 * Rustige in-app introductie: het Mindo-logo verschijnt zacht in beeld,
 * blijft even staan en vervaagt dan naar de app.
 */
export default function AppSplash({ onFinish }: AppSplashProps) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.88)).current;
  const woordmerkOpacity = useRef(new Animated.Value(0)).current;
  const schermOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animatie = Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 520,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 7,
          tension: 60,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(woordmerkOpacity, {
        toValue: 1,
        duration: 360,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.delay(820),
      Animated.timing(schermOpacity, {
        toValue: 0,
        duration: 420,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    animatie.start(({ finished }) => {
      if (finished) onFinish();
    });

    return () => animatie.stop();
  }, [logoOpacity, logoScale, woordmerkOpacity, schermOpacity, onFinish]);

  return (
    <Animated.View
      style={[styles.container, { opacity: schermOpacity }]}
      pointerEvents="none"
    >
      <Animated.View
        style={{
          opacity: logoOpacity,
          transform: [{ scale: logoScale }],
        }}
      >
        <Image source={logo} style={styles.logo} contentFit="contain" />
      </Animated.View>

      <Animated.Text style={[styles.woordmerk, { opacity: woordmerkOpacity }]}>
        Mindo
      </Animated.Text>
      <Animated.Text style={[styles.slogan, { opacity: woordmerkOpacity }]}>
        Rust in je hoofd
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 132,
    height: 132,
  },
  woordmerk: {
    marginTop: spacing.xl,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: colors.primary,
  },
  slogan: {
    marginTop: spacing.xs,
    fontSize: 15,
    fontWeight: "500",
    color: colors.textMuted,
  },
});
