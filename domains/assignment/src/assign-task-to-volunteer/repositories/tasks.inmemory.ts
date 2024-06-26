import { TaskNotFoundError } from "../../assignment.error";
import { Tasks } from "../assign-task-to-volunteer";
import { Task } from "../task";

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
