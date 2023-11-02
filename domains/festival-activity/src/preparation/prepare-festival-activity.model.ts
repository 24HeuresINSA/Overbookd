export type PrepareGeneralForm = {
  name?: string;
  description?: string | null;
  categories?: string[];
  toPublish?: boolean;
  photoLink?: string | null;
  isFlagship?: boolean;
};

export type PrepareInChargeForm = {
  adherentId?: number;
  team?: string;
};

export type PrepareSignaForm = {
  location?: string | null;
};

export type PrepareSecurityForm = {
  specialNeed?: string | null;
};

export type PrepareSupplyForm = {
  water?: string | null;
};
