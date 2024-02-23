import { FestivalEventIdentifier, FA } from "./festival-event";
import { APPROVED, REJECTED } from "./action";
import { Adherent } from "./adherent";

export const REVIEWING = "REVIEWING";
export const NOT_ASKING_TO_REVIEW = "NOT_ASKING_TO_REVIEW";

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

export type ReviewingStatus =
  | typeof REVIEWING
  | typeof NOT_ASKING_TO_REVIEW
  | typeof APPROVED;

export type ApprovalReviewStatus =
  | typeof APPROVED
  | typeof NOT_ASKING_TO_REVIEW;

export type RejectionReviewStatus =
  | typeof REVIEWING
  | typeof NOT_ASKING_TO_REVIEW
  | typeof APPROVED
  | typeof REJECTED;

export type ReviewStatus =
  | RejectionReviewStatus
  | ApprovalReviewStatus
  | ReviewingStatus;

export type InReviewReviews<T extends FestivalEventIdentifier> = Record<
  Reviewer<T>,
  ReviewingStatus
>;
export type ValidatedReviews<T extends FestivalEventIdentifier> = Record<
  Reviewer<T>,
  ApprovalReviewStatus
>;
export type RefusedReviews<T extends FestivalEventIdentifier> = Record<
  Reviewer<T>,
  RejectionReviewStatus
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
