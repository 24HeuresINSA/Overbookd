import type { BreakPeriods } from "@overbookd/assignment";
import type { IProvidePeriod } from "@overbookd/period";
import { castPeriodsWithDate } from "~/utils/http/period";
import { isSuccess } from "~/utils/http/api-fetch";

export class BreakPeriodsRepository implements BreakPeriods {
  async for(volunteer: number): Promise<IProvidePeriod[]> {
    const res = await PlanningRepository.getBreakPeriods(volunteer);

    if (!isSuccess(res)) throw res;
    return castPeriodsWithDate(res);
  }
}
