import { Period } from "@overbookd/period";
import { Friends } from "./planning";
import { Volunteer } from "./volunteer";

export class InMemoryFriends implements Friends {
  constructor(private friends: Map<Volunteer["id"], Volunteer[]>) {}

  availableDuringWith(
    period: Period,
    volunteer: Volunteer["id"],
  ): Promise<Volunteer[]> {
    return Promise.resolve(this.friends.get(volunteer) ?? []);
  }
}
