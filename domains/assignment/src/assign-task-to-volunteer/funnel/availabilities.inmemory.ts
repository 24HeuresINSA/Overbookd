import { IProvidePeriod } from "@overbookd/period";
import { Availabilities } from "./planning.js";
import { AssignableVolunteer } from "../assignable-volunteer.js";

export class InMemoryAvailabilities implements Availabilities {
  constructor(
    private availabilities: Map<AssignableVolunteer["id"], IProvidePeriod[]>,
  ) {}

  for(volunteer: AssignableVolunteer["id"]): Promise<IProvidePeriod[]> {
    return Promise.resolve(this.availabilities.get(volunteer) ?? []);
  }
}
