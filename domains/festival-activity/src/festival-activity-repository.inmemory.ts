import { FestivalActivityRepository } from "./festival-activity.repository";
import { updateItemToList } from "@overbookd/list";
import { DraftFestivalActivity } from "./creation/draft-festival-activity";
import {
  FestivalActivityFactory,
  CreateFestivalActivity,
} from "./creation/festival-activity.factory";
import {
  FestivalActivity,
  PreviewFestivalActivity,
} from "./festival-activity.model";
import { FestivalActivityNotFound } from "./festival-activity.error";

export class InMemoryFestivalActivityRepository
  implements FestivalActivityRepository
{
  festivalActivityFactory: FestivalActivityFactory;

  constructor(private festivalActivities: FestivalActivity[] = []) {
    this.festivalActivityFactory = new FestivalActivityFactory();
  }

  findAll(): Promise<PreviewFestivalActivity[]> {
    return Promise.resolve(
      this.festivalActivities.map((festivalActivity) => ({
        id: festivalActivity.id,
        name: festivalActivity.general.name,
        status: festivalActivity.status,
        adherent: festivalActivity.inCharge.adherent,
        team: festivalActivity.inCharge.team,
      })),
    );
  }

  findById(id: number): Promise<FestivalActivity | null> {
    const festivalActivity = this.festivalActivities.find(
      (festivalActivity) => festivalActivity.id === id,
    );
    if (!festivalActivity) return Promise.resolve(null);

    return Promise.resolve(festivalActivity);
  }

  create(form: CreateFestivalActivity): Promise<DraftFestivalActivity> {
    const festivalActivity = this.festivalActivityFactory.create(form);
    this.festivalActivities = [...this.festivalActivities, festivalActivity];
    return Promise.resolve(festivalActivity);
  }

  save<T extends FestivalActivity>(festivalActivity: T): Promise<T> {
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
