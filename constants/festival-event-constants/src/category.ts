export const STATIQUE = "STATIQUE";
export const BAR = "BAR";
export const MANUTENTION = "MANUTENTION";
export const FUN = "FUN";
export const RELOU = "RELOU";

export type Category =
  | typeof STATIQUE
  | typeof BAR
  | typeof MANUTENTION
  | typeof FUN
  | typeof RELOU;

export const categories: Category[] = [STATIQUE, BAR, MANUTENTION, FUN, RELOU];
