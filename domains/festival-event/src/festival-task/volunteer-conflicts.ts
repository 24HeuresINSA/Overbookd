import { IProvidePeriod } from "@overbookd/period";
import {
  FestivalTask,
  FestivalTaskLink,
  Volunteer,
  Mobilization,
} from "./festival-task";

export type VolunteerConflicts = {
  on(
    taskId: FestivalTask["id"],
    period: IProvidePeriod,
    volunteerId: Volunteer["id"],
  ): Promise<FestivalTaskLink[]>;
};

export class FestivalTaskTranslator {
  constructor(private readonly volunteerConflicts: VolunteerConflicts) {}

  async translate(
    task: FestivalTask<{ withConflicts: false }>,
  ): Promise<FestivalTask> {
    const mobilizations = await Promise.all(
      task.mobilizations.map(async (mobilization) => {
        const volunteers = await this.assignConflictsToVolunteers(
          mobilization,
          task.id,
        );
        return { ...mobilization, volunteers };
      }),
    );
    return { ...task, mobilizations };
  }

  private async assignConflictsToVolunteers(
    mobilization: Mobilization<{ withConflicts: false }>,
    taskId: FestivalTask["id"],
  ) {
    return Promise.all(
      mobilization.volunteers.map(async (volunteer) => {
        const period = { start: mobilization.start, end: mobilization.end };
        const tasks = await this.volunteerConflicts.on(
          taskId,
          period,
          volunteer.id,
        );
        const conflicts = { tasks };
        return { ...volunteer, conflicts };
      }),
    );
  }
}
