import { GeneralSection } from "../creation/draft-festival-activity";
import {
  FestivalActivity,
  FestivalActivityRepresentation,
} from "../festival-activity.model";

export interface FestivalActivityRepository {
  find(id: number): Promise<FestivalActivity>;
  save(festivalActivity: FestivalActivity): Promise<FestivalActivity>;
}

export class PrepareFestivalActivity {
  constructor(
    private readonly festivalActivities: FestivalActivityRepository,
  ) {}

  async updateGeneralSection(
    id: number,
    generalSection: Partial<GeneralSection>,
  ): Promise<FestivalActivityRepresentation> {
    const existingFA = await this.festivalActivities.find(id);

    const updatedFA = existingFA.changeGeneralSection(generalSection);

    return this.festivalActivities.save(updatedFA);
  }
}
