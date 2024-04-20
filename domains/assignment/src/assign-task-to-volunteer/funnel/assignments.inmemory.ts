import { Assignments, Assignment, VolunteersForAssignment } from "./assignments";


export class InMemoryAssignments implements Assignments {
  constructor(private assignments: Assignment[]) { }

  assign({
    assignment, volunteers,
  }: VolunteersForAssignment): Promise<Assignment> {
    const assignmentIndex = this.assignments.findIndex(
      ({ taskId: id }) => assignment.taskId === id
    );
    const currentAssignment = this.assignments.at(assignmentIndex);
    if (assignmentIndex === -1 || !currentAssignment) {
      throw new Error("Not Found");
    }

    const assignees = [...currentAssignment.assignees, ...volunteers];
    const updatedAssignment = { ...currentAssignment, assignees };

    return Promise.resolve(updatedAssignment);
  }
}
