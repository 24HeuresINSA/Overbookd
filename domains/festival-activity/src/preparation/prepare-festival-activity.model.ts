export type PrepareGeneralSectionForm = {
  name?: string;
  description?: string | null;
  categories?: string[];
  toPublish?: boolean;
  photoLink?: string | null;
  isFlagship?: boolean;
};

export type PrepareInChargeSectionForm = {
  adherentId?: number;
  team?: string | null;
};

export type PrepareSignaSectionForm = {
  location?: string | null;
};

export type PrepareSecuritySectionForm = {
  specialNeed?: string | null;
};

export type PrepareSupplySectionForm = {
  water?: string | null;
};
