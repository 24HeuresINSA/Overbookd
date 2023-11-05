import { Adherent } from "../festival-activity";

export type PrepareGeneralUpdate = {
  name?: string;
  description?: string | null;
  categories?: string[];
  toPublish?: boolean;
  photoLink?: string | null;
  isFlagship?: boolean;
};

export type PrepareInChargeUpdate = {
  adherent?: Adherent;
  team?: string;
};

export type PrepareSignaUpdate = {
  location?: string | null;
};

export type PrepareSecurityUpdate = {
  specialNeed?: string | null;
};

export type PrepareSupplyUpdate = {
  water?: string | null;
};
