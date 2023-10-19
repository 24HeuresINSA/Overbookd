import { DraftFestivalActivity } from "../creation/draft-festival-activity";
import {
  FestivalActivity,
  FestivalActivityRepresentation,
} from "../festival-activity.model";
import { FestivalActivityRepository } from "./prepare-festival-activity";
import { updateItemToList } from "@overbookd/list";

export class InMemoryFestivalActivityRepository
  implements FestivalActivityRepository
{
  constructor(private festivalActivities: FestivalActivityRepresentation[]) {}

  find(id: number): Promise<FestivalActivity> {
    const festivalActivity = this.festivalActivities.find(
      (festivalActivity) => festivalActivity.id === id,
    );
    if (!festivalActivity) throw new Error("Festival activity not found");
    const draftFestivalActivity = DraftFestivalActivity.build(festivalActivity);

    return Promise.resolve(draftFestivalActivity);
  }

  save(festivalActivity: FestivalActivity): Promise<DraftFestivalActivity> {
    const festivalActivityIndex = this.festivalActivities.findIndex(
      (festivalActivityToUpdate) =>
        festivalActivityToUpdate.id === festivalActivity.id,
    );
    if (festivalActivityIndex == -1) {
      throw new Error("Festival activity not found");
    }
    this.festivalActivities = updateItemToList(
      this.festivalActivities,
      festivalActivityIndex,
      festivalActivity,
    );
    return Promise.resolve(festivalActivity);
  }
}
