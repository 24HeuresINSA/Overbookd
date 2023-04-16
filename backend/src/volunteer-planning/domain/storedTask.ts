import { Task } from './task.model';

export type JsonStoredTask = Task & {
  id: number;
  assignees: { id: number }[];
};

export class StoredTask {
  constructor(private readonly storedTask: JsonStoredTask) {}

  get start(): Date {
    return this.storedTask.period.start;
  }

  get end(): Date {
    return this.storedTask.period.end;
  }

  merge(task: StoredTask): StoredTask {
    const startTimestamp = Math.min(this.start.getTime(), task.start.getTime());
    const endTimestamp = Math.max(this.end.getTime(), task.end.getTime());
    const start = new Date(startTimestamp);
    const end = new Date(endTimestamp);
    return new StoredTask({ ...this.storedTask, period: { start, end } });
  }

  toTask(): Task {
    const { name, description, period, location } = this.storedTask;
    return { name, description, period, location };
  }

  canMergeWith(task: StoredTask): boolean {
    return task.isSameTask(this.storedTask) && this.isFollowedBy(task);
  }

  private isSameTask(storedTask: JsonStoredTask) {
    return storedTask.id === this.storedTask.id;
  }

  private isFollowedBy(task: StoredTask): boolean {
    return this.end.getTime() === task.start.getTime();
  }
}
