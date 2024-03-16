import { FestivalTasksForPrepare } from "./prepare";
import { WithoutConflicts } from "../volunteer-conflicts";

export class InMemoryFestivalTasks implements FestivalTasksForPrepare {
  constructor(private tasks: WithoutConflicts[]) {}

  findById(ftId: number): Promise<WithoutConflicts | null> {
    return Promise.resolve(this.tasks.find(({ id }) => id === ftId) ?? null);
  }

  save(task: WithoutConflicts): Promise<WithoutConflicts> {
    this.tasks = this.tasks.map((current) =>
      current.id !== task.id ? current : task,
    );

    return Promise.resolve(task);
  }
}
