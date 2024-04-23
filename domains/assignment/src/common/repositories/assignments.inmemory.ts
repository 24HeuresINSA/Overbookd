import { updateItemToList } from "@overbookd/list";
import { Assignment, AssignmentIdentifier } from "../assignment";
import { Assignments, VolunteersForAssignment } from "./assignments";
import { Period } from "@overbookd/period";

export class InMemoryAssignments implements Assignments {
  constructor(private assignments: Assignment[]) {}

  async assign({
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
    return { ...currentAssignment, assignees };
  }

  async unassign(
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
  }
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
