import { PlanningEvent } from "./candidate";
import { Volunteer } from "./volunteer";
import { Planning } from "./planning";



export class InMemoryPlanning implements Planning {
  constructor(private plannings: Map<Volunteer["id"], PlanningEvent[]>) { }

  for(volunteer: Volunteer["id"]): Promise<PlanningEvent[]> {
    return Promise.resolve(this.plannings.get(volunteer) ?? []);
  }
}
