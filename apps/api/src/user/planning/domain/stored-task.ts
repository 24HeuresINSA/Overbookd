import { groupAssigneesByPeriod } from "@overbookd/assignment";
import { IProvidePeriod, Period } from "@overbookd/time";
import { Assignment, Task, Volunteer } from "./task.model";

type Assignee = Volunteer & { period: IProvidePeriod };

export type JsonStoredTask = Pick<
  Task,
  "instructions" | "location" | "name" | "period" | "contacts"
> & {
  id: number;
  assignees: Assignee[];
};

export class StoredTask {
  constructor(private readonly storedTask: JsonStoredTask) {}

  get assignments(): Assignment[] {
    const assignees = this.storedTask.assignees.map(
      ({ period, ...volunteer }) => ({ volunteer, period }),
    );
    return groupAssigneesByPeriod(this.storedTask.period, assignees);
  }

  merge(task: StoredTask): StoredTask {
    const period = this.period.mergeWith(task.period);
    const assignees = [
      ...this.storedTask.assignees,
      ...task.storedTask.assignees,
    ];
    return new StoredTask({ ...this.storedTask, period, assignees });
  }

  toTask(volunteerId: number): Task {
    const { name, instructions, period, location, contacts } = this.storedTask;
    return {
      name,
      instructions,
      period,
      location,
      assignments: this.assignments,
      contacts: contacts.filter(({ id }) => id !== volunteerId),
    };
  }

  canMergeWith(task: StoredTask): boolean {
    const isSameTask = task.isSameTask(this.storedTask);
    const hasMergeablePeriods = this.period.isMergeableWith(task.period);
    return isSameTask && hasMergeablePeriods;
  }

  private get period(): Period {
    return Period.init(this.storedTask.period);
  }

  private isSameTask(storedTask: JsonStoredTask) {
    return storedTask.id === this.storedTask.id;
  }
}
