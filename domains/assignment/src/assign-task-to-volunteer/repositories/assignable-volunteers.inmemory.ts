import { IProvidePeriod } from "@overbookd/period";
import { AssignableVolunteers } from "../assign-task-to-volunteer";
import { StoredAssignableVolunteer } from "../assignable-volunteer";
import { Category } from "@overbookd/festival-event-constants";

export class InMemoryAssignableVolunteers implements AssignableVolunteers {
  constructor(private volunteers: StoredAssignableVolunteer[]) {}

  on(
    period: IProvidePeriod,
    oneOfTheTeams: string[],
    category?: Category,
  ): Promise<StoredAssignableVolunteer[]> {
    return Promise.resolve(
      this.volunteers
        .filter((volunteer) => {
          return oneOfTheTeams.some((team) => volunteer.teams.includes(team));
        })
        .map((volunteer) => {
          const assignments = volunteer.assignments.filter((assignment) => {
            return assignment.category === category;
          });
          return { ...volunteer, assignments };
        }),
    );
  }
}
