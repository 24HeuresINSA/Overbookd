import { IProvidePeriod, Period } from "@overbookd/period";
import {
  VolunteerAvailabilities,
  VolunteerConflicts,
  WithConflicts,
} from "./volunteer-conflicts";
import { Volunteer } from "./sections/instructions";
import { Conflicts, FestivalTaskLink } from "./sections/mobilizations";
import { Mobilization } from "./sections/mobilizations";
import { FestivalTask, isReadyToAssign } from "./festival-task";

export class InMemoryVolunteerConflicts implements VolunteerConflicts {
  constructor(
    private readonly tasks: WithConflicts[],
    private readonly availabilities: VolunteerAvailabilities[],
  ) {}

  async on(
    taskId: FestivalTask["id"],
    period: IProvidePeriod,
    volunteerId: Volunteer["id"],
  ): Promise<Conflicts> {
    const tasks = await this.onTask(taskId, period, volunteerId);
    const availability = await this.onAvailability(period, volunteerId);
    const assignments = await this.onAssignments(taskId, period, volunteerId);

    const conflicts = { tasks, availability, assignments };
    return Promise.resolve(conflicts);
  }

  private onTask(
    taskId: FestivalTask["id"],
    period: IProvidePeriod,
    volunteerId: Volunteer["id"],
  ): Promise<FestivalTaskLink[]> {
    const requestedPeriod = Period.init(period);
    const tasks = this.tasks
      .filter(({ mobilizations, id }) => {
        const isDifferentTask = taskId !== id;
        const isAlsoRequestingVolunteer = mobilizations.some((mobilization) =>
          MobilizationHelper.build(mobilization).isRequestingVolunteerOn(
            volunteerId,
            requestedPeriod,
          ),
        );
        return isDifferentTask && isAlsoRequestingVolunteer;
      })
      .map(({ id, general: { name } }) => ({ id, name }));

    return Promise.resolve(tasks);
  }

  private onAvailability(
    period: IProvidePeriod,
    volunteerId: Volunteer["id"],
  ): Promise<boolean> {
    const requestedPeriod = Period.init(period);
    const volunteer = this.availabilities.find(
      ({ volunteer }) => volunteer.id === volunteerId,
    );
    const availabilities = (volunteer?.availabilities ?? []).filter(
      (availability) => Period.init(availability).includes(requestedPeriod),
    );
    return Promise.resolve(availabilities.length === 0);
  }

  private onAssignments(
    taskId: FestivalTask["id"],
    period: IProvidePeriod,
    volunteerId: Volunteer["id"],
  ): Promise<FestivalTaskLink[]> {
    const requestPeriod = Period.init(period);
    const tasks = this.tasks
      .filter((task) => {
        if (!isReadyToAssign(task)) return false;
        const isSameTask = task.id === taskId;
        if (isSameTask) return false;

        return task.mobilizations.some((mobilization) =>
          mobilization.assignments.some(({ start, end, assignees }) => {
            const assignmentPeriod = Period.init({ start, end });
            const isOverlapping = assignmentPeriod.isOverlapping(requestPeriod);
            const isVolunteerAssigned = assignees.some(
              ({ id }) => id === volunteerId,
            );
            return isOverlapping && isVolunteerAssigned;
          }),
        );
      })
      .map(({ id, general: { name } }) => ({ id, name }));
    return Promise.resolve(tasks);
  }
}

class MobilizationHelper {
  private constructor(private readonly mobilization: Mobilization) {}

  static build(mobilization: Mobilization): MobilizationHelper {
    return new MobilizationHelper(mobilization);
  }

  isRequestingVolunteerOn(
    volunteerId: Volunteer["id"],
    period: Period,
  ): boolean {
    const { start, end, volunteers } = this.mobilization;
    const otherPeriod = Period.init({ start, end });

    const happenAtSameTime = otherPeriod.isOverlapping(period);
    const isVolunteerRequired = volunteers.some(({ id }) => id === volunteerId);

    return isVolunteerRequired && happenAtSameTime;
  }
}
