import { Item } from "@overbookd/list";
import { IProvidePeriod } from "@overbookd/period";
import {
  Draft,
  FestivalTask,
  InReview,
  Refused,
  Reviewable,
} from "./festival-task";
import { Volunteer } from "./sections/instructions";
import { Conflicts } from "./sections/mobilizations";

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

type WithConflictsFilter = {
  mobilizations: { volunteers: (Volunteer & { conflicts: Conflicts })[] }[];
};

export type WithoutConflicts = Exclude<FestivalTask, WithConflictsFilter>;
export type WithConflicts = Extract<FestivalTask, WithConflictsFilter>;

export type DraftWithoutConflicts = Extract<WithoutConflicts, Draft>;
export type InReviewWithoutConflicts = Extract<WithoutConflicts, InReview>;
export type RefusedWithoutConflicts = Extract<WithoutConflicts, Refused>;
export type ReviewableWithoutConflicts = Extract<WithoutConflicts, Reviewable>;

export type DraftWithConflicts = Extract<WithConflicts, Draft>;
export type InReviewWithConflicts = Extract<WithConflicts, InReview>;
export type RefusedWithConflicts = Extract<WithConflicts, Refused>;

export class FestivalTaskTranslator {
  constructor(private readonly volunteerConflicts: VolunteerConflicts) {}

  async translate<T extends FestivalTask>(
    task: Exclude<T, WithConflictsFilter>,
  ): Promise<Extract<T, WithConflictsFilter>> {
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
    return translated;
  }

  private async assignConflictsToVolunteers<T extends FestivalTask>(
    mobilization: Item<Exclude<T, WithConflictsFilter>["mobilizations"]>,
    taskId: FestivalTask["id"],
  ): Promise<
    Item<Extract<T, WithConflictsFilter>["mobilizations"]>["volunteers"]
  > {
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
): task is Extract<T, WithConflictsFilter> {
  return task.mobilizations.every((mobilization) =>
    mobilization.volunteers.every((volunteer) =>
      Object.hasOwn(volunteer, "conflicts"),
    ),
  );
}
