import { updateItemToList } from "@overbookd/list";
import {
  PreviewFestivalActivity,
  FestivalActivity,
} from "../festival-activity";
import { FestivalActivityNotFound } from "../festival-activity.error";
import {
  PrepareFestivalActivityRepository,
  generatePreview,
} from "./prepare-festival-activity";

export class InMemoryPrepareFestivalActivityRepository
  implements PrepareFestivalActivityRepository
{
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
