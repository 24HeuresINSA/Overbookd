import type { Planning, PlanningEvent } from "@overbookd/assignment";
import type { HttpStringified } from "@overbookd/http";
import { HttpClient } from "~/utils/http/http-client";
import { isHttpError } from "~/utils/http/http-error.utils";
import { castPeriodWithDate } from "~/utils/http/period";

export class AssignmentPlanningRepository implements Planning {
  private readonly basePath = "assignments/volunteers";

  async for(volunteer: number): Promise<PlanningEvent[]> {
    const res = await HttpClient.get<PlanningEvent[]>(
      `${this.basePath}/${volunteer}/planning`,
    );

    if (isHttpError(res)) throw res;
    return castPlanningEventsWithDate(res);
  }
}

export function castPlanningEventsWithDate(
  planningEvents: HttpStringified<PlanningEvent[]>,
): PlanningEvent[] {
  return planningEvents.map((planningEvent) => ({
    ...planningEvent,
    ...castPeriodWithDate(planningEvent),
  }));
}
