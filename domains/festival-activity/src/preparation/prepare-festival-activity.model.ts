import { ElectricityConnection, ElectricitySupply } from "../festival-activity";
import { Adherent, Contractor, InquiryRequest } from "../festival-activity";

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

export type PrepareContractorCreation = Pick<
  Contractor,
  "firstname" | "lastname" | "phone"
> & {
  email?: string;
  company?: string;
  comment?: string;
};

export type PrepareContractorUpdate = Pick<
  Contractor,
  "id" | "firstname" | "lastname" | "phone"
> & {
  email?: string | null;
  company?: string | null;
  comment?: string | null;
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

export type PrepareElectricitySupplyCreation = Pick<
  ElectricitySupply,
  "connection" | "device" | "power" | "count"
> & {
  comment?: string;
};

export type PrepareElectricitySupplyUpdate = {
  id: string;
  connection?: ElectricityConnection;
  device?: string;
  power?: number;
  count?: number;
  comment?: string | null;
};

export const GEAR = "GEAR";
export const BARRIER = "BARRIER";
export const ELECTRICITY = "ELECTRICITY";

export type InquiryCategory = typeof GEAR | typeof BARRIER | typeof ELECTRICITY;

export type PrepareInquiryRequestCreation = Omit<InquiryRequest, "id"> & {
  category: InquiryCategory;
};
