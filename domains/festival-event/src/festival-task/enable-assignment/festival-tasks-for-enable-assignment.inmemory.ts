import { FestivalTask, ReadyToAssign } from "../festival-task.js";
import {
  ReadyToAssignWithoutConflicts,
  WithoutConflicts,
} from "../volunteer-conflicts.js";
import { FestivalTaskNotFound } from "../festival-task.error.js";
import { updateItemToList } from "@overbookd/list";
import { FestivalTasksForEnableAssignment } from "./enable-assignment.js";

export class InMemoryFestivalTasksForEnableAssignment
  implements FestivalTasksForEnableAssignment
{
  constructor(private tasks: FestivalTask[]) {}
  findById(id: FestivalTask["id"]): Promise<WithoutConflicts | null> {
    const task = this.tasks.find((task) => task.id === id);
    return Promise.resolve(task ?? null);
  }

  save(task: ReadyToAssign): Promise<ReadyToAssignWithoutConflicts> {
    const index = this.tasks.findIndex(({ id }) => id === task.id);
    if (index === -1) throw new FestivalTaskNotFound(task.id);

    this.tasks = updateItemToList(this.tasks, index, task);
    return Promise.resolve(task);
  }

  get entries(): FestivalTask[] {
    return this.tasks;
  }
}
