import { Feedback } from "./feedback";
import { User } from "./user";
import { SignaLocation } from "./signaLocation";
import { Review } from "./review";
import { FA } from "./FA";

export enum FTStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  VALIDATED = "VALIDATED",
  REFUSED = "REFUSED",
  READY = "READY",
}

interface FTBase {
  name: string;
  status: FTStatus;
  description: string;
}

export interface FTCreation extends FTBase {
  status: FTStatus.DRAFT;
}

export interface FT extends FTBase {
  id: number;
  inCharge?: User;
  areStatic: boolean;
  fa?: FA;
  locations: SignaLocation[];
  ftValidations: Review[];
  ftRefusals: Review[];
  ftComments: Feedback[];
}

export interface FTUpdate extends Omit<FT, "inCharge"> {
  inCharge?: number;
}

export interface SearchFT {
  isDeleted?: boolean;
  status?: FTStatus;
}
