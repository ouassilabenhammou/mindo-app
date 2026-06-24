import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
import { useRef, useState } from "react";
import type { SFSymbol } from "sf-symbols-typescript";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { markeerOnboardingVoltooid } from "@/features/onboarding/storage";
import { colors, radius, shadows, spacing, typography } from "@/theme";

const logo = require("../../assets/images/mindo-logo.png");

type Slide = {
  id: string;
  titel: string;
  tekst: string;
};

const SLIDES: Slide[] = [
  {
    id: "welkom",
    titel: "Welkom bij Mindo",
    tekst:
      "Mindo helpt je om overzicht te creëren en rust in je hoofd te brengen. Eén plek voor alles wat je bezighoudt.",
  },
  {
    id: "taken",
    titel: "Organiseer je taken",
    tekst:
      "Je taken worden verdeeld in Nu, Straks en Later. Zo weet je altijd waar je moet beginnen, zonder de rest uit het oog te verliezen.",
  },
  {
    id: "focus",
    titel: "Focus op wat belangrijk is",
    tekst:
      "Werk geconcentreerd met de focusmodus, houd je week in de gaten via de agenda en laat AI je helpen prioriteren.",
  },
];

function Icoon({ naam, kleur }: { naam: SFSymbol; kleur: string }) {
  return (
    <SymbolView
      name={naam}
      size={26}
      tintColor={kleur}
      weight="semibold"
      resizeMode="scaleAspectFit"
      fallback={
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: kleur,
          }}
        />
      }
    />
  );
}

function WelkomIllustratie() {
  return (
    <View style={styles.logoHalo}>
      <View style={styles.logoCirkel}>
        <Image source={logo} style={styles.logoBeeld} contentFit="contain" />
      </View>
    </View>
  );
}

function TakenIllustratie() {
  const rijen = [
    { label: "Nu", kleur: colors.accent, achtergrond: colors.accentSoft },
    {
      label: "Straks",
      kleur: colors.textOnLavender,
      achtergrond: colors.secondary,
    },
    { label: "Later", kleur: colors.textMuted, achtergrond: colors.surfaceSoft },
  ];

  return (
    <View style={styles.takenKaart}>
      {rijen.map((rij) => (
        <View key={rij.label} style={styles.takenRij}>
          <View style={[styles.takenStip, { backgroundColor: rij.kleur }]} />
          <View style={styles.takenInhoud}>
            <View
              style={[styles.takenBadge, { backgroundColor: rij.achtergrond }]}
            >
              <Text style={[styles.takenBadgeTekst, { color: rij.kleur }]}>
                {rij.label}
              </Text>
            </View>
            <View style={styles.takenLijn} />
          </View>
        </View>
      ))}
    </View>
  );
}

function FocusIllustratie() {
  const items: { naam: SFSymbol; label: string }[] = [
    { naam: "timer", label: "Focus" },
    { naam: "calendar", label: "Agenda" },
    { naam: "sparkles", label: "AI" },
  ];

  return (
    <View style={styles.focusRij}>
      {items.map((item) => (
        <View key={item.label} style={styles.focusChip}>
          <View style={styles.focusIcoon}>
            <Icoon naam={item.naam} kleur={colors.accent} />
          </View>
          <Text style={styles.focusLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

function SlideIllustratie({ id }: { id: string }) {
  if (id === "taken") return <TakenIllustratie />;
  if (id === "focus") return <FocusIllustratie />;
  return <WelkomIllustratie />;
}

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const isLaatste = index === SLIDES.length - 1;

  async function voltooi() {
    await markeerOnboardingVoltooid();
    router.replace("/");
  }

  function volgende() {
    if (isLaatste) {
      voltooi();
      return;
    }
    const volgendeIndex = index + 1;
    scrollRef.current?.scrollTo({ x: volgendeIndex * width, animated: true });
    setIndex(volgendeIndex);
  }

  function onScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const nieuweIndex = Math.round(
      event.nativeEvent.contentOffset.x / width,
    );
    if (nieuweIndex !== index) setIndex(nieuweIndex);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable
          onPress={voltooi}
          hitSlop={10}
          accessibilityRole="button"
          style={({ pressed }) => pressed && styles.overslaanPressed}
        >
          <Text style={styles.overslaanTekst}>
            {isLaatste ? "" : "Overslaan"}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        scrollEventThrottle={16}
      >
        {SLIDES.map((slide) => (
          <View key={slide.id} style={[styles.slide, { width }]}>
            <View style={styles.illustratie}>
              <SlideIllustratie id={slide.id} />
            </View>
            <Text style={styles.titel}>{slide.titel}</Text>
            <Text style={styles.tekst}>{slide.tekst}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.xl }]}>
        <View style={styles.dots}>
          {SLIDES.map((slide, i) => (
            <View
              key={slide.id}
              style={[styles.dot, i === index && styles.dotActief]}
            />
          ))}
        </View>

        <Pressable
          onPress={volgende}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.knop,
            pressed && styles.knopPressed,
          ]}
        >
          <Text style={styles.knopTekst}>
            {isLaatste ? "Aan de slag" : "Volgende"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    paddingHorizontal: spacing.xl,
    alignItems: "flex-end",
    minHeight: 44,
  },
  overslaanTekst: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textMuted,
  },
  overslaanPressed: {
    opacity: 0.5,
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxxl,
  },
  illustratie: {
    height: 240,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xxxl,
  },
  titel: {
    ...typography.screenTitle,
    fontSize: 28,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  tekst: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textMuted,
    textAlign: "center",
  },
  logoHalo: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  logoCirkel: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.card,
  },
  logoBeeld: {
    width: 104,
    height: 104,
  },
  takenKaart: {
    width: 260,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
    ...shadows.card,
  },
  takenRij: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  takenStip: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  takenInhoud: {
    flex: 1,
    gap: spacing.sm,
  },
  takenBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  takenBadgeTekst: {
    fontSize: 13,
    fontWeight: "700",
  },
  takenLijn: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSoft,
    width: "90%",
  },
  focusRij: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  focusChip: {
    width: 84,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    alignItems: "center",
    gap: spacing.sm,
    ...shadows.card,
  },
  focusIcoon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  focusLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },
  footer: {
    paddingHorizontal: spacing.xxxl,
    gap: spacing.xl,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderStrong,
  },
  dotActief: {
    width: 22,
    backgroundColor: colors.accent,
  },
  knop: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 17,
    alignItems: "center",
    ...shadows.primary,
  },
  knopPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  knopTekst: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
