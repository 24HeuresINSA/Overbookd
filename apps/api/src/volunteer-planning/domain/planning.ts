import { updateItemToList } from "@overbookd/list";
import { JsonStoredTask, StoredTask } from "./storedTask";
import { Task } from "./task.model";

export interface TaskRepository {
  getVolunteerTasksInChronologicalOrder(
    volunteerId: number,
  ): Promise<JsonStoredTask[]>;
}

export class Planning {
  constructor(private readonly taskRepository: TaskRepository) {}

  async getVolunteerTasks(volunteerId: number): Promise<Task[]> {
    const tasks =
      await this.taskRepository.getVolunteerTasksInChronologicalOrder(
        volunteerId,
      );
    const groupedTasks = tasks.reduce(
      (groupedTasks, task) => this.groupTasks(groupedTasks, task),
      [] as StoredTask[],
    );
    return groupedTasks.map((storedTask) => storedTask.toTask());
  }

  private groupTasks(
    groupedTasks: StoredTask[],
    task: JsonStoredTask,
  ): StoredTask[] {
    const previousTask = groupedTasks.at(-1);
    const toAppendTask = new StoredTask(task);

    if (!previousTask) return [toAppendTask];
    if (!previousTask.canMergeWith(toAppendTask)) {
      return [...groupedTasks, toAppendTask];
    }

    const mergedTask = previousTask.merge(toAppendTask);
    return updateItemToList(groupedTasks, -1, mergedTask);
  }
}
