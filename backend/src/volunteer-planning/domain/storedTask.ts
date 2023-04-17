import { Period } from 'src/volunteer-availability/domain/period.model';
import { Assignment, Task } from './task.model';

export type JsonStoredTask = Pick<
  Task,
  'description' | 'location' | 'name' | 'period'
> & {
  id: number;
  assignees: { period: Period; id: number; name: string }[];
};

export class StoredTask {
  constructor(
    private readonly storedTask: JsonStoredTask,
    private readonly assignments: Assignment[],
  ) {}

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
    const assignments = [...this.assignments, ...task.assignments];
    return new StoredTask(
      { ...this.storedTask, period: { start, end } },
      assignments,
    );
  }

  toTask(): Task {
    const { name, description, period, location } = this.storedTask;
    return {
      name,
      description,
      period,
      location,
      assignments: this.assignments,
    };
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
