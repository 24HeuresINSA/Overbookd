import {
  AssignableVolunteers,
  AssignmentSpecification,
} from "../assign-task-to-volunteer";
import { StoredAssignableVolunteer } from "../assignable-volunteer";
import { TaskIdentifier } from "../task";

export class InMemoryAssignableVolunteers implements AssignableVolunteers {
  constructor(private volunteers: StoredAssignableVolunteer[]) {}

  on(
    taskId: TaskIdentifier["id"],
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
