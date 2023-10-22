export type PrepareGeneralSection = {
  name?: string;
  description?: string | null;
  categories?: string[];
  toPublish?: boolean;
  photoLink?: string | null;
  isFlagship?: boolean;
};

export type PrepareInChargeSection = {
  adherentId?: number;
  team?: string | null;
};

export type PrepareSignaSection = {
  location?: string | null;
};

export type PrepareSecuritySection = {
  specialNeed?: string | null;
};

export type PrepareSupplySection = {
  water?: string | null;
};
