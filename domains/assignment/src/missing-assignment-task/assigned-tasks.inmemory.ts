import { AssignedTasks, AssignmentTask } from "./missing-assignment-task";

export class InMemoryAssignedTasks implements AssignedTasks {
  constructor(private tasks: AssignmentTask[] = []) {}

  findAll(): Promise<AssignmentTask[]> {
    return Promise.resolve(this.tasks);
  }
}
