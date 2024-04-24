import { AssignableVolunteer } from "../assignable-volunteer";
import { Planning, PlanningEvent } from "./planning";

export class InMemoryPlanning implements Planning {
  constructor(
    private plannings: Map<AssignableVolunteer["id"], PlanningEvent[]>,
  ) {}

  for(volunteer: AssignableVolunteer["id"]): Promise<PlanningEvent[]> {
    return Promise.resolve(this.plannings.get(volunteer) ?? []);
  }
}
