import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  MINDO_BUTTON_SIZE,
  TAB_BAR_HEIGHT,
  TAB_BAR_SIDE_MARGIN,
  tabBarBottomOffset,
} from "@/features/navigation/constants";
import { colors, shadows } from "@/theme";

const logo = require("../../../../assets/images/mindo-logo-licht.png");

/**
 * Zwevende primaire actieknop met het Mindo-logo. Staat naast de zwevende
 * navigatiebalk, op gelijke hoogte, en leidt rechtstreeks naar de Braindump.
 */
export default function MindoButton() {
  const insets = useSafeAreaInsets();
  // Verticaal uitlijnen met het midden van de balk naast de knop.
  const bottom =
    tabBarBottomOffset(insets.bottom) +
    (TAB_BAR_HEIGHT - MINDO_BUTTON_SIZE) / 2;

  return (
    <View pointerEvents="box-none" style={[styles.host, { bottom }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open Mindo Braindump"
        onPress={() => router.push("/mindo")}
        style={({ pressed }) => [styles.knop, pressed && styles.knopPressed]}
        hitSlop={8}
      >
        <View style={styles.ring}>
          <Image
            source={logo}
            style={styles.logo}
            contentFit="contain"
            transition={120}
          />
        </View>
      </Pressable>
    </View>
  );
}

const KNOP = MINDO_BUTTON_SIZE;

const styles = StyleSheet.create({
  host: {
    position: "absolute",
    right: TAB_BAR_SIDE_MARGIN,
    alignItems: "center",
  },
  knop: {
    width: KNOP,
    height: KNOP,
    borderRadius: KNOP / 2,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.primary,
  },
  knopPressed: {
    transform: [{ scale: 0.94 }],
  },
  ring: {
    width: KNOP,
    height: KNOP,
    borderRadius: KNOP / 2,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 48,
    height: 48,
  },
});
