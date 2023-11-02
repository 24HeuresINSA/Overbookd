import { updateItemToList } from "@overbookd/list";
import { FestivalActivity, InReview } from "../festival-activity";
import { FestivalActivityNotFound } from "../festival-activity.error";
import { AskForReviewFestivalActivityRepository } from "./ask-for-review";

export class InMemoryAskForReviewFestivalActivityRepository
  implements AskForReviewFestivalActivityRepository
{
  constructor(private festivalActivities: FestivalActivity[]) {}

  findById(id: number): Promise<FestivalActivity | null> {
    const festivalActivity = this.festivalActivities.find(
      (festivalActivity) => festivalActivity.id === id,
    );
    if (!festivalActivity) return Promise.resolve(null);

    return Promise.resolve(festivalActivity);
  }
  save(festivalActivity: InReview): Promise<InReview> {
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
