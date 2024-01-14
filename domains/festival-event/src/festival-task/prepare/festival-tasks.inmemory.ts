import { FestivalTask } from "../festival-task";
import { updateItemToList } from "@overbookd/list";
import { FestivalTasksForPrepare } from "./prepare";

export class InMemoryFestivalTasks implements FestivalTasksForPrepare {
  constructor(private tasks: FestivalTask[]) { }

  findById(ftId: number): Promise<FestivalTask | null> {
    return Promise.resolve(this.tasks.find(({ id }) => id === ftId) ?? null);
  }

  save(task: FestivalTask): Promise<FestivalTask> {
    const taskIndex = this.tasks.findIndex(({ id }) => id === task.id);
    if (taskIndex === -1) throw new Error();

    this.tasks = updateItemToList(this.tasks, taskIndex, task);

    return Promise.resolve(task);
  }
}
