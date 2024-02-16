import { updateItemToList } from "@overbookd/list";
import { Draft, FestivalTask, InReview, isDraft } from "../festival-task";
import { FestivalTaskNotFound } from "../festival-task.error";
import { AskForReviewTasks } from "./ask-for-review";

export class InMemoryAskForReviewTasks implements AskForReviewTasks {
  constructor(private tasks: FestivalTask[]) {}

  findById(id: FestivalTask["id"]): Promise<Draft | null> {
    const task = this.tasks.find(
      (task): task is Draft => task.id === id && isDraft(task),
    );
    return Promise.resolve(task ?? null);
  }

  save(task: InReview): Promise<InReview> {
    const index = this.tasks.findIndex(({ id }) => id === task.id);
    if (index === -1) throw new FestivalTaskNotFound(task.id);

    this.tasks = updateItemToList(this.tasks, index, task);
    return Promise.resolve(task);
  }

  get entries(): FestivalTask[] {
    return this.tasks;
  }
}
