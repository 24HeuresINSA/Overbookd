import { Tasks, TaskWithAssignments } from "./assign-task-to-volunteer";

export class InMemoryTasks implements Tasks {
  constructor(private tasks: TaskWithAssignments[] = []) {}

  findAll(): Promise<TaskWithAssignments[]> {
    return Promise.resolve(this.tasks);
  }
}
