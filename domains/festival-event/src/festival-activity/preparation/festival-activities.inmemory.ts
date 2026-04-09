import {
  IN_REVIEW,
  REFUSED,
  VALIDATED,
} from "@overbookd/festival-event-constants";
import { updateItemToList } from "@overbookd/list";
import { isRefusedReviews, isValidatedReviews } from "../../common/review.js";
import { isDraft } from "../../festival-event.js";
import { FestivalActivityNotFound } from "../festival-activity.error.js";
import {
  Draft,
  FestivalActivity,
  PreviewDraft,
  PreviewFestivalActivity,
  PreviewReviewable,
  Reviewable,
} from "../festival-activity.js";
import { PrepareFestivalActivityRepository } from "./prepare-festival-activity.js";

export class InMemoryPrepareFestivalActivityRepository implements PrepareFestivalActivityRepository {
  constructor(private festivalActivities: FestivalActivity[] = []) {}

  findAll(): Promise<PreviewFestivalActivity[]> {
    return Promise.resolve(this.festivalActivities.map(generatePreview));
  }

  findById(id: FestivalActivity["id"]): Promise<FestivalActivity | null> {
    const festivalActivity = this.festivalActivities.find(
      (festivalActivity) => festivalActivity.id === id,
    );
    if (!festivalActivity) return Promise.resolve(null);

    return Promise.resolve(festivalActivity);
  }

  save(activity: FestivalActivity): Promise<FestivalActivity> {
    const festivalActivityIndex = this.festivalActivities.findIndex(
      (festivalActivityToUpdate) => festivalActivityToUpdate.id === activity.id,
    );
    if (festivalActivityIndex == -1)
      throw new FestivalActivityNotFound(activity.id);

    this.festivalActivities = updateItemToList(
      this.festivalActivities,
      festivalActivityIndex,
      activity,
    );
    return Promise.resolve(activity);
  }
}

function generatePreview<T extends FestivalActivity>(
  festivalActivity: T,
): PreviewFestivalActivity {
  return isDraft<FestivalActivity>(festivalActivity)
    ? generateDraftPreview(festivalActivity)
    : generateInReviewPreview(festivalActivity);
}

function generateInReviewPreview(
  festivalActivity: Reviewable,
): PreviewReviewable {
  const supply = festivalActivity.supply;
  const base = {
    id: festivalActivity.id,
    name: festivalActivity.general.name,
    adherent: festivalActivity.inCharge.adherent,
    team: festivalActivity.inCharge.team,
    needSupply: supply.electricity.length > 0 || !!supply.water,
  };
  const { reviews } = festivalActivity;

  if (isValidatedReviews(reviews)) {
    return { ...base, reviews, status: VALIDATED };
  }
  if (isRefusedReviews(reviews)) {
    return { ...base, reviews, status: REFUSED };
  }

  return { ...base, reviews, status: IN_REVIEW };
}

function generateDraftPreview(festivalActivity: Draft): PreviewDraft {
  const supply = festivalActivity.supply;
  return {
    id: festivalActivity.id,
    name: festivalActivity.general.name,
    status: festivalActivity.status,
    adherent: festivalActivity.inCharge.adherent,
    team: festivalActivity.inCharge.team,
    needSupply: supply.electricity.length > 0 || !!supply.water,
  };
}
