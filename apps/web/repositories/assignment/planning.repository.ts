import { Planning, PlanningEvent } from "@overbookd/assignment";
import { Context } from "../context";
import { HttpStringified } from "@overbookd/http";

export class PlanningRepository implements Planning {
  private readonly basePath = "assignments/planning";

  constructor(private readonly context: Context) {}

  async for(volunteer: number): Promise<PlanningEvent[]> {
    const res = await this.context.$axios.get<HttpStringified<PlanningEvent[]>>(
      `${this.basePath}/${volunteer}`,
    );
    return castPlanningEventsWithDate(res.data);
  }
}

export function castPlanningEventsWithDate(
  planningEvents: HttpStringified<PlanningEvent[]>,
): PlanningEvent[] {
  return planningEvents.map((planningEvent) => ({
    ...planningEvent,
    start: new Date(planningEvent.start),
    end: new Date(planningEvent.end),
  }));
}
