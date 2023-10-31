import { IProvidePeriod } from "@overbookd/period";
import {
  Adherent,
  Signage,
  ElectricitySupply,
  InquirySection,
  DRAFT,
} from "../festival-activity.core";

export type GeneralSection = {
  name: string;
  description: string | null;
  categories: string[];
  toPublish: boolean;
  photoLink: string | null;
  isFlagship: boolean;
  timeWindows: IProvidePeriod[];
};

export type InChargeSection = {
  adherent: Adherent;
  team: string | null;
  contractors: never[];
};

export type SignaSection = {
  location: string | null;
  signages: Signage[];
};

export type SecuritySection = {
  specialNeed: string | null;
};

export type SupplySection = {
  electricity: ElectricitySupply[];
  water: string | null;
};
export type BaseFestivalActivity = {
  id: number;
  general: GeneralSection;
  inCharge: InChargeSection;
  signa: SignaSection;
  security: SecuritySection;
  supply: SupplySection;
  inquiry: InquirySection;
};

export type DraftFestivalActivityRepresentation = BaseFestivalActivity & {
  status: typeof DRAFT;
};
