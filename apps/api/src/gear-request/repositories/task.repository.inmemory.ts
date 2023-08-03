import { TaskRepository } from '../gear-request.service';
import { Task } from '../tasks/task.model';

export class InMemoryTaskRepository implements TaskRepository {
  tasks: Task[] = [];

  constructor(tasks: Task[]) {
    this.tasks = tasks;
  }

  getTask(taskId: number): Promise<Task> {
    return Promise.resolve(this.tasks.find(({ id }) => id === taskId));
  }
}
