import { HttpStringified } from "../types/http";
import { FaSimplified } from "./FA";
import { FtFeedback } from "./feedback";
import { FtTimespan } from "./ftTimespan";
import { Period } from "./period";
import { Review } from "./review";
import { SignaLocation } from "./signaLocation";
import { Team } from "./team";
import { User } from "./user";

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

export enum FTCardType {
  GENERAL = "GENERAL",
  PARENT_FA = "PARENT_FA",
  DETAIL = "DETAIL",
  TIME_WINDOW = "TIME_WINDOW",
  LOGISTICS = "LOGISTICS",
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
  fa?: FaSimplified;
  location?: SignaLocation;

  timeWindows: FTTimeWindow[];
  reviews: Review[];
  feedbacks: FtFeedback[];
  isDeleted: boolean;
  reviewer?: User;
}

export type FTSimplified = Pick<
  FT,
  | "id"
  | "name"
  | "fa"
  | "status"
  | "userInCharge"
  | "team"
  | "reviews"
  | "reviewer"
>;

export interface FTUpdate
  extends Pick<
    FT,
    "id" | "name" | "status" | "isStatic" | "description" | "isDeleted"
  > {
  parentFaId: number | null;
  userInChargeId: number | null;
  teamCode: string | null;
  locationId: number | null;
}

export interface FTSearch {
  isDeleted?: boolean;
  status?: FTStatus;
}

export interface FTPageId {
  id: number;
}

export interface FTTimeWindow {
  id?: number;
  start: Date;
  end: Date;
  sliceTime: number | null;
  userRequests: FTUserRequest[];
  teamRequests: FTTeamRequest[];
  timespans: FtTimespan[];
}

export interface FTTimeWindowUpdate {
  id?: number;
  start: Date;
  end: Date;
  sliceTime: number | null;
}

export type SortableTimeWindowHeader = "startDate" | "endDate";

export type FTTimeWindowSortFunction = (
  timeWindows: FTTimeWindow[],
  desc: boolean
) => FTTimeWindow[];

interface AlsoRequiredByFt {
  id: number;
  name: string;
  period: Period;
}

export interface FTUserRequest {
  user: User;
  alsoRequestedBy: AlsoRequiredByFt[];
  isAvailable: boolean;
  isAlreadyAssigned: boolean;
}

export class FTUserRequestImpl implements FTUserRequest {
  user: User;
  alsoRequestedBy: AlsoRequiredByFt[];
  isAvailable: boolean;
  isAlreadyAssigned: boolean;

  constructor({
    user,
    alsoRequestedBy,
    isAvailable,
    isAlreadyAssigned,
  }: FTUserRequest) {
    this.user = user;
    this.alsoRequestedBy = alsoRequestedBy;
    this.isAvailable = isAvailable;
    this.isAlreadyAssigned = isAlreadyAssigned;
  }

  static build(userRequest: FTUserRequest): FTUserRequestImpl {
    return new FTUserRequestImpl(userRequest);
  }
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
    userRequests: timeWindow.userRequests?.map(castUserRequestWithDate) ?? [],
    teamRequests: timeWindow.teamRequests ?? [],
    timespans: timeWindow.timespans?.map(castTimespanWithDate) ?? [],
  };
}

function castFeedbackWithDate(
  feedback: HttpStringified<FtFeedback>
): FtFeedback {
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
  status,
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
    status,
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
  reviewer,
}: FT): FTSimplified {
  return {
    id,
    name,
    fa,
    reviews,
    status,
    team,
    userInCharge,
    reviewer,
  };
}

export function castUserRequestWithDate(
  userRequest: HttpStringified<FTUserRequest>
): FTUserRequest {
  return {
    ...userRequest,
    alsoRequestedBy: userRequest.alsoRequestedBy.map(
      ({ id, name, period }) => ({
        id,
        name,
        period: { start: new Date(period.start), end: new Date(period.end) },
      })
    ),
  };
}

function castTimespanWithDate(
  timespan: HttpStringified<FtTimespan>
): FtTimespan {
  return {
    ...timespan,
    start: new Date(timespan.start),
    end: new Date(timespan.end),
  };
}
