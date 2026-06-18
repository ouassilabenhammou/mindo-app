export type BraindumpTaak = {
  titel: string;
  datum: string | null;
};

export type BraindumpResponse = {
  taken: BraindumpTaak[];
};
