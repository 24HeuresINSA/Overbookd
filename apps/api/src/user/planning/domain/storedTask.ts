import { IProvidePeriod, Period } from "@overbookd/period";
import { removeItemAtIndex } from "@overbookd/list";
import { Assignment, Task, Volunteer } from "./task.model";

type Assignee = { period: IProvidePeriod; id: number; name: string };

export type JsonStoredTask = Pick<
  Task,
  "instructions" | "location" | "name" | "period"
> & {
  id: number;
  assignees: Assignee[];
};

export class StoredTask {
  constructor(private readonly storedTask: JsonStoredTask) {}

  get assignments(): Assignment[] {
    const uniquePeriods = this.extractUniquePeriods();

    const splitPeriods = this.splitOverlappingPeriods(uniquePeriods).filter(
      (period) => this.period.includes(period),
    );

    return splitPeriods.reduce((assignments, period) => {
      const volunteers = this.findAssignedVolunteers(period);
      if (volunteers.length === 0) return assignments;
      return [...assignments, { period, volunteers }];
    }, []);
  }

  merge(task: StoredTask): StoredTask {
    const period = this.period.mergeWith(task.period);
    const assignees = [
      ...this.storedTask.assignees,
      ...task.storedTask.assignees,
    ];
    return new StoredTask({ ...this.storedTask, period, assignees });
  }

  toTask(): Task {
    const { name, instructions, period, location } = this.storedTask;
    return {
      name,
      instructions,
      period,
      location,
      assignments: this.assignments,
      contacts: [],
    };
  }

  canMergeWith(task: StoredTask): boolean {
    const isSameTask = task.isSameTask(this.storedTask);
    const hasMergeablePeriods = this.period.isMergableWith(task.period);
    return isSameTask && hasMergeablePeriods;
  }

  private get period(): Period {
    return Period.init(this.storedTask.period);
  }

  private isSameTask(storedTask: JsonStoredTask) {
    return storedTask.id === this.storedTask.id;
  }

  private findAssignedVolunteers(period: Period): Volunteer[] {
    const assignees = this.storedTask.assignees.filter((assignee) =>
      period.isOverlapping(Period.init(assignee.period)),
    );
    return this.extractUniqueVolunteers(assignees);
  }

  private extractUniqueVolunteers(assignees: Assignee[]): Volunteer[] {
    return assignees.reduce(uniqueVolunteerReducer, []);
  }

  private extractUniquePeriods(): Period[] {
    const allPeriods = [
      ...this.storedTask.assignees.map(({ period }) => Period.init(period)),
      this.period,
    ];
    return allPeriods.reduce(uniquePeriodReducer, []);
  }

  private splitOverlappingPeriods(periods: Period[]): Period[] {
    return periods.reduce((splitPeriods: Period[], period) => {
      return this.splitOverlappingPeriodsReducer(splitPeriods, period);
    }, []);
  }

  private splitOverlappingPeriodsReducer(
    periods: Period[],
    period: Period,
  ): Period[] {
    const overlapedPeriodIndex = periods.findIndex((previousPeriod) =>
      period.isOverlapping(previousPeriod),
    );
    const overlapedPeriod = periods.at(overlapedPeriodIndex);
    if (overlapedPeriodIndex === -1 || !overlapedPeriod) {
      return [...periods, period];
    }

    const splitPeriods = overlapedPeriod.splitOverlapping(period);

    const nonOverlappingPeriods = removeItemAtIndex(
      periods,
      overlapedPeriodIndex,
    );

    const updatedPeriods = [...nonOverlappingPeriods, ...splitPeriods];

    return this.splitOverlappingPeriods(updatedPeriods);
  }
}

function uniqueVolunteerReducer(
  volunteers: Volunteer[],
  { id, name }: Assignee,
): Volunteer[] {
  const alreadyInVolunteersIndex = volunteers.findIndex(
    (volunteer) => volunteer.id === id,
  );
  if (alreadyInVolunteersIndex !== -1) return volunteers;

  return [...volunteers, { id, name }];
}

function uniquePeriodReducer(periods: Period[], period: Period): Period[] {
  const existingPeriodIndex = periods.findIndex((p) => period.equals(p));
  if (existingPeriodIndex !== -1) return periods;
  return [...periods, period];
}
