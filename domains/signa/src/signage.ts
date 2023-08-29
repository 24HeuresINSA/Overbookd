const BACHE = "BACHE";
const PANNEAU = "PANNEAU";
const AFFICHE = "AFFICHE";

export const signageTypes: Record<SignageType, SignageType> = {
  BACHE,
  PANNEAU,
  AFFICHE,
};

export type SignageType = typeof BACHE | typeof PANNEAU | typeof AFFICHE;

export interface Signage {
  id: number;
  name: string;
  type: SignageType;
  image?: string;
}
