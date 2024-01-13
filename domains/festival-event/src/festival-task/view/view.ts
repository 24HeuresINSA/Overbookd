import { FestivalTask } from "../festival-task";
import { FestivalTaskNotFound } from "../festival-task.error";
import { PreviewFestivalTask } from "../festival-task";

export type FestivalTasksForView = {
  all(): Promise<PreviewFestivalTask[]>;
  one(ftId: FestivalTask["id"]): Promise<FestivalTask | null>;
};
export class ViewFestivalTask {
  constructor(private readonly festivalTasks: FestivalTasksForView) {}

  all(): Promise<PreviewFestivalTask[]> {
    return this.festivalTasks.all();
  }

  async one(ftId: FestivalTask["id"]): Promise<FestivalTask> {
    const task = await this.festivalTasks.one(ftId);
    if (!task) throw new FestivalTaskNotFound(ftId);
    return task;
  }
}
