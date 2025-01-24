import { PlanningTask } from "@overbookd/http";
import { updateItemToList } from "@overbookd/list";
import { JsonStoredTask, StoredTask, ToPrintTask } from "./storedTask";
import { Task } from "./task.model";

export type TaskRepository = {
  getVolunteerTasksInChronologicalOrder(
    volunteerId: number,
  ): Promise<JsonStoredTask[]>;

  getVolunteerTasksHeIsPartOf(volunteerId: number): Promise<PlanningTask[]>;

  getSpecificTaskInfos(taskId: number): Promise<ToPrintTask>;
};

export class Planning {
  constructor(private readonly taskRepository: TaskRepository) {}

  async generateForVolunteer(volunteerId: number): Promise<Task[]> {
    const tasks =
      await this.taskRepository.getVolunteerTasksInChronologicalOrder(
        volunteerId,
      );
    const groupedTasks = tasks.reduce(
      (groupedTasks, task) => this.groupTasks(groupedTasks, task),
      [] as StoredTask[],
    );
    return groupedTasks.map((storedTask) => storedTask.toTask(volunteerId));
  }

  async listVolunteerTasks(volunteerId: number): Promise<PlanningTask[]> {
    return this.taskRepository.getVolunteerTasksHeIsPartOf(volunteerId);
  }

  async getSpecificTaskInfos(taskId: number): Promise<ToPrintTask> {
    return this.taskRepository.getSpecificTaskInfos(taskId);
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
