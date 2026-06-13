import type { Prioriteit, SectieId } from "@/app/types/taken";

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

export const DUUR_OPTIES: number[] = Array.from({ length: 12 }, (_, i) => (i + 1) * 5);
