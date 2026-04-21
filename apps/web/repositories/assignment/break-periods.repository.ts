import type {
  AssignmentBreakPeriods,
  BreakPeriod,
} from "@overbookd/assignment";
import { isHttpError } from "~/utils/http/http-error.utils";
import { PlanningRepository } from "../planning.repository";
import { castBreakPeriodWithDate } from "~/utils/http/cast-date/planning.utils";

export class BreakPeriodsRepository implements AssignmentBreakPeriods {
  async for(volunteer: number): Promise<BreakPeriod[]> {
    const res = await PlanningRepository.getBreakPeriods(volunteer);
    if (isHttpError(res)) throw res;
    return res.map(castBreakPeriodWithDate);
  }
}
