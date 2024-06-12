import { AssignableVolunteer } from "../assignable-volunteer.js";
import { Planning, PlanningEvent } from "./planning.js";

export class InMemoryPlanning implements Planning {
  constructor(
    private plannings: Map<AssignableVolunteer["id"], PlanningEvent[]>,
  ) {}

  for(volunteer: AssignableVolunteer["id"]): Promise<PlanningEvent[]> {
    return Promise.resolve(this.plannings.get(volunteer) ?? []);
  }
}
