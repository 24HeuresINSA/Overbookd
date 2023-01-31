import { Feedback } from "./feedback";
import { User } from "./user";
import { SignaLocation } from "./signaLocation";
import { Review } from "./review";
import { Team } from "./team";
import { HttpStringified } from "../types/http";
import { FASimplified } from "./FA";

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
  parentFaId?: number;
}

export interface FT extends FTBase {
  id: number;
  description: string;
  team?: Team;
  userInCharge?: User;
  isStatic: boolean;
  fa?: FASimplified;
  location?: SignaLocation;

  timeWindows: FTTimeWindow[];
  reviews: Review[];
  feedbacks: Feedback[];
  isDeleted: boolean;
}

export type FTSimplified = Pick<
  FT,
  "id" | "name" | "fa" | "status" | "userInCharge" | "team" | "reviews"
>;

export interface FTUpdate
  extends Pick<FT, "id" | "name" | "isStatic" | "description" | "isDeleted"> {
  parentFaId: number | null;
  userInChargeId: number | null;
  teamCode: string | null;
  locationId: number | null;
}

export interface FTSearch {
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

export interface FTTeamRequestUpdate extends Omit<FTTeamRequest, "team"> {
  teamCode: string;
}

export interface FTUserRequestUpdate {
  userId: number;
}

export function castFTWithDate(ft: HttpStringified<FT>): FT {
  const timeWindows = ft.timeWindows.map(castTimeWindowWithDate);
  const feedbacks = ft.feedbacks.map(castFeedbackWithDate);
  return { ...ft, timeWindows, feedbacks };
}

export function castTimeWindowWithDate(
  timeWindow: HttpStringified<FTTimeWindow>
): FTTimeWindow {
  return {
    ...timeWindow,
    start: new Date(timeWindow.start),
    end: new Date(timeWindow.end),
  };
}

function castFeedbackWithDate(feedback: HttpStringified<Feedback>): Feedback {
  const createdAt = new Date(feedback.createdAt);
  return {
    ...feedback,
    createdAt: createdAt,
  };
}

export function getTimeWindowWithoutRequests({
  id,
  start,
  end,
  sliceTime,
}: FTTimeWindow): FTTimeWindowUpdate {
  return { id, start, end, sliceTime };
}

export function toUpdateFT({
  id,
  name,
  fa,
  isStatic,
  description,
  userInCharge,
  team,
  location,
  isDeleted,
}: FT): FTUpdate {
  return {
    id,
    name,
    parentFaId: fa?.id ?? null,
    isStatic,
    description,
    userInChargeId: userInCharge?.id ?? null,
    teamCode: team?.code ?? null,
    locationId: location?.id ?? null,
    isDeleted,
  };
}

export function toSimplifiedFT({
  id,
  name,
  fa,
  reviews,
  status,
  team,
  userInCharge,
}: FT): FTSimplified {
  return {
    id,
    name,
    fa,
    reviews,
    status,
    team,
    userInCharge,
  };
}
