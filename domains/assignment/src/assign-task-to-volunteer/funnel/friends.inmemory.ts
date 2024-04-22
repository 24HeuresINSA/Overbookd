import { Friends } from "./planning";
import { Volunteer } from "./volunteer";

export class InMemoryFriends implements Friends {
  constructor(private plannings: Map<Volunteer["id"], Volunteer[]>) {}

  for(volunteer: Volunteer["id"]): Promise<Volunteer[]> {
    return Promise.resolve(this.plannings.get(volunteer) ?? []);
  }
}
