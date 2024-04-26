import { IProvidePeriod } from "@overbookd/period";
import { Context } from "../context";
import { AssignableVolunteer, Friends } from "@overbookd/assignment";

export type FriendsRepositoryContext = Context & {
  $accessor: {
    assignTaskToVolunteer: {
      assignableVolunteers: AssignableVolunteer[];
      selectedVolunteer: AssignableVolunteer | null;
    };
  };
};
export class FriendsRepository implements Friends {
  constructor(private readonly context: FriendsRepositoryContext) {}

  async availableDuringWith(
    period: IProvidePeriod,
    volunteer: number,
  ): Promise<AssignableVolunteer[]> {
    const { assignTaskToVolunteer } = this.context.$accessor;
    const selectedVolunteer = assignTaskToVolunteer.assignableVolunteers.find(
      ({ id }) => id === volunteer,
    );
    if (!selectedVolunteer) return Promise.resolve([]);

    const assignableFriends = assignTaskToVolunteer.assignableVolunteers.filter(
      ({ id }) => selectedVolunteer.assignableFriendsIds.includes(id),
    );
    return Promise.resolve(assignableFriends);
  }
}
