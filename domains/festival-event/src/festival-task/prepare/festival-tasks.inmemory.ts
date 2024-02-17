import { FestivalTask } from "../festival-task";
import { updateItemToList } from "@overbookd/list";
import { FestivalTasksForPrepare } from "./prepare";
import { WithConflicts } from "../volunteer-conflicts";

type WithoutConflicts = Exclude<FestivalTask, WithConflicts>;

export class InMemoryFestivalTasks implements FestivalTasksForPrepare {
  constructor(private tasks: WithoutConflicts[]) {}

  findById(ftId: number): Promise<WithoutConflicts | null> {
    return Promise.resolve(this.tasks.find(({ id }) => id === ftId) ?? null);
  }

  save(task: WithoutConflicts): Promise<WithoutConflicts> {
    const taskIndex = this.tasks.findIndex(({ id }) => id === task.id);
    if (taskIndex === -1) throw new Error();

    this.tasks = updateItemToList(this.tasks, taskIndex, task);

    return Promise.resolve(task);
  }
}
