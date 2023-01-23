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
  Team?: Team;
  userInCharge?: User;
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

export interface FTTimeWindowUpdate {
  id?: number;
  start: Date;
  end: Date;
  sliceTime?: number;
}

export interface FTTeamRequest {
  quantity: number;
  team: Team;
}

export function castFTWithDate(ft: FT): FT {
  const timeWindows = ft.timeWindows.map(castTimeWindowWithDate);
  //const feedbacks = ft.feedbacks.map(castFeedbackWithDate);
  return {
    ...ft,
    timeWindows: timeWindows,
    //feedbacks: feedbacks,
  };
}

function castTimeWindowWithDate(timeWindow: FTTimeWindow): FTTimeWindow {
  return {
    ...timeWindow,
    start: new Date(timeWindow.start),
    end: new Date(timeWindow.end),
  };
}

function castFeedbackWithDate(feedback: Feedback): Feedback {
  const createdAt = new Date(feedback.createdAt);
  return {
    ...feedback,
    createdAt: createdAt,
  };
}

export function getTimeWindowsWithoutRequests(
  timeWindows: FTTimeWindow[]
): FTTimeWindowUpdate[] {
  return timeWindows.map((tw) => ({
    id: tw.id,
    start: tw.start,
    end: tw.end,
    sliceTime: tw.sliceTime,
  }));
}
