import { FestivalTask } from "../festival-task";
import { FestivalTaskNotFound } from "../festival-task.error";
import { Preview } from "../festival-task";

export type FestivalTasksForView = {
  all(): Promise<Preview[]>;
  one(ftId: FestivalTask["id"]): Promise<FestivalTask | null>;
};
export class ViewFestivalTask {
  constructor(private readonly festivalTasks: FestivalTasksForView) {}

  all(): Promise<Preview[]> {
    return this.festivalTasks.all();
  }

  async one(ftId: FestivalTask["id"]): Promise<FestivalTask> {
    const task = await this.festivalTasks.one(ftId);
    if (!task) throw new FestivalTaskNotFound(ftId);
    return task;
  }
}
