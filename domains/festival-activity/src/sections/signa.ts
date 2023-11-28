export const BACHE = "BACHE";
export const PANNEAU = "PANNEAU";
export const AFFICHE = "AFFICHE";

export type SignageType = typeof BACHE | typeof PANNEAU | typeof AFFICHE;

export type Signage = {
  id: string;
  quantity: number;
  text: string;
  size: string;
  type: SignageType;
  comment: string | null;
};

export type Signa = {
  location: string;
  signages: Signage[];
};

export type DraftSigna = Omit<Signa, "location"> & {
  location: string | null;
};
