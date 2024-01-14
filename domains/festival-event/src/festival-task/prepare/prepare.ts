import { FestivalTask } from "../festival-task";
import { FestivalTaskNotFound } from "../festival-task.error";

type UpdateGeneral = {
  name?: FestivalTask["general"]["name"];
  administrator?: FestivalTask["general"]["administrator"];
  team?: FestivalTask["general"]["team"];
};
export type FestivalTasksForPrepare = {
  findById(ftId: FestivalTask["id"]): Promise<FestivalTask | null>;
  save(task: FestivalTask): Promise<FestivalTask>;
};
export class PrepareFestivalTask {
  constructor(private readonly festivalTasks: FestivalTasksForPrepare) { }

  async updateGeneralSection(
    taskId: FestivalTask["id"],
    update: UpdateGeneral
  ): Promise<FestivalTask> {
    const task = await this.festivalTasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const general = { ...task.general, ...update };
    return this.festivalTasks.save({ ...task, general });
  }
}
