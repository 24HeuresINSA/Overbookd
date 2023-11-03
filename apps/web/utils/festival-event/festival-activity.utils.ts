import { DRAFT, Draft, FestivalActivity } from "@overbookd/festival-activity";
import { HttpStringified } from "../types/http";
import { InReviewFormat } from "./in-review";
import { DraftCast } from "./draft";

export function castActivityWithDate(
  activity: HttpStringified<FestivalActivity>,
): FestivalActivity {
  if (isDraft(activity)) {
    return DraftCast.castActivityWithDate(activity);
  }
  return InReviewFormat.castActivityWithDate(activity);
}

function isDraft(
  festivalActivity: HttpStringified<FestivalActivity>,
): festivalActivity is HttpStringified<Draft> {
  return festivalActivity.status === DRAFT;
}
