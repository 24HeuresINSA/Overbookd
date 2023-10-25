import {
  DRAFT,
  DraftFestivalActivityRepresentation,
  FestivalActivityRepresentation,
} from "@overbookd/festival-activity";
import { HttpStringified } from "../types/http";
import { InReview } from "./in-review";
import { Draft } from "./draft";

export function castActivityWithDate(
  activity: HttpStringified<FestivalActivityRepresentation>,
): FestivalActivityRepresentation {
  if (isDraft(activity)) {
    return Draft.castActivityWithDate(activity);
  }
  return InReview.castActivityWithDate(activity);
}

function isDraft(
  festivalActivity: HttpStringified<FestivalActivityRepresentation>,
): festivalActivity is HttpStringified<DraftFestivalActivityRepresentation> {
  return festivalActivity.status === DRAFT;
}
