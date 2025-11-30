import { FestivalEventIdentifier, FA } from "./festival-event.js";
import { Adherent } from "./adherent.js";
import {
  APPROVED,
  NOT_ASKING_TO_REVIEW,
  REJECTED,
  REVIEWING,
  WILL_NOT_REVIEW,
} from "@overbookd/festival-event-constants";
import {
  BARRIERES,
  COMMUNICATION,
  HUMAIN,
  LOG_ELEC,
  LOG_MATOS,
  SECU,
  SIGNA,
} from "@overbookd/team-constants";

export type PrivateActivityReviewer =
  | typeof HUMAIN
  | typeof SIGNA
  | typeof SECU
  | typeof LOG_MATOS
  | typeof LOG_ELEC
  | typeof BARRIERES;

export type PublicActivityReviewer =
  | PrivateActivityReviewer
  | typeof COMMUNICATION;

type NoSupplyRequestTaskReviewer = typeof HUMAIN | typeof LOG_MATOS;

type TaskWithSupplyRequestReviewer =
  | NoSupplyRequestTaskReviewer
  | typeof LOG_ELEC;
export type Reviewer<T extends FestivalEventIdentifier> = T extends typeof FA
  ? PublicActivityReviewer | PrivateActivityReviewer
  : NoSupplyRequestTaskReviewer | TaskWithSupplyRequestReviewer;

type FestivalActivityReviewingStatus =
  | typeof REVIEWING
  | typeof NOT_ASKING_TO_REVIEW
  | typeof APPROVED;

type FestivalTaskReviewingStatus =
  | typeof REVIEWING
  | typeof NOT_ASKING_TO_REVIEW
  | typeof WILL_NOT_REVIEW
  | typeof APPROVED;

export type ReviewingStatus<T extends FestivalEventIdentifier> = T extends "FA"
  ? FestivalActivityReviewingStatus
  : FestivalTaskReviewingStatus;

type FestivalActivityApprovalReviewStatus =
  | typeof APPROVED
  | typeof NOT_ASKING_TO_REVIEW;

type FestivalTaskApprovalReviewStatus =
  | typeof APPROVED
  | typeof NOT_ASKING_TO_REVIEW
  | typeof WILL_NOT_REVIEW;

export type ApprovalReviewStatus<T extends FestivalEventIdentifier> =
  T extends "FA"
    ? FestivalActivityApprovalReviewStatus
    : FestivalTaskApprovalReviewStatus;

type FestivalActivityRejectionReviewStatus =
  | typeof REVIEWING
  | typeof NOT_ASKING_TO_REVIEW
  | typeof APPROVED
  | typeof REJECTED;

type FestivalTaskRejectionReviewStatus =
  | typeof REVIEWING
  | typeof NOT_ASKING_TO_REVIEW
  | typeof WILL_NOT_REVIEW
  | typeof APPROVED
  | typeof REJECTED;

export type RejectionReviewStatus<T extends FestivalEventIdentifier> =
  T extends "FA"
    ? FestivalActivityRejectionReviewStatus
    : FestivalTaskRejectionReviewStatus;

export type ReviewStatus<T extends FestivalEventIdentifier> =
  | ReviewingStatus<T>
  | ApprovalReviewStatus<T>
  | RejectionReviewStatus<T>;

export type InReviewReviews<T extends FestivalEventIdentifier> = Record<
  Reviewer<T>,
  ReviewingStatus<T>
>;
export type ValidatedReviews<T extends FestivalEventIdentifier> = Record<
  Reviewer<T>,
  ApprovalReviewStatus<T>
>;
export type RefusedReviews<T extends FestivalEventIdentifier> = Record<
  Reviewer<T>,
  RejectionReviewStatus<T>
>;

export type Rejection<T extends FestivalEventIdentifier> = {
  team: Reviewer<T>;
  rejector: Adherent;
  reason: string;
};

export type Approval<T extends FestivalEventIdentifier> = {
  team: Reviewer<T>;
  reviewer: Adherent;
};

export type Reviews<T extends FestivalEventIdentifier> =
  | InReviewReviews<T>
  | ValidatedReviews<T>
  | RefusedReviews<T>;

export function isRefusedReviews<T extends FestivalEventIdentifier>(
  reviews: Reviews<T>,
): reviews is RefusedReviews<T> {
  return Object.values(reviews).some((review) => review === REJECTED);
}

export function isValidatedReviews<T extends FestivalEventIdentifier>(
  reviews: Reviews<T>,
): reviews is ValidatedReviews<T> {
  return Object.values(reviews).every(
    (review) =>
      review === APPROVED ||
      review === NOT_ASKING_TO_REVIEW ||
      review === WILL_NOT_REVIEW,
  );
}
