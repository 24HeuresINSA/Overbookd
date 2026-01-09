import { FestivalTasksForRemoval } from "./remove.js";
import { FestivalTask } from "../festival-task.js";
import { WithConflicts } from "../volunteer-conflicts.js";

export class InMemoryFestivalTasksForRemoval implements FestivalTasksForRemoval {
  constructor(private tasks: WithConflicts[]) {}

  findStatus(id: FestivalTask["id"]): Promise<FestivalTask["status"] | null> {
    const task = this.tasks.find(({ id: taskId }) => taskId === id);
    return Promise.resolve(task?.status ?? null);
  }

  one(id: FestivalTask["id"]): Promise<void> {
    const index = this.tasks.findIndex(({ id: taskId }) => taskId === id);
    if (index === -1) return Promise.resolve();
    this.tasks.splice(index, 1);
    return Promise.resolve();
  }

  get all(): Promise<WithConflicts[]> {
    return Promise.resolve(this.tasks);
  }
}
