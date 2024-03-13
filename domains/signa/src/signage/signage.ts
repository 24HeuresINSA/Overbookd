export const BACHE = "BACHE";
export const PANNEAU = "PANNEAU";
export const AFFICHE = "AFFICHE";

export const signageTypes: Record<SignageType, SignageType> = {
  BACHE,
  PANNEAU,
  AFFICHE,
};

export type SignageType = typeof BACHE | typeof PANNEAU | typeof AFFICHE;

export type Signage = {
  id: number;
  name: string;
  slug: string;
  type: SignageType;
  image?: string;
};
