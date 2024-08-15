import { Period } from "@overbookd/time";
import { Friends } from "./planning.js";
import { AssignableVolunteer } from "../assignable-volunteer.js";

export class InMemoryFriends implements Friends {
  constructor(
    private friends: Map<AssignableVolunteer["id"], AssignableVolunteer[]>,
  ) {}

  availableDuringWith(
    period: Period,
    volunteer: AssignableVolunteer["id"],
  ): Promise<AssignableVolunteer[]> {
    return Promise.resolve(this.friends.get(volunteer) ?? []);
  }
}
