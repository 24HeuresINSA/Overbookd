import { Feedback } from "./feedback";
import { User } from "./user";
import { SignaLocation } from "./signaLocation";
import { Review } from "./review";
import { FA } from "./FA";
import { Team } from "./team";

export enum FTStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  REFUSED = "REFUSED",
  VALIDATED = "VALIDATED",
  READY = "READY",
}

export enum FTStatusLabel {
  DRAFT = "Brouillon",
  SUBMITTED = "Soumise à validation",
  REFUSED = "Refusée",
  VALIDATED = "Validée",
  READY = "Prête à affectation",
}

interface FTBase {
  name: string;
  status: FTStatus;
  fa?: FA;
}

export type FTCreation = Pick<FTBase, "name" | "fa">;

export interface FT extends FTBase {
  id: number;
  description: string;
  team?: Team;
  inCharge?: User;
  areStatic: boolean;

  timeWindows: FTTimeWindow[];
  locations: SignaLocation[];
  ftValidations: Review[];
  ftRefusals: Review[];
  feedbacks: Feedback[];
  isDeleted: boolean;
}

export interface FTUpdate extends Omit<FT, "team" | "inCharge" | "fa"> {
  team?: number;
  inCharge?: number;
  fa?: number;
}

export interface SearchFT {
  isDeleted?: boolean;
  status?: FTStatus;
}

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
