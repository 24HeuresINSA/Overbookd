import {
  ElectricityConnection,
  ElectricitySupply,
  Signage,
  SignageType,
  Supply,
} from "../festival-activity";
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

export type PrepareContractorUpdate = {
  id: Contractor["id"];
  firstname?: string;
  lastname?: string;
  phone?: string;
  email?: string | null;
  company?: string | null;
  comment?: string | null;
};

export type PrepareSignaUpdate = {
  location?: string | null;
};

export type PrepareSignageCreation = Pick<
  Signage,
  "quantity" | "text" | "size" | "type"
> & {
  comment?: string;
};

export type PrepareSignageUpdate = {
  id: Signage["id"];
  quantity?: number;
  text?: string;
  size?: string;
  type?: SignageType;
  comment?: string | null;
};

export type PrepareSupplyUpdate = {
  water: Supply["water"];
};

export type PrepareElectricitySupplyCreation = Pick<
  ElectricitySupply,
  "connection" | "device" | "power" | "count"
> & {
  comment?: string;
};

export type PrepareElectricitySupplyUpdate = {
  id: ElectricitySupply["id"];
  connection?: ElectricityConnection;
  device?: string;
  power?: number;
  count?: number;
  comment?: string | null;
};

export const MATOS = "matos";
export const BARRIERES = "barrieres";
export const ELEC = "elec";

type InquiryOwner = typeof MATOS | typeof BARRIERES | typeof ELEC;

export type PrepareInquiryRequestCreation = InquiryRequest & {
  owner: InquiryOwner;
};
