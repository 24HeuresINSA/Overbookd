import {
  Adherent,
  Signage,
  ElectricitySupply,
  InquirySection,
  DRAFT,
} from "../festival-activity.core";
import { GeneralSectionRepresentation } from "./general-section";

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
  general: GeneralSectionRepresentation;
  inCharge: InChargeSection;
  signa: SignaSection;
  security: SecuritySection;
  supply: SupplySection;
  inquiry: InquirySection;
};

export type DraftFestivalActivityRepresentation = BaseFestivalActivity & {
  status: typeof DRAFT;
};
