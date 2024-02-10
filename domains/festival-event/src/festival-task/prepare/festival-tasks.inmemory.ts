import { FestivalTask } from "../festival-task";
import { updateItemToList } from "@overbookd/list";
import { FestivalTasksForPrepare } from "./prepare";

type WithoutConflicts = FestivalTask<{ withConflicts: false }>;

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
