import { Period } from "@overbookd/period";
import { Friends } from "./planning";
import { AssignableVolunteer } from "../assignable-volunteer";

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
