export type SectieId = "nu" | "straks" | "later" | "taak" | "voltooid";

export type Prioriteit = "hoog" | "gemiddeld" | "laag";

export type Taak = {
  id: number;
  _uuid: string; // ← nieuw: Supabase UUID
  text: string;
  prioriteit: Prioriteit | null;
  duur: number | null;
  sectie: SectieId;
  completed: boolean;
  vervaldatum: string | null; // ISO-datum waarop de taak in de agenda verschijnt
};

export type SectieOpenState = Record<SectieId, boolean>;
