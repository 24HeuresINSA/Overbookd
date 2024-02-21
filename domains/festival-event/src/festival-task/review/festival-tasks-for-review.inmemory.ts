import { ReviewableWithoutConflicts } from "../volunteer-conflicts";
import { FestivalTaskNotFound } from "../festival-task.error";
import { updateItemToList } from "@overbookd/list";
import { FestivalTasksForReview } from "./review";

export class InMemoryFestivalTasksForReview implements FestivalTasksForReview {
  constructor(private tasks: ReviewableWithoutConflicts[]) { }
  findById(ftId: number): Promise<ReviewableWithoutConflicts | null> {
    const task = this.tasks.find(({ id }) => id === ftId);
    return Promise.resolve(task ?? null);
  }

  save<T extends ReviewableWithoutConflicts>(task: T): Promise<T> {
    const index = this.tasks.findIndex(({ id }) => id === task.id);
    if (index === -1) {
      throw new FestivalTaskNotFound(task.id);
    }
    this.tasks = updateItemToList(this.tasks, index, task);

    return Promise.resolve(task);
  }
}
