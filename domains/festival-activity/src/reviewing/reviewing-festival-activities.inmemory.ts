import { FestivalActivity, Reviewable } from "../festival-activity";
import { FestivalActivityNotFound } from "../festival-activity.error";
import { updateItemToList } from "@overbookd/list";
import { ReviewingFestivalActivities } from "./reviewing";

export class InMemoryReviewingFestivalActivities
  implements ReviewingFestivalActivities
{
  constructor(private festivalActivities: FestivalActivity[]) {}

  findById(id: number): Promise<FestivalActivity | null> {
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
    if (festivalActivityIndex == -1)
      throw new FestivalActivityNotFound(festivalActivity.id);

    this.festivalActivities = updateItemToList(
      this.festivalActivities,
      festivalActivityIndex,
      festivalActivity,
    );
    return Promise.resolve(festivalActivity);
  }
}
