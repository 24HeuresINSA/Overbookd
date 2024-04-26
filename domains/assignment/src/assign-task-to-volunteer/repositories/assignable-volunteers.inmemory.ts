import {
  AssignableVolunteers,
  AssignmentSpecification,
} from "../assign-task-to-volunteer";
import { StoredAssignableVolunteer } from "../assignable-volunteer";
import { AssignmentIdentifier } from "../assignment";

export class InMemoryAssignableVolunteers implements AssignableVolunteers {
  constructor(private volunteers: StoredAssignableVolunteer[]) {}

  on(
    assignmentIdentifier: AssignmentIdentifier,
    { oneOfTheTeams }: AssignmentSpecification,
  ): Promise<StoredAssignableVolunteer[]> {
    return Promise.resolve(
      this.volunteers.filter((volunteer) => {
        return oneOfTheTeams.some((team) => volunteer.teams.includes(team));
      }),
    );
  }
}
