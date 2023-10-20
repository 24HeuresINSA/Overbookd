import { IProvidePeriod } from "@overbookd/period";

export const DRAFT = "DRAFT";
export const IN_REVIEW = "IN_REVIEW";

export type Adherent = {
  id: number;
  firstname: string;
  lastname: string;
  nickname?: string;
};

export type Signage = {
  quantity: number;
  text: string;
  size: string;
  type: "BACHE" | "PANNEAU" | "AFFICHE";
  comment: string;
};

export type ElectricitySupply = {
  connection:
    | "PC16_Prise_classique"
    | "P17_16A_MONO"
    | "P17_16A_TRI"
    | "P17_16A_TETRA"
    | "P17_32A_MONO"
    | "P17_32A_TRI"
    | "P17_32A_TETRA"
    | "P17_63A_MONO"
    | "P17_63A_TRI"
    | "P17_63A_TETRA"
    | "P17_125A_TETRA";
  device: string;
  power: number;
  count: number;
  comment: string | null;
};

export type Inquiry = {
  id: number;
  quantity: number;
  name: string;
};

export type InquirySection = {
  timeWindows: IProvidePeriod[];
  gears: Inquiry[];
  electricity: Inquiry[];
  barriers: Inquiry[];
};
