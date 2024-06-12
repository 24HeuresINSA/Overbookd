import { AssignmentIdentifier } from "./assignment.js";
import { Assignments } from "./repositories/assignments.js";

export class Unassign {
  constructor(private assignments: Assignments) {}

  async volunteer(assignment: AssignmentIdentifier, volunteerId: number) {
    await this.assignments.unassign(assignment, volunteerId);
  }
}
