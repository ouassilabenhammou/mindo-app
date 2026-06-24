import type { AndroidSymbol, SFSymbol, SymbolViewProps } from "expo-symbols";

/**
 * SF Symbols bestaan alleen op Apple-platforms. Op Android en web rendert
 * expo-symbols Material Symbols, maar alleen als je per platform een naam
 * meegeeft. Deze map koppelt de gebruikte SF Symbols aan hun Material-variant.
 */
const MATERIAL_EQUIVALENT: Partial<Record<SFSymbol, AndroidSymbol>> = {
  checklist: "checklist",
  calendar: "calendar_month",
  timer: "timer",
  "person.crop.circle": "account_circle",
  sparkles: "auto_awesome",
  gearshape: "settings",
  "chevron.left": "chevron_left",
  xmark: "close",
};

/**
 * Geeft een cross-platform symboolnaam terug voor `SymbolView`. Op iOS wordt
 * het SF Symbol gebruikt, op Android/web het Material-equivalent.
 */
export function symbool(ios: SFSymbol): SymbolViewProps["name"] {
  const material = MATERIAL_EQUIVALENT[ios];
  if (!material) {
    return ios;
  }
  return { ios, android: material, web: material };
}
