import {
  PRIORITEIT_NAAR_SECTIE,
  SECTIE_VOLGORDE,
} from "@/features/taken/constants/taken";
import type { Prioriteit, SectieId, Taak } from "@/features/taken/types/taken";

export function bepaalSectie(prioriteit: Prioriteit | null): SectieId {
  if (!prioriteit) return "taak";
  return PRIORITEIT_NAAR_SECTIE[prioriteit];
}

export function groepeerPerSectie(taken: Taak[]): Record<SectieId, Taak[]> {
  const gegroepeerd = Object.fromEntries(
    SECTIE_VOLGORDE.map((sectie) => [sectie, [] as Taak[]]),
  ) as Record<SectieId, Taak[]>;

  for (const taak of taken) {
    gegroepeerd[taak.sectie].push(taak);
  }

  return gegroepeerd;
}

export function telPerSectie(taken: Taak[]): Record<SectieId, number> {
  const aantallen = Object.fromEntries(
    SECTIE_VOLGORDE.map((sectie) => [sectie, 0]),
  ) as Record<SectieId, number>;

  for (const taak of taken) {
    aantallen[taak.sectie]++;
  }

  return aantallen;
}
