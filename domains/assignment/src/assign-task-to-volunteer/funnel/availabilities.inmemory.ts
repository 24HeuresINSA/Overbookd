import { IProvidePeriod } from "@overbookd/time";
import { AssignableVolunteer } from "../assignable-volunteer.js";
import { Availabilities } from "./planning.js";

export class InMemoryAvailabilities implements Availabilities {
  constructor(
    private availabilities: Map<AssignableVolunteer["id"], IProvidePeriod[]>,
  ) {}

  for(volunteer: AssignableVolunteer["id"]): Promise<IProvidePeriod[]> {
    return Promise.resolve(this.availabilities.get(volunteer) ?? []);
  }
}
