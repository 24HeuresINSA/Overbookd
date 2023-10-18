import {
  GeneralSection,
  DraftFestivalActivityRepresentation,
} from "../creation/draft-festival-activity";
import { FestivalActivityRepresentation } from "../festival-activity.model";
import { FestivalActivityRepository } from "./prepare-festival-activity";

export class InMemoryFestivalActivityRepository
  implements FestivalActivityRepository
{
  constructor(private festivalActivities: FestivalActivityRepresentation[]) {}

  saveGeneralSection(
    id: number,
    generalSection: Partial<GeneralSection>,
  ): Promise<DraftFestivalActivityRepresentation> {
    const festivalActivityToUpdate = this.festivalActivities.find(
      (festivalActivity) => festivalActivity.id === id,
    );
    if (!festivalActivityToUpdate)
      throw new Error("Festival activity not found");

    const updatedFestivalActivity = {
      ...festivalActivityToUpdate,
      general: {
        ...festivalActivityToUpdate.general,
        ...generalSection,
      },
    };

    this.festivalActivities = this.festivalActivities.map((festivalActivity) =>
      festivalActivity.id === id ? updatedFestivalActivity : festivalActivity,
    );

    return Promise.resolve(updatedFestivalActivity);
  }
}
