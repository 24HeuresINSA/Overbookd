import type { BreakPeriods } from "@overbookd/assignment";
import type { IProvidePeriod } from "@overbookd/period";
import { castPeriodsWithDate } from "~/utils/http/period";
import { isHttpError } from "~/utils/http/api-fetch";

export class BreakPeriodsRepository implements BreakPeriods {
  async for(volunteer: number): Promise<IProvidePeriod[]> {
    const res = await PlanningRepository.getBreakPeriods(volunteer);

    if (isHttpError(res)) throw res;
    return castPeriodsWithDate(res);
  }
}
