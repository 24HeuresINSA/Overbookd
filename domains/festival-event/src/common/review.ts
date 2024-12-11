import { FestivalEventIdentifier, FA } from "./festival-event.js";
import { APPROVED, REJECTED } from "./action.js";
import { Adherent } from "./adherent.js";

export const REVIEWING = "REVIEWING";
export const NOT_ASKING_TO_REVIEW = "NOT_ASKING_TO_REVIEW";
export const WILL_NOT_REVIEW = "WILL_NOT_REVIEW";

export const communication = "communication";
export const humain = "humain";
export const signa = "signa";
export const secu = "secu";
export const matos = "matos";
export const elec = "elec";
export const barrieres = "barrieres";

export type PrivateActivityReviewer =
  | typeof humain
  | typeof signa
  | typeof secu
  | typeof matos
  | typeof elec
  | typeof barrieres;

export type PublicActivityReviewer =
  | PrivateActivityReviewer
  | typeof communication;

type NoSupplyRequestTaskReviewer = typeof humain | typeof matos;

type TaskWithSupplyRequestReviewer = NoSupplyRequestTaskReviewer | typeof elec;

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
    (review) => review === APPROVED || review === NOT_ASKING_TO_REVIEW,
  );
}
