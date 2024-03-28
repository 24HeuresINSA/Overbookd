import { IProvidePeriod, Period } from "@overbookd/period";
import { removeItemAtIndex } from "@overbookd/list";
import { Assignment, Task, Volunteer } from "./task.model";
import { arePeriodsOverlapping } from "../../utils/period";

type Assignee = { period: IProvidePeriod; id: number; name: string };

export type JsonStoredTask = Pick<
  Task,
  "description" | "location" | "name" | "period"
> & {
  id: number;
  assignees: Assignee[];
};

export class StoredTask {
  constructor(private readonly storedTask: JsonStoredTask) {}

  get assignments(): Assignment[] {
    const uniquePeriods = this.extractUniquePeriods();

    const splitedPeriods = this.splitOverlapingPeriods(uniquePeriods).filter(
      (period) => this.period.includes(period),
    );

    return splitedPeriods.reduce((assignments, period) => {
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
    const { name, description, period, location } = this.storedTask;
    return {
      name,
      description,
      period,
      location,
      assignments: this.assignments,
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

  private findAssignedVolunteers(period: IProvidePeriod): Volunteer[] {
    const assignees = this.storedTask.assignees.filter((assignee) =>
      arePeriodsOverlapping([period, assignee.period]),
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

  private splitOverlapingPeriods(periods: Period[]): Period[] {
    return periods.reduce((splitedPeriods: Period[], period) => {
      return this.splitOverLapingPeriodsReducer(splitedPeriods, period);
    }, []);
  }

  private splitOverLapingPeriodsReducer(
    splitedPeriods: Period[],
    period: Period,
  ): Period[] {
    const overlapedPeriodIndex = splitedPeriods.findIndex((previousPeriod) =>
      period.isOverlapping(previousPeriod),
    );
    const overlapedPeriod = splitedPeriods.at(overlapedPeriodIndex);
    if (overlapedPeriodIndex === -1 || !overlapedPeriod) {
      return [...splitedPeriods, period];
    }

    const splittedPeriods = overlapedPeriod.splitOverlapping(period);

    const nonOverlapingPeriods = removeItemAtIndex(
      splitedPeriods,
      overlapedPeriodIndex,
    );

    const updatedSplitedPeriods = [...nonOverlapingPeriods, ...splittedPeriods];

    return this.splitOverlapingPeriods(updatedSplitedPeriods);
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
