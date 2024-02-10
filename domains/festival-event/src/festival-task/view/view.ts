import { FestivalTask } from "../festival-task";
import { FestivalTaskNotFound } from "../festival-task.error";
import { Preview } from "../festival-task";
import { FestivalTaskTranslator } from "../volunteer-conflicts";

export type FestivalTasksForView = {
  all(): Promise<Preview[]>;
  one(
    ftId: FestivalTask["id"],
  ): Promise<FestivalTask<{ withConflicts: false }> | null>;
};
export class ViewFestivalTask {
  constructor(
    private readonly festivalTasks: FestivalTasksForView,
    private readonly festivalTaskTranslator: FestivalTaskTranslator,
  ) {}

  all(): Promise<Preview[]> {
    return this.festivalTasks.all();
  }

  async one(ftId: FestivalTask["id"]): Promise<FestivalTask> {
    const task = await this.festivalTasks.one(ftId);
    if (!task) throw new FestivalTaskNotFound(ftId);
    return this.festivalTaskTranslator.translate(task);
  }
}
