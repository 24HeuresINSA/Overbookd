import { Tasks, FullTask } from "./assign-task-to-volunteer";

export class InMemoryTasks implements Tasks {
  constructor(private tasks: FullTask[] = []) {}

  findAll(): Promise<FullTask[]> {
    return Promise.resolve(this.tasks);
  }
}
