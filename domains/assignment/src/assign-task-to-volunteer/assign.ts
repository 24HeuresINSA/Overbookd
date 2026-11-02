import { Period } from "@overbookd/time";
import { Volunteers } from "../assign-volunteer-to-task/assign-volunteer-to-task.js";
import { Assignment, TeamMember } from "./assignment.js";
import { assertCanBeAssignedOn } from "./assignable-on-period.js";
import { Availabilities, BreakPeriods } from "./funnel/planning.js";
import { Assignments } from "./repositories/assignments.js";

export class Assign {
  constructor(
    private readonly assignments: Assignments,
    private readonly allVolunteers: Volunteers,
    private readonly availabilities: Availabilities,
    private readonly breakPeriods: BreakPeriods,
  ) {}

  async volunteers(
    assignment: Assignment,
    volunteers: TeamMember[],
  ): Promise<Assignment> {
    const period = Period.init(assignment);

    for (const volunteer of volunteers) {
      const [withAssignments, availabilities, breakPeriods] = await Promise.all(
        [
          this.allVolunteers.findOne(volunteer.id),
          this.availabilities.for(volunteer.id),
          this.breakPeriods.for(volunteer.id),
        ],
      );
      assertCanBeAssignedOn(
        volunteer,
        {
          teams: withAssignments.teams,
          availabilities,
          assignments: withAssignments.assignments,
          breakPeriods,
        },
        period,
      );
    }

    return this.assignments.assign({ assignment, volunteers });
  }
}
