import { Adherent, DraftInCharge, InCharge } from "./sections/in-charge";
import { DraftGeneral, General } from "./sections/general";
import { DraftSigna, Signa } from "./sections/signa";
import { Supply } from "./sections/supply";
import { Inquiry } from "./sections/inquiry";
import { InReviewReviews, ValidatedReviews } from "./sections/reviews";

export const DRAFT = "DRAFT";
export const IN_REVIEW = "IN_REVIEW";
export const VALIDATED = "VALIDATED";

type Security = {
  specialNeed: string | null;
};

export type Feedback = {
  content: string;
  publishedAt: Date;
  author: Adherent;
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
};

export type InReview = ReviewableBase & {
  status: typeof IN_REVIEW;
  reviews: InReviewReviews;
};

export type Validated = ReviewableBase & {
  status: typeof VALIDATED;
  reviews: ValidatedReviews;
};

export type Reviewable = InReview | Validated;

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

export type PreviewReviewable = InReviewPreview | ValidatedPreview;

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
