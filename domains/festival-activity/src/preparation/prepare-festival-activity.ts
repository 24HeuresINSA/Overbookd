import { GeneralSection } from "../creation/draft-festival-activity";
import { FestivalActivityRepresentation } from "../festival-activity.model";

export interface FestivalActivityRepository {
  saveGeneralSection(
    id: number,
    generalSection: Partial<GeneralSection>,
  ): Promise<FestivalActivityRepresentation>;
}

export class PrepareFestivalActivity {
  constructor(
    private readonly festivalActivities: FestivalActivityRepository,
  ) {}

  updateGeneralSection(
    id: number,
    generalSection: Partial<GeneralSection>,
  ): Promise<FestivalActivityRepresentation> {
    if (generalSection.toPublish === false) {
      generalSection.photoLink = null;
      generalSection.isFlagship = false;
    }

    return this.festivalActivities.saveGeneralSection(id, generalSection);
  }
}
