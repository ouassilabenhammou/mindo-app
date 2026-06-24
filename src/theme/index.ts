import { Platform, type TextStyle, type ViewStyle } from "react-native";

/**
 * Mindo design system.
 *
 * Eén centrale bron voor kleuren, spacing, radii, schaduwen en typografie,
 * zodat alle schermen aanvoelen als één samenhangend, rustig en premium geheel.
 */

export const colors = {
  // Oppervlakken — koele, rustige off-white i.p.v. warme beige.
  background: "#F7F8FA",
  surface: "#FFFFFF",
  surfaceSoft: "#EFF1F5",
  surfaceLavender: "#E8E3F7",

  // Merk
  primary: "#2B2D42",
  primarySoft: "#3A3D5C",
  accent: "#5B67C7",
  accentSoft: "#E8EAF7",
  secondary: "#E8E3F7",
  secondarySoft: "#F2EFFA",

  // Tekst
  text: "#2B2D42",
  textMuted: "#6E6F80",
  textSubtle: "#9B9CAB",
  textOnDark: "#FFFFFF",
  textOnLavender: "#4B3F86",

  // Lijnen
  border: "#E6E9EF",
  borderStrong: "#D6DBE3",

  // Status
  danger: "#E5484D",
  dangerSoft: "#FCEBEC",
  success: "#34B27B",
  warning: "#F2B33D",

  white: "#FFFFFF",

  // Donker thema (focusmodus)
  darkBackground: "#1C1D2A",
  darkSurface: "#262739",
  darkBorder: "#3A3B50",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

type Shadow = Pick<
  ViewStyle,
  "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "elevation"
>;

export const shadows: Record<"card" | "raised" | "accent" | "primary", Shadow> = {
  // Subtiele diepte om kaarten los te tillen van de warme achtergrond.
  card: {
    shadowColor: "#2B2D42",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  raised: {
    shadowColor: "#2B2D42",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 5,
  },
  accent: {
    shadowColor: "#5B67C7",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.26,
    shadowRadius: 16,
    elevation: 8,
  },
  primary: {
    shadowColor: "#2B2D42",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 6,
  },
};

export const typography: Record<string, TextStyle> = {
  screenTitle: {
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -0.5,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.textMuted,
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.text,
  },
  bodyStrong: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  caption: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textMuted,
  },
  button: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
};

export const theme = {
  colors,
  spacing,
  radius,
  shadows,
  typography,
} as const;

export default theme;
