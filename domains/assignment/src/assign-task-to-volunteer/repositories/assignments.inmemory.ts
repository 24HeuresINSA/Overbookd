import { updateItemToList } from "@overbookd/list";
import { Assignment, AssignmentIdentifier } from "../assignment";
import { Assignments, VolunteersForAssignment } from "./assignments";

export class InMemoryAssignments implements Assignments {
  constructor(private assignments: Assignment[]) {}

  assign({
    assignment,
    volunteers,
  }: VolunteersForAssignment): Promise<Assignment> {
    const assignmentIndex = this.assignments.findIndex(
      ({ taskId, assignmentId, mobilizationId }) =>
        assignment.taskId === taskId &&
        assignment.mobilizationId === mobilizationId &&
        assignment.assignmentId === assignmentId,
    );
    const currentAssignment = this.assignments.at(assignmentIndex);
    if (assignmentIndex === -1 || !currentAssignment) {
      throw new Error("Not Found");
    }

    const assignees = [...currentAssignment.assignees, ...volunteers];
    const updatedAssignment = { ...currentAssignment, assignees };

    this.assignments = updateItemToList(
      this.assignments,
      assignmentIndex,
      updatedAssignment,
    );

    return Promise.resolve(updatedAssignment);
  }

  unassign(
    assignment: AssignmentIdentifier,
    assigneeId: number,
  ): Promise<void> {
    const assignmentIndex = this.assignments.findIndex(
      ({ taskId, assignmentId, mobilizationId }) =>
        assignment.taskId === taskId &&
        assignment.mobilizationId === mobilizationId &&
        assignment.assignmentId === assignmentId,
    );
    const currentAssignment = this.assignments.at(assignmentIndex);
    if (assignmentIndex === -1 || !currentAssignment) {
      return Promise.resolve();
    }

    const assignees = currentAssignment.assignees.filter(
      ({ id }) => id !== assigneeId,
    );

    const updatedAssignment = { ...currentAssignment, assignees };
    this.assignments = updateItemToList(
      this.assignments,
      assignmentIndex,
      updatedAssignment,
    );

    return Promise.resolve();
  }

  get all() {
    return this.assignments;
  }
}
