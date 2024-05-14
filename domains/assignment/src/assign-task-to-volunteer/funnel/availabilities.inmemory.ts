import { IProvidePeriod } from "@overbookd/period";
import { Availabilities } from "./planning";
import { AssignableVolunteer } from "../assignable-volunteer";

export class InMemoryAvailabilities implements Availabilities {
  constructor(
    private availabilities: Map<AssignableVolunteer["id"], IProvidePeriod[]>,
  ) {}

  for(volunteer: AssignableVolunteer["id"]): Promise<IProvidePeriod[]> {
    return Promise.resolve(this.availabilities.get(volunteer) ?? []);
  }
}
