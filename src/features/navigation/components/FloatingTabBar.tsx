import type { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, radius } from "@/theme";

// iOS 26+ "Liquid Glass". Valt automatisch terug op de blur-variant elders.
const LIQUID_GLASS = isLiquidGlassAvailable();
import {
  MINDO_BUTTON_GAP,
  MINDO_BUTTON_SIZE,
  TAB_BAR_HEIGHT,
  TAB_BAR_SIDE_MARGIN,
  tabBarBottomOffset,
} from "@/features/navigation/constants";

/** Routes die niet in de zwevende balk getoond worden (eigen toegang). */
const VERBORGEN_ROUTES = new Set(["mindo"]);

export default function FloatingTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const focusedRoute = state.routes[state.index];
  const focusedOptions = descriptors[focusedRoute.key]?.options;

  // De braindump (mindo) is een vol scherm met eigen invoer onderaan.
  if (VERBORGEN_ROUTES.has(focusedRoute.name)) {
    return null;
  }

  // Focusmodus zet tijdens een actieve sessie een donkere tabBarStyle. Dan
  // toont de balk zich in donkere glas-variant zodat hij in het scherm opgaat.
  const focusStyle = focusedOptions?.tabBarStyle as
    | { backgroundColor?: string }
    | undefined;
  const donker = focusStyle?.backgroundColor === colors.darkBackground;

  const zichtbareRoutes = state.routes.filter(
    (route) => !VERBORGEN_ROUTES.has(route.name),
  );

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.host,
        { bottom: tabBarBottomOffset(insets.bottom) },
      ]}
    >
      <View style={[styles.shadow, donker ? styles.shadowDonker : null]}>
        <View style={styles.clip}>
          {LIQUID_GLASS ? (
            <GlassView
              style={StyleSheet.absoluteFill}
              glassEffectStyle="regular"
              colorScheme={donker ? "dark" : "light"}
              isInteractive
            />
          ) : (
            <>
              <BlurView
                intensity={Platform.OS === "android" ? 40 : 60}
                tint={donker ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
              />
              <View
                style={[
                  StyleSheet.absoluteFill,
                  styles.tint,
                  donker ? styles.tintDonker : styles.tintLicht,
                ]}
              />
              <View
                style={[
                  styles.border,
                  donker ? styles.borderDonker : styles.borderLicht,
                ]}
              />
            </>
          )}

          <View style={styles.row}>
            {zichtbareRoutes.map((route) => {
              const { options } = descriptors[route.key];
              const stateIndex = state.routes.findIndex(
                (r) => r.key === route.key,
              );
              const isActief = state.index === stateIndex;

              const label =
                typeof options.title === "string"
                  ? options.title
                  : route.name;

              const kleur = isActief
                ? colors.accent
                : donker
                  ? colors.textSubtle
                  : colors.textMuted;

              function onPress() {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isActief && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }

              function onLongPress() {
                navigation.emit({
                  type: "tabLongPress",
                  target: route.key,
                });
              }

              return (
                <Pressable
                  key={route.key}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  accessibilityRole="button"
                  accessibilityState={isActief ? { selected: true } : {}}
                  accessibilityLabel={label}
                  style={styles.item}
                  hitSlop={6}
                >
                  <View style={styles.icoon}>
                    {options.tabBarIcon?.({
                      focused: isActief,
                      color: kleur,
                      size: 24,
                    })}
                  </View>
                  <Text
                    style={[styles.label, { color: kleur }]}
                    numberOfLines={1}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: "absolute",
    left: TAB_BAR_SIDE_MARGIN,
    // Rechts ruimte vrijhouden voor de zwevende Mindo-knop ernaast.
    right: TAB_BAR_SIDE_MARGIN + MINDO_BUTTON_SIZE + MINDO_BUTTON_GAP,
  },
  shadow: {
    borderRadius: radius.pill,
    shadowColor: "#1B1D2A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 22,
    elevation: 12,
  },
  shadowDonker: {
    shadowOpacity: 0.4,
  },
  clip: {
    height: TAB_BAR_HEIGHT,
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  tint: {
    borderRadius: radius.pill,
  },
  tintLicht: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  tintDonker: {
    backgroundColor: "rgba(28, 29, 42, 0.55)",
  },
  border: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  borderLicht: {
    borderColor: "rgba(255, 255, 255, 0.7)",
  },
  borderDonker: {
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 8,
  },
  icoon: {
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
});
