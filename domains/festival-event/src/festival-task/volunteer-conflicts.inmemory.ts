import { IProvidePeriod, Period } from "@overbookd/period";
import {
  VolunteerAvailabilities,
  VolunteerConflicts,
} from "./volunteer-conflicts";
import {
  FestivalTask,
  FestivalTaskLink,
  Volunteer,
  Mobilization,
  Conflicts,
} from "./festival-task";

export class InMemoryVolunteerConflicts implements VolunteerConflicts {
  constructor(
    private readonly tasks: FestivalTask[],
    private readonly availabilities: VolunteerAvailabilities[],
  ) {}

  on(
    taskId: FestivalTask["id"],
    period: IProvidePeriod,
    volunteerId: Volunteer["id"],
  ): Promise<Conflicts> {
    const requestedPeriod = Period.init(period);
    const tasks = this.onTask(taskId, requestedPeriod, volunteerId);
    const isAvailable = this.isAvailable(requestedPeriod, volunteerId);

    const conflicts = { tasks, isAvailable };
    return Promise.resolve(conflicts);
  }

  private onTask(
    taskId: FestivalTask["id"],
    period: Period,
    volunteerId: Volunteer["id"],
  ): FestivalTaskLink[] {
    return this.tasks
      .filter(({ mobilizations, id }) => {
        const isDifferentTask = taskId !== id;
        const isAlsoRequestingVolunteer = mobilizations.some((mobilization) =>
          MobilizationHelper.build(mobilization).isRequestingVolunteerOn(
            volunteerId,
            period,
          ),
        );
        return isDifferentTask && isAlsoRequestingVolunteer;
      })
      .map(({ id, general: { name } }) => ({ id, name }));
  }

  private isAvailable(period: Period, volunteerId: Volunteer["id"]): boolean {
    const volunteer = this.availabilities.find(
      ({ volunteer }) => volunteer.id === volunteerId,
    );
    return (
      (volunteer?.availabilities ?? []).filter((availability) =>
        Period.init(availability).isOverlapping(period),
      ).length > 0
    );
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
