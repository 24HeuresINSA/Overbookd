import {
  AssigneeWithAssignments,
  Assignees,
} from "./assignment-duration-assignee";

export class InMemoryAssignees implements Assignees {
  constructor(private assignees: AssigneeWithAssignments[] = []) {}

  findAll() {
    return Promise.resolve(this.assignees);
  }
}
