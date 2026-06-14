export type SectieId = "nu" | "straks" | "later" | "taak" | "voltooid";

export type Prioriteit = "hoog" | "gemiddeld" | "laag";

export type Taak = {
  id: number;
  text: string;
  prioriteit: Prioriteit | null;
  duur: number | null;
  sectie: SectieId;
  completed: boolean;
};

export type SectieOpenState = Record<SectieId, boolean>;
