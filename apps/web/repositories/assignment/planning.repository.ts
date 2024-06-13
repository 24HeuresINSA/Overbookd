import type { Planning, PlanningEvent } from "@overbookd/assignment";
import type { HttpStringified } from "@overbookd/http";
import { HttpClient } from "~/utils/http/http-client";
import { isSuccess } from "~/utils/http/api-fetch";
import { castPeriodWithDate } from "~/utils/http/period";

export class AssignmentPlanningRepository implements Planning {
  private readonly basePath = "assignments/volunteers";

  async for(volunteer: number): Promise<PlanningEvent[]> {
    const res = await HttpClient.get<PlanningEvent[]>(
      `${this.basePath}/${volunteer}/planning`,
    );

    if (!isSuccess(res)) throw res;
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
