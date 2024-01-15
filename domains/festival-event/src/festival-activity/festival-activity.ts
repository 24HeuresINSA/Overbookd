import { DraftInCharge, InCharge } from "./sections/in-charge";
import { DraftGeneral, General } from "./sections/general";
import { DraftSigna, Signa } from "./sections/signa";
import { Supply } from "./sections/supply";
import { Inquiry } from "./sections/inquiry";
import {
  InReviewReviews,
  RefusedReviews,
  ValidatedReviews,
} from "../common/review";
import { APPROVED, REJECTED } from "../common/action";
import { DRAFT, IN_REVIEW, VALIDATED, REFUSED } from "../common/status";
import { CREATED, COMMENTED, READY_TO_REVIEW } from "../common/action";
import { Feedback } from "../common/feedback";
import { PreviewFestivalActivity } from "../preview/festival-activity";

type Security = {
  specialNeed: string | null;
  freePass: number;
};

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
  reviews: InReviewReviews<"FA">;
};

export type Validated = ReviewableBase & {
  status: typeof VALIDATED;
  reviews: ValidatedReviews<"FA">;
};

export type Refused = ReviewableBase & {
  status: typeof REFUSED;
  reviews: RefusedReviews<"FA">;
};

export type Reviewable = InReview | Validated | Refused;

export type FestivalActivity = Draft | Reviewable;

export type CreateFestivalActivityForm = {
  name: string;
};

export function isDraft(activity: FestivalActivity): activity is Draft {
  return activity.status === DRAFT;
}

export function isRefused(activity: FestivalActivity): activity is Refused {
  return activity.status === REFUSED;
}
