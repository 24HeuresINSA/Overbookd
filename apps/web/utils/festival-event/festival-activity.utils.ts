import {
  APPROVED,
  DRAFT,
  Draft,
  FestivalActivity,
  NOT_ASKING_TO_REVIEW,
  REJECTED,
  REVIEWING,
  ReviewStatus,
  barrieres,
  communication,
  elec,
  humain,
  isDraft,
  matos,
  secu,
  signa,
} from "@overbookd/festival-activity";
import { HttpStringified } from "@overbookd/http";
import { CastInReview } from "./in-review";
import { CastDraft } from "./draft";

export function castActivityWithDate(
  activity: HttpStringified<FestivalActivity>,
): FestivalActivity {
  if (isHttpDraft(activity)) {
    return CastDraft.withDate(activity);
  }
  return CastInReview.withDate(activity);
}

function isHttpDraft(
  festivalActivity: HttpStringified<FestivalActivity>,
): festivalActivity is HttpStringified<Draft> {
  return festivalActivity.status === DRAFT;
}

const A_RELIRE = "À relire";
const APPROUVEE = "Approuvée";
const REJETEE = "Rejetée";

export type ReviewLabel = typeof A_RELIRE | typeof APPROUVEE | typeof REJETEE;

export const reviewStatusLabel = new Map<ReviewStatus, ReviewLabel>([
  [REVIEWING, A_RELIRE],
  [APPROVED, APPROUVEE],
  [REJECTED, REJETEE],
]);

export function getReviewStatus(
  festivalActivity: FestivalActivity,
  reviewer: string,
): ReviewStatus {
  if (isDraft(festivalActivity)) return NOT_ASKING_TO_REVIEW;
  switch (reviewer) {
    case humain:
      return festivalActivity.reviews.humain;
    case signa:
      return festivalActivity.reviews.signa;
    case secu:
      return festivalActivity.reviews.secu;
    case matos:
      return festivalActivity.reviews.matos;
    case elec:
      return festivalActivity.reviews.elec;
    case barrieres:
      return festivalActivity.reviews.barrieres;
    case communication:
      return festivalActivity.reviews.communication;
    default:
      return NOT_ASKING_TO_REVIEW;
  }
}
