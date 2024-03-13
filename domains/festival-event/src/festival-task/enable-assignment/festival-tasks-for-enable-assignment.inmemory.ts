import { FestivalTask, ReadyToAssign, isReadyToReview } from "../festival-task";
import {
  ReadyToAssignWithoutConflicts,
  ValidatedWithoutConflicts,
} from "../volunteer-conflicts";
import { FestivalTaskNotFound } from "../festival-task.error";
import { isValidated } from "../../festival-event";
import { updateItemToList } from "@overbookd/list";
import { FestivalTasksForEnableAssignment } from "./enable-assignment";

export class InMemoryFestivalTasksForEnableAssignment
  implements FestivalTasksForEnableAssignment
{
  constructor(private tasks: Array<FestivalTask | ReadyToAssign>) {}
  findById(id: FestivalTask["id"]): Promise<ValidatedWithoutConflicts | null> {
    const task = this.tasks.find(
      (task): task is ValidatedWithoutConflicts =>
        task.id === id &&
        !isReadyToReview(task) &&
        isValidated<FestivalTask>(task),
    );
    return Promise.resolve(task ?? null);
  }

  save(task: ReadyToAssign): Promise<ReadyToAssignWithoutConflicts> {
    const index = this.tasks.findIndex(({ id }) => id === task.id);
    if (index === -1) throw new FestivalTaskNotFound(task.id);

    this.tasks = updateItemToList(this.tasks, index, task);
    return Promise.resolve(task);
  }

  get entries(): Array<FestivalTask | ReadyToAssign> {
    return this.tasks;
  }
}
