import { Item } from "@overbookd/list";
import { IProvidePeriod } from "@overbookd/period";
import { FestivalTask } from "./festival-task";
import { Volunteer } from "./sections/instructions";
import { Conflicts } from "./sections/mobilizations";
import { DRAFT } from "../common/status";

export type VolunteerAvailabilities = {
  volunteer: Volunteer;
  availabilities: IProvidePeriod[];
};

export type VolunteerConflicts = {
  on(
    taskId: FestivalTask["id"],
    period: IProvidePeriod,
    volunteerId: Volunteer["id"],
  ): Promise<Conflicts>;
};

export type WithConflicts = {
  mobilizations: { volunteers: (Volunteer & { conflicts: Conflicts })[] }[];
};

export class FestivalTaskTranslator {
  constructor(private readonly volunteerConflicts: VolunteerConflicts) {}

  async translate<T extends FestivalTask>(
    task: Exclude<T, WithConflicts>,
  ): Promise<Extract<T, WithConflicts>> {
    const mobilizations = await Promise.all(
      task.mobilizations.map(async (mobilization) => {
        const volunteers = await this.assignConflictsToVolunteers(
          mobilization,
          task.id,
        );
        return { ...mobilization, volunteers };
      }),
    );
    const translated = { ...task, mobilizations };
    if (!isWithConflicts<T>(translated)) {
      throw new Error("Invalid Type");
    }
    return { ...translated, status: DRAFT };
  }

  private async assignConflictsToVolunteers<T extends FestivalTask>(
    mobilization: Item<Exclude<T, WithConflicts>["mobilizations"]>,
    taskId: FestivalTask["id"],
  ): Promise<Item<Extract<T, WithConflicts>["mobilizations"]>["volunteers"]> {
    return Promise.all(
      mobilization.volunteers.map(async (volunteer) => {
        const period = { start: mobilization.start, end: mobilization.end };
        const conflicts = await this.volunteerConflicts.on(
          taskId,
          period,
          volunteer.id,
        );
        return { ...volunteer, conflicts };
      }),
    );
  }
}

function isWithConflicts<T extends FestivalTask>(
  task: T,
): task is Extract<T, WithConflicts> {
  return task.mobilizations.every((mobilization) =>
    mobilization.volunteers.every((volunteer) =>
      Object.hasOwn(volunteer, "conflicts"),
    ),
  );
}
