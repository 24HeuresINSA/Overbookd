import type { BreakPeriods } from "@overbookd/assignment";
import type { IProvidePeriod } from "@overbookd/time";
import { castPeriodsWithDate } from "~/utils/http/cast-date/period.utils";
import { isHttpError } from "~/utils/http/http-error.utils";
import { PlanningRepository } from "../planning.repository";

export class BreakPeriodsRepository implements BreakPeriods {
  async for(volunteer: number): Promise<IProvidePeriod[]> {
    const res = await PlanningRepository.getBreakPeriods(volunteer);

    if (isHttpError(res)) throw res;
    return castPeriodsWithDate(res);
  }
}
