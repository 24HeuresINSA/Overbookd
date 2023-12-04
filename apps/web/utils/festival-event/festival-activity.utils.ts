import {
  APPROVED,
  DRAFT,
  Draft,
  FestivalActivity,
  REJECTED,
  REVIEWING,
  ReviewStatus,
} from "@overbookd/festival-activity";
import { HttpStringified } from "@overbookd/http";
import { CastInReview } from "./in-review";
import { CastDraft } from "./draft";

export function castActivityWithDate(
  activity: HttpStringified<FestivalActivity>,
): FestivalActivity {
  if (isDraft(activity)) {
    return CastDraft.withDate(activity);
  }
  return CastInReview.withDate(activity);
}

function isDraft(
  festivalActivity: HttpStringified<FestivalActivity>,
): festivalActivity is HttpStringified<Draft> {
  return festivalActivity.status === DRAFT;
}

const A_RELIRE = "À relire";
const VALIDEE = "Aprouvée";
const REJETEE = "Rejetée";

export type ReviewLabel = typeof A_RELIRE | typeof VALIDEE | typeof REJETEE;

export const reviewStatusLabel = new Map<ReviewStatus, ReviewLabel>([
  [REVIEWING, A_RELIRE],
  [APPROVED, VALIDEE],
  [REJECTED, REJETEE],
]);
