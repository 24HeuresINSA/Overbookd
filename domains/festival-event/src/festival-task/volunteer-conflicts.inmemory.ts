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

  async on(
    taskId: FestivalTask["id"],
    period: IProvidePeriod,
    volunteerId: Volunteer["id"],
  ): Promise<Conflicts> {
    const tasks = await this.onTask(taskId, period, volunteerId);
    const isAvailable = await this.isAvailable(period, volunteerId);

    const conflicts = { tasks, isAvailable };
    return Promise.resolve(conflicts);
  }

  onTask(
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

  isAvailable(
    period: IProvidePeriod,
    volunteerId: Volunteer["id"],
  ): Promise<boolean> {
    const requestedPeriod = Period.init(period);
    const volunteer = this.availabilities.find(
      ({ volunteer }) => volunteer.id === volunteerId,
    );
    const availabilities = (volunteer?.availabilities ?? []).filter(
      (availability) =>
        Period.init(availability).isOverlapping(requestedPeriod),
    );
    return Promise.resolve(availabilities.length > 0);
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
