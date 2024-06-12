import {
  AssignableVolunteers,
  AssignmentSpecification,
} from "../assign-task-to-volunteer.js";
import { StoredAssignableVolunteer } from "../assignable-volunteer.js";
import { AssignmentIdentifier } from "../assignment.js";

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
