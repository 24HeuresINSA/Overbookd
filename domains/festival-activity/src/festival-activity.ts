import { Adherent, DraftInCharge, InCharge } from "./sections/in-charge";
import { DraftGeneral, General } from "./sections/general";
import { DraftSigna, Signa } from "./sections/signa";
import { Supply } from "./sections/supply";
import { Inquiry } from "./sections/inquiry";
import {
  APPROVED,
  InReviewReviews,
  REJECTED,
  RefusedReviews,
  ValidatedReviews,
} from "./sections/reviews";

export const DRAFT = "DRAFT";
export const IN_REVIEW = "IN_REVIEW";
export const VALIDATED = "VALIDATED";
export const REFUSED = "REFUSED";

type Security = {
  specialNeed: string | null;
};

export type Feedback = {
  content: string;
  publishedAt: Date;
  author: Adherent;
};

export const CREATED = "CREATED";
export const COMMENTED = "COMMENTED";
export const READY_TO_REVIEW = "READY_TO_REVIEW";

type Action =
  | typeof CREATED
  | typeof COMMENTED
  | typeof READY_TO_REVIEW
  | typeof APPROVED
  | typeof REJECTED;

export type KeyEvent = {
  action: Action;
  by: PreviewFestivalActivity["adherent"];
  at: Date;
  description: string;
};

export type Draft = {
  id: number;
  status: typeof DRAFT;
  general: DraftGeneral;
  inCharge: DraftInCharge;
  signa: DraftSigna;
  security: Security;
  supply: Supply;
  inquiry: Inquiry;
  feedbacks: Feedback[];
  history: KeyEvent[];
};

type ReviewableBase = {
  id: number;
  general: General;
  inCharge: InCharge;
  signa: Signa;
  security: Security;
  supply: Supply;
  inquiry: Inquiry;
  feedbacks: Feedback[];
  history: KeyEvent[];
};

export type InReview = ReviewableBase & {
  status: typeof IN_REVIEW;
  reviews: InReviewReviews;
};

export type Validated = ReviewableBase & {
  status: typeof VALIDATED;
  reviews: ValidatedReviews;
};

export type Refused = ReviewableBase & {
  status: typeof REFUSED;
  reviews: RefusedReviews;
};

export type Reviewable = InReview | Validated | Refused;

export type FestivalActivity = Draft | Reviewable;

type PreviewReviewableBase = {
  id: Reviewable["id"];
  name: Reviewable["general"]["name"];
  adherent: Reviewable["inCharge"]["adherent"];
  team: Reviewable["inCharge"]["team"];
};

type InReviewPreview = PreviewReviewableBase & {
  status: InReview["status"];
  reviews: InReview["reviews"];
};

type ValidatedPreview = PreviewReviewableBase & {
  status: Validated["status"];
  reviews: Validated["reviews"];
};

type RefusedPreview = PreviewReviewableBase & {
  status: Refused["status"];
  reviews: Refused["reviews"];
};

export type PreviewReviewable =
  | InReviewPreview
  | ValidatedPreview
  | RefusedPreview;

export type PreviewDraft = {
  id: Draft["id"];
  name: Draft["general"]["name"];
  status: Draft["status"];
  adherent: Draft["inCharge"]["adherent"];
  team: Draft["inCharge"]["team"];
};

export type PreviewFestivalActivity = PreviewReviewable | PreviewDraft;

export type CreateFestivalActivityForm = {
  name: string;
};

export function isDraft(activity: FestivalActivity): activity is Draft {
  return activity.status === DRAFT;
}

export function isRefused(activity: FestivalActivity): activity is Refused {
  return activity.status === REFUSED;
}
