import { TaskNotFoundError } from "../assignment.error";
import { Tasks, FullTask } from "./assign-task-to-volunteer";

export class InMemoryTasks implements Tasks {
  constructor(private tasks: FullTask[] = []) {}

  findAll(): Promise<FullTask[]> {
    return Promise.resolve(this.tasks);
  }

  findOne(id: FullTask["id"]): Promise<FullTask> {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) throw new TaskNotFoundError(id);
    return Promise.resolve(task);
  }
}
