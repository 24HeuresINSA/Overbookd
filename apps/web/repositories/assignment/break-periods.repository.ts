import { Context } from "../context";
import { HttpStringified } from "@overbookd/http";
import { BreakPeriods } from "@overbookd/assignment";
import { IProvidePeriod } from "@overbookd/period";
import { castPeriodWithDate } from "~/utils/http/period";
import { PlanningRepository } from "../planning.repository";

export class BreakPeriodsRepository implements BreakPeriods {
  constructor(private readonly context: Context) {}

  async for(volunteer: number): Promise<IProvidePeriod[]> {
    const res = await PlanningRepository.getBreakPeriods(
      this.context,
      volunteer,
    );

    return castWithDate(res.data);
  }
}

function castWithDate(
  availabilities: HttpStringified<IProvidePeriod[]>,
): IProvidePeriod[] {
  return availabilities.map(castPeriodWithDate);
}
