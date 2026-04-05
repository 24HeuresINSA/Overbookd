export const STATIQUE = "STATIQUE";
export const BAR = "BAR";
export const MANUTENTION = "MANUTENTION";
export const FUN = "FUN";
export const RELOU = "RELOU";
export const COLLAGE = "COLLAGE";

export type Category =
  | typeof STATIQUE
  | typeof BAR
  | typeof MANUTENTION
  | typeof FUN
  | typeof RELOU
  | typeof COLLAGE;

export const taskCategories = [
  STATIQUE,
  BAR,
  MANUTENTION,
  FUN,
  RELOU,
  COLLAGE,
] as const;
