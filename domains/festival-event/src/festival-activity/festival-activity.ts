import {
  DRAFT,
  IN_REVIEW,
  VALIDATED,
  REFUSED,
  READY_TO_ASSIGN,
} from "@overbookd/festival-event-constants";
import { DraftInCharge, InCharge } from "./sections/in-charge.js";
import { DraftGeneral, General } from "./sections/general.js";
import { DraftSigna, Signa } from "./sections/signa.js";
import { Supply } from "./sections/supply.js";
import { Inquiry } from "./sections/inquiry.js";
import {
  InReviewReviews,
  RefusedReviews,
  ValidatedReviews,
} from "../common/review.js";
import { APPROVED, REJECTED } from "../common/action.js";
import { CREATED, COMMENTED, READY_TO_REVIEW } from "../common/action.js";
import { Feedback } from "../common/feedback.js";

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
  tasks: FestivalTaskChild[];
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
  tasks: FestivalTaskChild[];
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

type PreviewBase = {
  id: FestivalActivity["id"];
  name: FestivalActivity["general"]["name"];
  adherent: FestivalActivity["inCharge"]["adherent"];
};

type PreviewReviewableBase = PreviewBase & {
  team: Reviewable["inCharge"]["team"];
};

type InReviewPreview = PreviewReviewableBase & {
  status: InReview["status"];
  reviews: InReviewReviews<"FA">;
};

type ValidatedPreview = PreviewReviewableBase & {
  status: Validated["status"];
  reviews: ValidatedReviews<"FA">;
};

type RefusedPreview = PreviewReviewableBase & {
  status: Refused["status"];
  reviews: RefusedReviews<"FA">;
};

export type PreviewReviewable =
  | InReviewPreview
  | ValidatedPreview
  | RefusedPreview;

export type PreviewDraft = PreviewBase & {
  status: Draft["status"];
  team: Draft["inCharge"]["team"];
};

export type PreviewFestivalActivity = PreviewReviewable | PreviewDraft;

export type FestivalTaskChild = {
  id: number;
  name: string;
  status:
    | typeof DRAFT
    | typeof IN_REVIEW
    | typeof REFUSED
    | typeof VALIDATED
    | typeof READY_TO_ASSIGN;
};
