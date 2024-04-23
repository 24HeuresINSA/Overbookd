import { Period } from "@overbookd/period";
import { TaskAssignments } from "../assign-volunteer-to-task";
import { Assignment } from "../../common/assignment";

export class InMemoryTaskAssignments implements TaskAssignments {
  constructor(private assignments: Assignment[]) {}

  async findAssignableFor(
    volunteerAssignments: Period[],
    oneOfTheTeams: string[],
  ): Promise<Assignment[]> {
    return this.assignments.filter((assignment) => {
      const isAssignedAtSameTime = volunteerAssignments.some((period) =>
        period.isOverlapping(Period.init(assignment)),
      );
      const isOnOneOfTheTeams = oneOfTheTeams.some((team) =>
        assignment.demands.some((demand) => demand.team === team),
      );
      return !isAssignedAtSameTime && isOnOneOfTheTeams;
    });
  }

  get all() {
    return this.assignments;
  }
}
