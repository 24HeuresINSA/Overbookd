import { Injectable } from "@nestjs/common";
import {
  FestivalActivity,
  PrepareFestivalActivity,
  PrepareGeneralUpdate,
  TimeWindow,
} from "@overbookd/festival-activity";

import { IProvidePeriod } from "@overbookd/period";

@Injectable()
export class GeneralSectionService {
  constructor(private readonly prepare: PrepareFestivalActivity) {}

  saveGeneralSection(
    id: FestivalActivity["id"],
    general: PrepareGeneralUpdate,
  ): Promise<FestivalActivity> {
    return this.prepare.updateGeneralSection(id, general);
  }

  addGeneralTimeWindow(
    id: FestivalActivity["id"],
    timeWindow: IProvidePeriod,
  ): Promise<FestivalActivity> {
    return this.prepare.addTimeWindowInGeneral(id, timeWindow);
  }

  removeGeneralTimeWindow(
    faId: FestivalActivity["id"],
    timeWindowId: TimeWindow["id"],
  ): Promise<FestivalActivity> {
    return this.prepare.removeTimeWindowFromGeneral(faId, timeWindowId);
  }
}
