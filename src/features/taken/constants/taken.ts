import type { Prioriteit, SectieId } from "@/features/taken/types/taken";

export const SECTIE_VOLGORDE: SectieId[] = [
  "nu",
  "straks",
  "later",
  "taak",
  "voltooid",
];

export const SECTIE_LABELS: Record<SectieId, string> = {
  nu: "Nu",
  straks: "Straks",
  later: "Later",
  taak: "Taak",
  voltooid: "Voltooid",
};

/**
 * Per sectie een herkenbare kleur (sterk = accentlijn/badge, zacht = achtergrond),
 * zodat Nu / Straks / Later / Voltooid in één oogopslag te onderscheiden zijn.
 */
export const SECTIE_KLEUREN: Record<
  SectieId,
  { sterk: string; zacht: string }
> = {
  nu: { sterk: "#E5484D", zacht: "#FCEBEC" },
  straks: { sterk: "#E8920C", zacht: "#FCF1DD" },
  later: { sterk: "#7A68D6", zacht: "#ECE7FB" },
  taak: { sterk: "#6E6F80", zacht: "#F1F0F4" },
  voltooid: { sterk: "#2C9E6E", zacht: "#E3F5EC" },
};

export const STANDAARD_OPEN_SECTIES: Record<SectieId, boolean> = {
  nu: true,
  straks: false,
  later: false,
  taak: false,
  voltooid: false,
};

export const PRIORITEIT_NAAR_SECTIE: Record<Prioriteit, SectieId> = {
  hoog: "nu",
  gemiddeld: "straks",
  laag: "later",
};

export const PRIORITEIT_LABELS: Record<Prioriteit, string> = {
  hoog: "Hoog",
  gemiddeld: "Gemiddeld",
  laag: "Laag",
};

export const PRIORITEITEN: Prioriteit[] = ["hoog", "gemiddeld", "laag"];

export const CATEGORY_KLEUREN: Record<string, string> = {
  nu: SECTIE_KLEUREN.nu.sterk,
  straks: SECTIE_KLEUREN.straks.sterk,
  later: SECTIE_KLEUREN.later.sterk,
};

const STANDAARD_DUUR = 5;

export const DUUR_OPTIES = [
  { value: STANDAARD_DUUR, label: `${STANDAARD_DUUR} min` },
  { value: 10, label: "10 min" },
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "1 uur" },
  { value: 90, label: "1,5 uur" },
  { value: 120, label: "2 uur" },
];
