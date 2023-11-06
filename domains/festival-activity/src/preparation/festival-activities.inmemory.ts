import { updateItemToList } from "@overbookd/list";
import {
  PreviewFestivalActivity,
  FestivalActivity,
  isDraft,
  NOT_ASKING_TO_REVIEW,
} from "../festival-activity";
import { FestivalActivityNotFound } from "../festival-activity.error";
import { PrepareFestivalActivityRepository } from "./prepare-festival-activity";
import { Reviewer } from "../ask-for-review/waiting-for-review";

type DraftReview = Record<Reviewer, typeof NOT_ASKING_TO_REVIEW>;

const DRAFT_REVIEWS: DraftReview = {
  humain: NOT_ASKING_TO_REVIEW,
  signa: NOT_ASKING_TO_REVIEW,
  secu: NOT_ASKING_TO_REVIEW,
  matos: NOT_ASKING_TO_REVIEW,
  elec: NOT_ASKING_TO_REVIEW,
  barrieres: NOT_ASKING_TO_REVIEW,
  comcom: NOT_ASKING_TO_REVIEW,
};

export class InMemoryPrepareFestivalActivityRepository
  implements PrepareFestivalActivityRepository
{
  constructor(private festivalActivities: FestivalActivity[] = []) {}

  findAll(): Promise<PreviewFestivalActivity[]> {
    return Promise.resolve(
      this.festivalActivities.map((festivalActivity) => {
        const reviews = isDraft(festivalActivity)
          ? DRAFT_REVIEWS
          : festivalActivity.reviews;

        return {
          id: festivalActivity.id,
          name: festivalActivity.general.name,
          status: festivalActivity.status,
          adherent: festivalActivity.inCharge.adherent,
          team: festivalActivity.inCharge.team,
          reviews,
        };
      }),
    );
  }

  findById(id: number): Promise<FestivalActivity | null> {
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
