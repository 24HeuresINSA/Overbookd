export const BACHE = "BACHE";
export const PANNEAU = "PANNEAU";
export const AFFICHE = "AFFICHE";

export type SignageType = typeof BACHE | typeof PANNEAU | typeof AFFICHE;

export const signageTypes: Record<SignageType, SignageType> = {
  BACHE,
  PANNEAU,
  AFFICHE,
};

export type BaseSignage = {
  id: string;
  quantity: number;
  text: string;
  size: string;
  type: SignageType;
  comment: string | null;
};

export type SignageCatalogItem = {
  id: number;
  name: string;
  type: SignageType;
};

type WithCatalogItem = {
  catalogItem: SignageCatalogItem;
};

type SignageAssigned = BaseSignage & WithCatalogItem;

export type Signage = BaseSignage | SignageAssigned;

export function isAssignedToCatalogItem(
  request: Signage,
): request is SignageAssigned {
  return Object.hasOwn(request, "catalogItem");
}

export type Location = {
  id: number;
  name: string;
};

export type Signa = {
  location: Location;
  signages: Signage[];
};

export type DraftSigna = {
  location: Location | null;
  signages: BaseSignage[];
};
