import type { IProvidePeriod } from "@overbookd/time";
import type { AssignableVolunteer, Friends } from "@overbookd/assignment";
import { useAssignTaskToVolunteerStore } from "~/stores/assignment/assignTaskToVolunteer";

export class FriendsRepository implements Friends {
  async availableDuringWith(
    period: IProvidePeriod,
    volunteer: number,
  ): Promise<AssignableVolunteer[]> {
    const assignTaskToVolunteer = useAssignTaskToVolunteerStore();
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