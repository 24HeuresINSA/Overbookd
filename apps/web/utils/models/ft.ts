import { HttpStringified } from "../types/http";
import { BaseFa } from "./fa";
import { FtFeedback } from "./feedback";
import { FtTimeSpan } from "./ftTimeSpan";
import { Period } from "./period";
import { Review } from "./review";
import { SignaLocation } from "./signaLocation";
import { Team } from "./team";
import { User } from "./user";

export enum FtStatus {
  DRAFT = "DRAFT",
  REFUSED = "REFUSED",
  SUBMITTED = "SUBMITTED",
  VALIDATED = "VALIDATED",
  READY = "READY",
}

export const BROUILLON = "Brouillon";
const REFUSEE = "Refusée";
const SOUMISE_A_VALIDATION = "Soumise à validation";
const VALIDEE = "Validée";
const PRETE_POUR_AFFECTATION = "Prête à affectation";

export type FtStatusLabel =
  | typeof BROUILLON
  | typeof REFUSEE
  | typeof SOUMISE_A_VALIDATION
  | typeof VALIDEE
  | typeof PRETE_POUR_AFFECTATION;

export const ftStatusLabels = new Map<FtStatus, FtStatusLabel>([
  [FtStatus.DRAFT, BROUILLON],
  [FtStatus.REFUSED, REFUSEE],
  [FtStatus.SUBMITTED, SOUMISE_A_VALIDATION],
  [FtStatus.VALIDATED, VALIDEE],
  [FtStatus.READY, PRETE_POUR_AFFECTATION],
]);

export enum FtCardType {
  GENERAL = "GENERAL",
  PARENT_FA = "PARENT_FA",
  DETAIL = "DETAIL",
  TIME_WINDOW = "TIME_WINDOW",
  LOGISTICS = "LOGISTICS",
}

interface BaseFt {
  id: number;
  name: string;
  status: FtStatus;
}

export interface FtCreation {
  name: string;
  parentFaId?: number;
}

export interface Ft extends BaseFt {
  description: string;
  team?: Team;
  userInCharge?: User;
  isStatic: boolean;
  fa?: BaseFa;
  location?: SignaLocation;

  timeWindows: FtTimeWindow[];
  reviews: Review[];
  feedbacks: FtFeedback[];
  isDeleted: boolean;
  reviewer?: User;
}

export type FtSimplified = Pick<
  Ft,
  | "id"
  | "name"
  | "fa"
  | "status"
  | "userInCharge"
  | "team"
  | "reviews"
  | "reviewer"
>;

export interface FtUpdate
  extends Pick<
    Ft,
    "id" | "name" | "status" | "isStatic" | "description" | "isDeleted"
  > {
  parentFaId: number | null;
  userInChargeId: number | null;
  teamCode: string | null;
  locationId: number | null;
}

export interface FtSearch {
  isDeleted?: boolean;
  status?: FtStatus;
}

export interface FtPageId {
  id: number;
}

export interface FtTimeWindow {
  id?: number;
  start: Date;
  end: Date;
  sliceTime: number | null;
  userRequests: FtUserRequest[];
  teamRequests: FtTeamRequest[];
  timeSpans: FtTimeSpan[];
}

export interface FtTimeWindowUpdate {
  id?: number;
  start: Date;
  end: Date;
  sliceTime: number | null;
}

export type SortableTimeWindowHeader = "startDate" | "endDate";

export type FtTimeWindowSortFunction = (
  timeWindows: FtTimeWindow[],
  desc: boolean
) => FtTimeWindow[];

interface AlsoRequiredByFt {
  id: number;
  name: string;
  period: Period;
}

export interface FtUserRequest {
  user: User;
  alsoRequestedBy: AlsoRequiredByFt[];
  isAvailable: boolean;
  isAlreadyAssigned: boolean;
}

export class FtUserRequestImpl implements FtUserRequest {
  user: User;
  alsoRequestedBy: AlsoRequiredByFt[];
  isAvailable: boolean;
  isAlreadyAssigned: boolean;

  constructor({
    user,
    alsoRequestedBy,
    isAvailable,
    isAlreadyAssigned,
  }: FtUserRequest) {
    this.user = user;
    this.alsoRequestedBy = alsoRequestedBy;
    this.isAvailable = isAvailable;
    this.isAlreadyAssigned = isAlreadyAssigned;
  }

  static build(userRequest: FtUserRequest): FtUserRequestImpl {
    return new FtUserRequestImpl(userRequest);
  }
}

export interface FtTeamRequest {
  quantity: number;
  team: Team;
}

export interface FtTeamRequestUpdate extends Omit<FtTeamRequest, "team"> {
  teamCode: string;
}

export interface FtUserRequestUpdate {
  userId: number;
}

export function castFTWithDate(ft: HttpStringified<Ft>): Ft {
  const timeWindows = ft.timeWindows.map(castTimeWindowWithDate);
  const feedbacks = ft.feedbacks.map(castFeedbackWithDate);
  return { ...ft, timeWindows, feedbacks };
}

export function castTimeWindowWithDate(
  timeWindow: HttpStringified<FtTimeWindow>
): FtTimeWindow {
  return {
    ...timeWindow,
    start: new Date(timeWindow.start),
    end: new Date(timeWindow.end),
    userRequests: timeWindow.userRequests?.map(castUserRequestWithDate) ?? [],
    teamRequests: timeWindow.teamRequests ?? [],
    timeSpans: timeWindow.timeSpans?.map(castTimeSpanWithDate) ?? [],
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
}: FtTimeWindow): FtTimeWindowUpdate {
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
}: Ft): FtUpdate {
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
}: Ft): FtSimplified {
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
  userRequest: HttpStringified<FtUserRequest>
): FtUserRequest {
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

function castTimeSpanWithDate(
  timeSpan: HttpStringified<FtTimeSpan>
): FtTimeSpan {
  return {
    ...timeSpan,
    start: new Date(timeSpan.start),
    end: new Date(timeSpan.end),
  };
}
