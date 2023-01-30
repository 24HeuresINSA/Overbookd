import { Task, TaskRepository } from '../gearRequests.service';

export class InMemoryTaskRepository implements TaskRepository {
  tasks: Task[] = [];

  constructor(tasks: Task[]) {
    this.tasks = tasks;
  }

  getTask(taskId: number): Promise<Task> {
    return Promise.resolve(this.tasks.find(({ id }) => id === taskId));
  }
}
