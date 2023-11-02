import { FestivalActivityRepository } from "./festival-activity.repository";
import { updateItemToList } from "@overbookd/list";
import { DraftFestivalActivity } from "./preparation/draft-festival-activity";
import {
  CreateFestivalActivity,
  FestivalActivityCreationForm,
} from "./creation/creation";
import { FestivalActivityNotFound } from "./festival-activity.error";
import { FestivalActivity, PreviewFestivalActivity } from "./festival-activity";

export class InMemoryFestivalActivityRepository
  implements FestivalActivityRepository
{
  festivalActivityCreation: CreateFestivalActivity;

  constructor(private festivalActivities: FestivalActivity[] = []) {
    this.festivalActivityCreation = new CreateFestivalActivity();
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

  create(form: FestivalActivityCreationForm): Promise<DraftFestivalActivity> {
    const builder = this.festivalActivityCreation.create(form);
    const festivalActivity = DraftFestivalActivity.build(builder);
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
