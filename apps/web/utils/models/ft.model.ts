import { IProvidePeriod } from "@overbookd/period";
import { HttpStringified } from "@overbookd/http";
import { BaseFa } from "./fa.model";
import { FtFeedback } from "./feedback.model";
import { FtTimeSpan } from "./ft-time-span.model";
import { Review } from "./review.model";
import { SignaLocation } from "@overbookd/signa";
import { Team } from "./team.model";
import { User } from "@overbookd/user";
import { FestivalTask } from "@overbookd/festival-event";

interface BaseFt {
  id: number;
  name: string;
  status: FestivalTask["status"];
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
  status?: FestivalTask["status"];
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

export type FtTimeWindowSortFunction = (
  timeWindows: FtTimeWindow[],
  desc: boolean,
) => FtTimeWindow[];

interface AlsoRequiredByFt {
  id: number;
  name: string;
  period: IProvidePeriod;
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
  const timeWindows = ft.timeWindows.map(castFtTimeWindowWithDate);
  const feedbacks = ft.feedbacks.map(castFtFeedbackWithDate);
  return { ...ft, timeWindows, feedbacks };
}

export function castFtTimeWindowWithDate(
  timeWindow: HttpStringified<FtTimeWindow>,
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

function castFtFeedbackWithDate(
  feedback: HttpStringified<FtFeedback>,
): FtFeedback {
  const createdAt = new Date(feedback.createdAt);
  return {
    ...feedback,
    createdAt: createdAt,
  };
}

export function getFtTimeWindowWithoutRequests({
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
  userRequest: HttpStringified<FtUserRequest>,
): FtUserRequest {
  return {
    ...userRequest,
    alsoRequestedBy: userRequest.alsoRequestedBy.map(
      ({ id, name, period }) => ({
        id,
        name,
        period: { start: new Date(period.start), end: new Date(period.end) },
      }),
    ),
  };
}

function castTimeSpanWithDate(
  timeSpan: HttpStringified<FtTimeSpan>,
): FtTimeSpan {
  return {
    ...timeSpan,
    start: new Date(timeSpan.start),
    end: new Date(timeSpan.end),
  };
}
