import { AssignmentIdentifier } from "../common/assignment";
import { Assignments } from "../common/repositories/assignments";

export class Unassign {
  constructor(private assignments: Assignments) {}

  async volunteer(assignment: AssignmentIdentifier, volunteerId: number) {
    await this.assignments.unassign(assignment, volunteerId);
  }
}
