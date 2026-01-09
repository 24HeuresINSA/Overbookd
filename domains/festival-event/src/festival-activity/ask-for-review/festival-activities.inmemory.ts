import { updateItemToList } from "@overbookd/list";
import { FestivalActivity, Reviewable } from "../festival-activity.js";
import { FestivalActivityNotFound } from "../festival-activity.error.js";
import { AskForReviewFestivalActivityRepository } from "./ask-for-review.js";

export class InMemoryAskForReviewFestivalActivityRepository implements AskForReviewFestivalActivityRepository {
  constructor(private festivalActivities: FestivalActivity[]) {}

  findById(id: FestivalActivity["id"]): Promise<FestivalActivity | null> {
    const festivalActivity = this.festivalActivities.find(
      (festivalActivity) => festivalActivity.id === id,
    );

    return Promise.resolve(festivalActivity ?? null);
  }

  save(festivalActivity: Reviewable): Promise<Reviewable> {
    const festivalActivityIndex = this.festivalActivities.findIndex(
      (festivalActivityToUpdate) =>
        festivalActivityToUpdate.id === festivalActivity.id,
    );
    if (festivalActivityIndex === -1) {
      throw new FestivalActivityNotFound(festivalActivity.id);
    }

    this.festivalActivities = updateItemToList(
      this.festivalActivities,
      festivalActivityIndex,
      festivalActivity,
    );
    return Promise.resolve(festivalActivity);
  }
}
