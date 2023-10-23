import { DRAFT } from "./festival-activity.core";
import { DraftFestivalActivity } from "./creation/draft-festival-activity";
import { DraftFestivalActivityRepresentation } from "./creation/draft-festival-activity.model";
import {
  InReviewFestivalActivity,
  InReviewFestivalActivityRepresentation,
} from "./ask-for-review/in-review-festival-activity";

export type FestivalActivity = DraftFestivalActivity | InReviewFestivalActivity;

export type FestivalActivityRepresentation =
  | DraftFestivalActivityRepresentation
  | InReviewFestivalActivityRepresentation;

export type PreviewFestivalActivity = {
  id: FestivalActivityRepresentation["id"];
  name: FestivalActivityRepresentation["general"]["name"];
  status: FestivalActivityRepresentation["status"];
  adherent: FestivalActivityRepresentation["inCharge"]["adherent"];
  team: FestivalActivityRepresentation["inCharge"]["team"];
};

export type CreateFestivalActivityForm = {
  name: string;
};

export function isDraft(
  festivalActivity: FestivalActivity,
): festivalActivity is DraftFestivalActivity {
  return festivalActivity.status === DRAFT;
}
