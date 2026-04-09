import { Period } from "@overbookd/time";
import { AssignableVolunteer } from "../assignable-volunteer.js";
import { Friends } from "./planning.js";

export class InMemoryFriends implements Friends {
  constructor(
    private friends: Map<AssignableVolunteer["id"], AssignableVolunteer[]>,
  ) {}

  availableDuringWith(
    _period: Period,
    volunteer: AssignableVolunteer["id"],
  ): Promise<AssignableVolunteer[]> {
    return Promise.resolve(this.friends.get(volunteer) ?? []);
  }
}
