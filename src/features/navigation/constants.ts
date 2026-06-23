import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Hoogte van de zwevende navigatiebalk zelf. */
export const TAB_BAR_HEIGHT = 66;

/** Horizontale marge tussen de balk en de schermranden. */
export const TAB_BAR_SIDE_MARGIN = 18;

/** Minimale ruimte tussen de balk en de onderkant van het scherm. */
export const TAB_BAR_BOTTOM_GAP = 14;

/** Diameter van de zwevende Mindo-knop naast de balk. */
export const MINDO_BUTTON_SIZE = 64;

/** Ruimte tussen de balk en de Mindo-knop ernaast. */
export const MINDO_BUTTON_GAP = 12;

/** Afstand van de schermbodem tot de onderkant van de zwevende balk. */
export function tabBarBottomOffset(insetBottom: number) {
  return Math.max(insetBottom, TAB_BAR_BOTTOM_GAP);
}

/**
 * Totale ruimte die de zwevende balk onderaan inneemt. Schermen gebruiken dit
 * als onderste padding zodat content nooit achter de navigatie verdwijnt.
 */
export function useTabBarSpace() {
  const insets = useSafeAreaInsets();
  return tabBarBottomOffset(insets.bottom) + TAB_BAR_HEIGHT + 18;
}
