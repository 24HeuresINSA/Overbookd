import { GeneralSection } from "../creation/draft-festival-activity";
import { FestivalActivity } from "../festival-activity.model";
import { FestivalActivityRepository } from "../festival-activity.repository";

export class PrepareFestivalActivity {
  constructor(
    private readonly festivalActivities: FestivalActivityRepository,
  ) {}

  async updateGeneralSection(
    id: number,
    generalSection: Partial<GeneralSection>,
  ): Promise<FestivalActivity> {
    const existingFA = await this.festivalActivities.findById(id);
    if (!existingFA) throw new Error("Festival activity not found");

    const updatedFA = existingFA.changeGeneralSection(generalSection);

    return this.festivalActivities.save(updatedFA);
  }
}
