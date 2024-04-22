import { AssignmentIdentifier } from "./assignment";
import { Assignments } from "./repositories/assignments";

export class Unassign {
  constructor(private assignments: Assignments) {}

  async volunteerFromTask(
    assignment: AssignmentIdentifier,
    volunteerId: number,
  ) {
    await this.assignments.unassign(assignment, volunteerId);
  }
}
