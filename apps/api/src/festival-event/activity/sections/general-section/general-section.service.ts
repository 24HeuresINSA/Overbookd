import { Injectable } from "@nestjs/common";
import type {
  FestivalActivity,
  PrepareGeneralUpdate,
  TimeWindow,
} from "@overbookd/festival-event";
import { PrepareFestivalActivity } from "@overbookd/festival-event";
import type { IProvidePeriod } from "@overbookd/time";

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
