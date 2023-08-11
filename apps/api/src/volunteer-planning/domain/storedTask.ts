import { IProvidePeriod } from '@overbookd/period';
import { removeItemAtIndex } from '@overbookd/list';
import { Assignment, Task, Volunteer } from './task.model';
import {
  arePeriodsOverlapping,
  areSamePeriods,
  includesOtherPeriod,
} from '../../utils/period';
import { getPeriodDuration } from '../../utils/duration';

type Assignee = { period: IProvidePeriod; id: number; name: string };

export type JsonStoredTask = Pick<
  Task,
  'description' | 'location' | 'name' | 'period'
> & {
  id: number;
  assignees: Assignee[];
};

export class StoredTask {
  constructor(private readonly storedTask: JsonStoredTask) {}

  get start(): Date {
    return this.storedTask.period.start;
  }

  get end(): Date {
    return this.storedTask.period.end;
  }

  get assignments(): Assignment[] {
    const uniquePeriods = this.extractUniquePeriods();

    const splitedPeriods = this.splitOverlapingPeriods(uniquePeriods).filter(
      (period) => includesOtherPeriod(this.period)(period),
    );

    return splitedPeriods.reduce((assignments, period) => {
      const volunteers = this.findAssignedVolunteers(period);
      if (volunteers.length === 0) return assignments;
      return [...assignments, { period, volunteers }];
    }, []);
  }

  merge(task: StoredTask): StoredTask {
    const startTimestamp = Math.min(this.start.getTime(), task.start.getTime());
    const endTimestamp = Math.max(this.end.getTime(), task.end.getTime());
    const start = new Date(startTimestamp);
    const end = new Date(endTimestamp);
    const assignees = [
      ...this.storedTask.assignees,
      ...task.storedTask.assignees,
    ];
    return new StoredTask({
      ...this.storedTask,
      period: { start, end },
      assignees,
    });
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
    return (
      task.isSameTask(this.storedTask) &&
      (this.isFollowedBy(task) || this.IsOverlapedBy(task))
    );
  }

  private get period(): IProvidePeriod {
    return {
      start: this.start,
      end: this.end,
    };
  }

  private IsOverlapedBy(task: StoredTask) {
    return (
      this.start.getTime() < task.end.getTime() &&
      this.end.getTime() > task.start.getTime()
    );
  }

  private isSameTask(storedTask: JsonStoredTask) {
    return storedTask.id === this.storedTask.id;
  }

  private isFollowedBy(task: StoredTask): boolean {
    return this.end.getTime() === task.start.getTime();
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

  private extractUniquePeriods(): IProvidePeriod[] {
    const allPeriods = [...this.storedTask.assignees, { period: this.period }];
    return allPeriods.reduce(uniquePeriodReducer, []);
  }

  private splitOverlapingPeriods(periods: IProvidePeriod[]): IProvidePeriod[] {
    return periods.reduce((splitedPeriods, period) => {
      return this.splitOverLapingPeriodsReducer(splitedPeriods, period);
    }, []);
  }

  private splitOverLapingPeriodsReducer(
    splitedPeriods: IProvidePeriod[],
    period: IProvidePeriod,
  ): IProvidePeriod[] {
    const overlapedPeriodIndex = splitedPeriods.findIndex((p) =>
      arePeriodsOverlapping([period, p]),
    );
    if (overlapedPeriodIndex === -1) return [...splitedPeriods, period];

    const overlapedPeriod = splitedPeriods.at(overlapedPeriodIndex);
    if (!overlapedPeriod) return [...splitedPeriods, period];

    const toAddPeriods = this.splitIntoPeriods(overlapedPeriod, period);

    const nonOverlapingPeriods = removeItemAtIndex(
      splitedPeriods,
      overlapedPeriodIndex,
    );

    const updatedSplitedPeriods = [...nonOverlapingPeriods, ...toAddPeriods];

    return this.splitOverlapingPeriods(updatedSplitedPeriods);
  }

  private splitIntoPeriods(
    overlapedPeriod: IProvidePeriod,
    period: IProvidePeriod,
  ): IProvidePeriod[] {
    const [firstStart, firstEnd, sencondStart, secondEnd] = [
      overlapedPeriod.start,
      overlapedPeriod.end,
      period.start,
      period.end,
    ].sort();

    const firstPeriod = { start: firstStart, end: firstEnd };
    const secondPeriod = { start: firstEnd, end: sencondStart };
    const thirdPeriod = { start: sencondStart, end: secondEnd };

    const toAddPeriods = [firstPeriod, secondPeriod, thirdPeriod].filter(
      (period) => getPeriodDuration(period) > 0,
    );
    return toAddPeriods;
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

function uniquePeriodReducer(
  periods: IProvidePeriod[],
  { period }: { period: IProvidePeriod },
): IProvidePeriod[] {
  const existingPeriodIndex = periods.findIndex((p) =>
    areSamePeriods([period, p]),
  );
  if (existingPeriodIndex !== -1) return periods;
  return [...periods, period];
}
