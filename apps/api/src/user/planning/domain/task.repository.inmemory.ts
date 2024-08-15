import { PlanningTask } from "@overbookd/http";
import { TaskRepository } from "./planning";
import { JsonStoredTask } from "./storedTask";
import { Period } from "@overbookd/time";

export class InMemoryTaskRepository implements TaskRepository {
  constructor(private tasks: JsonStoredTask[]) {}

  getVolunteerTasksInChronologicalOrder(
    volunteerId: number,
  ): Promise<JsonStoredTask[]> {
    return Promise.resolve(
      this.tasks
        .filter(({ assignees }) =>
          assignees.some(({ id }) => id === volunteerId),
        )
        .map((task) => {
          const assignees = this.findAllOtherAssignees(task, volunteerId);
          return { ...task, assignees };
        })
        .sort((a, b) => a.period.start.getTime() - b.period.start.getTime()),
    );
  }

  getVolunteerTasksHeIsPartOf(): Promise<PlanningTask[]> {
    return Promise.resolve([]);
  }

  private findAllOtherAssignees(task: JsonStoredTask, volunteerId: number) {
    const assigneesFromOtherTimeSpans =
      this.findAssigneesFromOtherTimeSpans(task);
    const assignees = [...task.assignees, ...assigneesFromOtherTimeSpans];
    return assignees.filter(({ id }) => id !== volunteerId);
  }

  private findAssigneesFromOtherTimeSpans(task: JsonStoredTask) {
    return this.tasks
      .filter(isSimultaneousTask(task))
      .flatMap(({ assignees }) => assignees);
  }
}

function isSimultaneousTask(task: JsonStoredTask) {
  return function ({ period: otherPeriod, id }: JsonStoredTask) {
    const taskPeriod = Period.init(task.period);
    const otherTaskPeriod = Period.init(otherPeriod);
    const isOverlapping = taskPeriod.isOverlapping(otherTaskPeriod);
    return isOverlapping && task.id === id;
  };
}
