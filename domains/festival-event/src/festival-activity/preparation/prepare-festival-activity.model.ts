import { InquiryOwner } from "../sections/inquiry.js";
import {
  ElectricityConnection,
  ElectricitySupply,
  Supply,
} from "../sections/supply.js";
import { Signage, SignageCatalogItem, SignageType } from "../sections/signa.js";
import { Location } from "../../common/location.js";
import { BaseInquiryRequest } from "../../common/inquiry-request.js";
import { Contractor } from "../sections/in-charge.js";
import { Adherent } from "../../common/adherent.js";
import { AssignDrive } from "../../common/inquiry-request.js";

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
  location: Location | null;
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

export type PrepareSecurityUpdate = {
  specialNeed?: string | null;
  freePass?: number;
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

type WithInquiryOwner = {
  owner: InquiryOwner;
};

export type PrepareInquiryRequestCreation = BaseInquiryRequest &
  WithInquiryOwner;

export type LinkInquiryDrive = AssignDrive & WithInquiryOwner;

export type LinkSignageCatalogItem = {
  signageId: Signage["id"];
  catalogItem: SignageCatalogItem;
};
