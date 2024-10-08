import { FestivalTask } from "../festival-task.js";
import { FestivalTaskNotFound } from "../festival-task.error.js";
import { Preview } from "../festival-task.js";
import {
  FestivalTaskTranslator,
  WithoutConflicts,
} from "../volunteer-conflicts.js";

export type FestivalTasksForView = {
  all(): Promise<Preview[]>;
  one(ftId: FestivalTask["id"]): Promise<WithoutConflicts | null>;
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
