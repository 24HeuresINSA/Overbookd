import { updateItemToList } from '../../utils/list';
import { JsonStoredTask, StoredTask } from './storedTask';
import { Assignment, Task } from './task.model';

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
    const assignments = task.assignees.reduce((assignments, assignee) => {
      const startTimestamp = Math.max(
        task.period.start.getTime(),
        assignee.period.start.getTime(),
      );
      const endTimestamp = Math.min(
        task.period.end.getTime(),
        assignee.period.end.getTime(),
      );
      const volunteer = { id: assignee.id, name: assignee.name };
      const existingAssignmentIndex = assignments.findIndex(
        ({ period }) =>
          period.start.getTime() === startTimestamp &&
          period.end.getTime() === endTimestamp,
      );
      if (existingAssignmentIndex === -1) {
        const start = new Date(startTimestamp);
        const end = new Date(endTimestamp);
        const assignment = {
          period: { start, end },
          volunteers: [volunteer],
        };
        return [...assignments, assignment];
      }
      const previousAssignment = assignments.at(existingAssignmentIndex);
      if (!previousAssignment) {
        const start = new Date(startTimestamp);
        const end = new Date(endTimestamp);
        const assignment = {
          period: { start, end },
          volunteers: [volunteer],
        };
        return [...assignments, assignment];
      }
      const existingVolunteerIndex = previousAssignment.volunteers.findIndex(
        ({ id }) => id === volunteer.id,
      );
      const volunteers =
        existingVolunteerIndex === -1
          ? [...previousAssignment.volunteers, volunteer]
          : previousAssignment.volunteers;
      const updatedAssignment = {
        ...previousAssignment,
        volunteers,
      };
      return updateItemToList(
        assignments,
        existingAssignmentIndex,
        updatedAssignment,
      );
    }, [] as Assignment[]);
    const toAppendTask = new StoredTask(task, assignments);

    if (!previousTask) return [toAppendTask];
    if (!previousTask.canMergeWith(toAppendTask)) {
      return [...groupedTasks, toAppendTask];
    }

    const mergedTask = previousTask.merge(toAppendTask);
    return updateItemToList(groupedTasks, -1, mergedTask);
  }
}
