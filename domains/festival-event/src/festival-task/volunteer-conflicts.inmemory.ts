import { IProvidePeriod, Period } from "@overbookd/period";
import { VolunteerConflicts } from "./volunteer-conflicts";
import {
  FestivalTask,
  Conflict,
  Volunteer,
  Mobilization,
} from "./festival-task";

export class InMemoryVolunteerConflicts implements VolunteerConflicts {
  constructor(private tasks: FestivalTask[]) {}

  on(
    taskId: FestivalTask["id"],
    period: IProvidePeriod,
    volunteerId: Volunteer["id"],
  ): Promise<Conflict[]> {
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
    const happenAtSameTime = otherPeriod.isIncludedBy(period);
    const isVolunteerRequired = volunteers.some(({ id }) => id === volunteerId);
    return isVolunteerRequired && happenAtSameTime;
  }
}
