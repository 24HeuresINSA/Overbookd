import { TaskNotFoundError } from "../../assignment.error.js";
import { Tasks } from "../assign-task-to-volunteer.js";
import { Task } from "../task.js";

export class InMemoryTasks implements Tasks {
  constructor(private tasks: Task[] = []) {}

  findAll(): Promise<Task[]> {
    return Promise.resolve(this.tasks);
  }

  findOne(id: Task["id"]): Promise<Task> {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) throw new TaskNotFoundError(id);
    return Promise.resolve(task);
  }
}
