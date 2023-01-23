import { Feedback } from "./feedback";
import { User } from "./user";
import { SignaLocation } from "./signaLocation";
import { Review } from "./review";
import { FASimplified } from "./FA";
import { Team } from "./team";

export enum FTStatus {
  DRAFT = "DRAFT",
  REFUSED = "REFUSED",
  SUBMITTED = "SUBMITTED",
  VALIDATED = "VALIDATED",
  READY = "READY",
}

export enum FTStatusLabel {
  DRAFT = "Brouillon",
  REFUSED = "Refusée",
  SUBMITTED = "Soumise à validation",
  VALIDATED = "Validée",
  READY = "Prête à affectation",
}

interface FTBase {
  name: string;
  status: FTStatus;
}

export interface FTCreation {
  name: string;
  faId?: number;
}

export interface FT extends FTBase {
  id: number;
  description: string;
  team?: Team;
  inCharge?: User;
  isStatic: boolean;
  fa?: FASimplified;
  location?: SignaLocation;

  timeWindows: FTTimeWindow[];
  ftValidations: Review[];
  ftRefusals: Review[];
  feedbacks: Feedback[];
  isDeleted: boolean;
}

export interface FTUpdate {
  id: number;
  name: string;
  parentFaId: number | null;
  isStatic: boolean;
  description: string;
  userInChargeId: number | null;
  teamCode: string | null;
  locationId: number | null;
}

export interface SearchFT {
  isDeleted?: boolean;
  status?: FTStatus;
}

export type FTSimplified = Pick<FT, "id" | "name" | "status">;

export interface FTTimeWindow {
  id?: number;
  start: Date;
  end: Date;
  sliceTime?: number;
  userRequests: User[];
  teamRequests: FTTeamRequest[];
}

export interface FTTeamRequest {
  quantity: number;
  team: Team;
}
