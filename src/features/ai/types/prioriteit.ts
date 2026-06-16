import type { SectieId } from "@/features/taken/types/taken";

export type PrioriteerInput = {
  id: string;
  text: string;
  duur: number | null;
};

export type PrioriteerResultaat = {
  id: string;
  sectie: Extract<SectieId, "nu" | "straks" | "later">;
};

export type PrioriteerResponse = {
  taken: PrioriteerResultaat[];
};
