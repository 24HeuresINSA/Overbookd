import { AssignmentIdentifier } from "./assignment";
import { Assignments } from "./repositories/assignments";

export class Unassign {
  constructor(private assignments: Assignments) {}

  async volunteer(assignment: AssignmentIdentifier, volunteerId: number) {
    await this.assignments.unassign(assignment, volunteerId);
  }
}
