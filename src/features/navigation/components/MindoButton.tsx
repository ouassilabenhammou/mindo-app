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
import { colors } from "@/theme";

const logo = require("../../../../assets/images/mindo-logo-licht.png");

type MindoButtonProps = {
  /** Sterkere schaduw wanneer de tabbar in donkere modus staat (focusmodus). */
  donker?: boolean;
};

/**
 * Zwevende primaire actieknop met het Mindo-logo. Staat naast de zwevende
 * navigatiebalk, op gelijke hoogte, en leidt rechtstreeks naar de Braindump.
 */
export default function MindoButton({ donker = false }: MindoButtonProps) {
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
        <View style={[styles.shadow, donker && styles.shadowDonker]}>
          <View style={styles.vlak}>
            <Image
              source={logo}
              style={styles.logo}
              contentFit="contain"
              transition={120}
            />
          </View>
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
  },
  knopPressed: {
    transform: [{ scale: 0.94 }],
  },
  shadow: {
    width: KNOP,
    height: KNOP,
    borderRadius: KNOP / 2,
    shadowColor: "#1B1D2A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 22,
    elevation: 12,
  },
  shadowDonker: {
    shadowOpacity: 0.4,
  },
  vlak: {
    width: KNOP,
    height: KNOP,
    borderRadius: KNOP / 2,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 48,
    height: 48,
  },
});
