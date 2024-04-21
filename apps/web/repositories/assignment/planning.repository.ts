import { Planning } from "@overbookd/assignment";
import { PlanningEvent } from "@overbookd/assignment/src/assign-task-to-volunteer/funnel/planning";
import { Context } from "../context";
import { HttpStringified } from "@overbookd/http";

export class PlanningRepository implements Planning {
  private readonly basePath = "assignments/planning";

  constructor(private readonly context: Context) {}

  async for(volunteer: number): Promise<PlanningEvent[]> {
    const res = await this.context.$axios.get<HttpStringified<PlanningEvent[]>>(
      `${this.basePath}/${volunteer}`,
    );
    return castWithDate(res.data);
  }
}

function castWithDate(
  planningEvents: HttpStringified<PlanningEvent[]>,
): PlanningEvent[] {
  return planningEvents.map((planningEvent) => ({
    ...planningEvent,
    start: new Date(planningEvent.start),
    end: new Date(planningEvent.end),
  }));
}
