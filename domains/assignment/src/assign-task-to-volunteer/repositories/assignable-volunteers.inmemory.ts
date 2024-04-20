import {
  AssignableVolunteers,
  AssignmentSpecification,
  MobilizationIdentifier,
} from "../assign-task-to-volunteer";
import { StoredAssignableVolunteer } from "../assignable-volunteer";

export class InMemoryAssignableVolunteers implements AssignableVolunteers {
  constructor(private volunteers: StoredAssignableVolunteer[]) {}

  on(
    mobilizationIdentifier: MobilizationIdentifier,
    { oneOfTheTeams, category }: AssignmentSpecification,
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
