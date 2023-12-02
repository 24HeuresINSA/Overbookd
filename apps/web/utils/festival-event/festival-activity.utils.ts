import { DRAFT, Draft, FestivalActivity } from "@overbookd/festival-activity";
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
