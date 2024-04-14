import { IProvidePeriod } from "@overbookd/period";
import { AssignableVolunteers } from "../assign-task-to-volunteer";
import { StoredAssignableVolunteer } from "../assignable-volunteer";

export class InMemoryAssignableVolunteers implements AssignableVolunteers {
  constructor(private volunteers: StoredAssignableVolunteer[]) {}

  on(
    period: IProvidePeriod,
    oneOfTheTeams: string[],
  ): Promise<StoredAssignableVolunteer[]> {
    return Promise.resolve(
      this.volunteers.filter((volunteer) => {
        return oneOfTheTeams.some((team) => volunteer.teams.includes(team));
      }),
    );
  }
}
