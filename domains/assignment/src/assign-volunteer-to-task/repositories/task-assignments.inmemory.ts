import { Period } from "@overbookd/period";
import { TaskAssignments } from "../assign-volunteer-to-task";
import { TaskAssignment, TaskAssignmentForVolunteer } from "../task-assignment";

export class InMemoryTaskAssignments implements TaskAssignments {
  constructor(private assignments: TaskAssignment[]) {}

  async findAssignableFor(
    volunteerAssignments: Period[],
    oneOfTheTeams: string[],
  ): Promise<TaskAssignmentForVolunteer[]> {
    return this.assignments
      .filter((assignment) => {
        const isAssignedAtSameTime = volunteerAssignments.some((period) =>
          period.isOverlapping(Period.init(assignment)),
        );
        const isOnOneOfTheTeams = oneOfTheTeams.some((team) =>
          assignment.demands.some((demand) => demand.team === team),
        );
        return !isAssignedAtSameTime && isOnOneOfTheTeams;
      })
      .map((assignment) => ({ ...assignment, hasFriendsAssigned: false }));
  }

  get all() {
    return this.assignments;
  }
}
