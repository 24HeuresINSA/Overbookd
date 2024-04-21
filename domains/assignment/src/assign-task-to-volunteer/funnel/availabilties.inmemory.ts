import { IProvidePeriod } from "@overbookd/period";
import { Availabilities } from "./planning";
import { Volunteer } from "./volunteer";

export class InMemoryAvailabilities implements Availabilities {
  constructor(private availabilities: Map<Volunteer["id"], IProvidePeriod[]>) {}

  for(volunteer: Volunteer["id"]): Promise<IProvidePeriod[]> {
    return Promise.resolve(this.availabilities.get(volunteer) ?? []);
  }
}
