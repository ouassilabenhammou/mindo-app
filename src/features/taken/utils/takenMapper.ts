import type { Prioriteit, SectieId, Taak } from "@/features/taken/types/taken";

export const SECTIE_NAAR_CATEGORY: Record<SectieId, string> = {
  nu: "nu",
  straks: "straks",
  later: "later",
  taak: "braindump",
  voltooid: "voltooid",
};

export const CATEGORY_NAAR_SECTIE: Record<string, SectieId> = {
  nu: "nu",
  straks: "straks",
  later: "later",
  braindump: "taak",
  voltooid: "voltooid",
};

export function rijNaarTaak(
  rij: Record<string, unknown>,
): Taak & { _uuid: string } {
  return {
    id: Math.abs(
      String(rij.id)
        .split("")
        .reduce((a, c) => a + c.charCodeAt(0), 0),
    ),
    _uuid: String(rij.id),
    text: String(rij.title ?? ""),
    prioriteit: (rij.priority === 2
      ? "hoog"
      : rij.priority === 1
        ? "gemiddeld"
        : rij.priority === 0
          ? "laag"
          : null) as Prioriteit | null,
    duur:
      typeof rij.duration_minutes === "number" ? rij.duration_minutes : null,
    sectie: CATEGORY_NAAR_SECTIE[String(rij.category ?? "later")] ?? "later",
    completed: Boolean(rij.is_completed),
    vervaldatum: rij.due_date ? String(rij.due_date) : null,
  };
}
