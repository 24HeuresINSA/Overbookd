import { FestivalEvent, FA } from "./festival-event";
import { APPROVED, REJECTED } from "./action";

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

type ElectricityLessTaskReviewer = typeof humain | typeof matos;

type ElectricityNessTaskReviewer = ElectricityLessTaskReviewer | typeof elec;

export type Reviewer<T extends FestivalEvent> = T extends typeof FA
  ? PublicActivityReviewer | PrivateActivityReviewer
  : ElectricityLessTaskReviewer | ElectricityNessTaskReviewer;

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

export type InReviewReviews<T extends FestivalEvent> = Record<
  Reviewer<T>,
  ReviewingStatus
>;
export type ValidatedReviews<T extends FestivalEvent> = Record<
  Reviewer<T>,
  ApprovalReviewStatus
>;
export type RefusedReviews<T extends FestivalEvent> = Record<
  Reviewer<T>,
  RejectionReviewStatus
>;
