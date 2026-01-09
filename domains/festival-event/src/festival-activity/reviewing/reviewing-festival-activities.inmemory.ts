import { FestivalActivity, Reviewable } from "../festival-activity.js";
import { FestivalActivityNotFound } from "../festival-activity.error.js";
import { updateItemToList } from "@overbookd/list";
import { ReviewingFestivalActivities } from "./reviewing.js";

export class InMemoryReviewingFestivalActivities implements ReviewingFestivalActivities {
  constructor(private festivalActivities: FestivalActivity[]) {}

  findById(id: number): Promise<FestivalActivity | null> {
    const festivalActivity = this.festivalActivities.find(
      (festivalActivity) => festivalActivity.id === id,
    );
    return Promise.resolve(festivalActivity ?? null);
  }
  save<T extends Reviewable>(festivalActivity: T): Promise<T> {
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
