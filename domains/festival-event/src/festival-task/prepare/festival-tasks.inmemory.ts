import { FestivalTask, Mobilization, Volunteer } from "../festival-task";
import { updateItemToList } from "@overbookd/list";
import { FestivalTasksForPrepare } from "./prepare";

export class InMemoryFestivalTasks<
  M extends Mobilization<Volunteer> = Mobilization<Volunteer>,
> implements FestivalTasksForPrepare<M>
{
  constructor(private tasks: FestivalTask<M>[]) {}

  findById(ftId: number): Promise<FestivalTask<M> | null> {
    return Promise.resolve(this.tasks.find(({ id }) => id === ftId) ?? null);
  }

  save(task: FestivalTask<M>): Promise<FestivalTask<M>> {
    const taskIndex = this.tasks.findIndex(({ id }) => id === task.id);
    if (taskIndex === -1) throw new Error();

    this.tasks = updateItemToList(this.tasks, taskIndex, task);

    return Promise.resolve(task);
  }
}
