import { Period } from "@overbookd/time";
import { Assignment, TeamMember } from "./assignment.js";
import { assertCanBeAssignedOn } from "./assignable-on-period.js";
import { Assignments } from "./repositories/assignments.js";
import { VolunteersForAssignmentRepository } from "./repositories/volunteers-for-assignment.js";

export class Assign {
  constructor(
    private readonly assignments: Assignments,
    private readonly volunteersForAssignment: VolunteersForAssignmentRepository,
  ) {}

  async volunteers(
    assignment: Assignment,
    volunteers: TeamMember[],
  ): Promise<Assignment> {
    const period = Period.init(assignment);

    for (const volunteer of volunteers) {
      const volunteerForAssignment = await this.volunteersForAssignment.findOne(
        volunteer.id,
      );
      assertCanBeAssignedOn(volunteer, volunteerForAssignment, period);
    }

    return this.assignments.assign({ assignment, volunteers });
  }
}
