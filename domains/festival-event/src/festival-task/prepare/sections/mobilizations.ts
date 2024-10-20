import { Duration, IProvidePeriod, Period } from "@overbookd/time";
import { Volunteer } from "../../sections/instructions.js";
import {
  Mobilization,
  TeamMobilization,
} from "../../sections/mobilizations.js";
import {
  MobilizationAlreadyExist,
  MobilizationNotFound,
  SplitDurationIsNotPeriodDivider,
} from "../../festival-task.error.js";
import { updateItemToList } from "@overbookd/list";
import { AddMobilization, UpdateMobilization } from "../prepare.js";

type ListItem<T> = {
  index: number;
  value?: T;
};

type IProvideSplitablePeriod = {
  start: Date;
  end: Date;
  splitDuration: Duration;
};

class SplitablePeriod {
  static checkValidity({ start, end, splitDuration }: IProvideSplitablePeriod) {
    const period = Period.init({ start, end });
    if (!period.duration.canBeDividedBy(splitDuration)) {
      throw new SplitDurationIsNotPeriodDivider(splitDuration);
    }
    return;
  }
}

const _defaultOptions = {
  withConflicts: false,
  withAssignments: false,
} as const;

export class Mobilizations {
  private constructor(
    private readonly mobilizations: Mobilization<typeof _defaultOptions>[],
  ) {}

  static build(mobilizations: Mobilization<typeof _defaultOptions>[]) {
    return new Mobilizations(mobilizations);
  }

  add(form: AddMobilization) {
    const mobilization = MobilizationFactory.init(form).json;

    if (this.has(mobilization)) throw new MobilizationAlreadyExist();

    return new Mobilizations([...this.mobilizations, mobilization]);
  }

  remove(mobilizationId: Mobilization["id"]) {
    return new Mobilizations(
      this.mobilizations.filter(({ id }) => id !== mobilizationId),
    );
  }

  update(mobilizationId: Mobilization["id"], update: UpdateMobilization) {
    const { index, value } = this.retrieveMobilization(mobilizationId);
    if (index === -1 || !value) throw new MobilizationNotFound();

    const builder = MobilizationFactory.build(value);
    const mobilizations = updateItemToList(
      this.mobilizations,
      index,
      builder.update(update).json,
    );

    return new Mobilizations(mobilizations);
  }

  addTeamTo(mobilizationId: Mobilization["id"], team: TeamMobilization) {
    const { index, value } = this.retrieveMobilization(mobilizationId);
    if (index === -1 || !value) return this;

    const builder = MobilizationFactory.build(value);
    const mobilizations = updateItemToList(
      this.mobilizations,
      index,
      builder.addTeam(team).json,
    );

    return new Mobilizations(mobilizations);
  }

  removeTeamFrom(
    mobilizationId: Mobilization["id"],
    team: TeamMobilization["team"],
  ) {
    const { index, value } = this.retrieveMobilization(mobilizationId);
    if (index === -1 || !value) return this;

    const builder = MobilizationFactory.build(value);
    const mobilizations = updateItemToList(
      this.mobilizations,
      index,
      builder.removeTeam(team).json,
    );

    return new Mobilizations(mobilizations);
  }

  addVolunteerTo(mobilizationId: Mobilization["id"], volunteer: Volunteer) {
    const { index, value } = this.retrieveMobilization(mobilizationId);
    if (index === -1 || !value) return this;

    const builder = MobilizationFactory.build(value);
    const mobilizations = updateItemToList(
      this.mobilizations,
      index,
      builder.addVolunteer(volunteer).json,
    );

    return new Mobilizations(mobilizations);
  }

  removeVolunteerFrom(
    mobilizationId: Mobilization["id"],
    volunteerId: Volunteer["id"],
  ) {
    const { index, value } = this.retrieveMobilization(mobilizationId);
    if (index === -1 || !value) return this;

    const builder = MobilizationFactory.build(value);
    const mobilizations = updateItemToList(
      this.mobilizations,
      index,
      builder.removeVolunteer(volunteerId).json,
    );

    return new Mobilizations(mobilizations);
  }

  private retrieveMobilization(
    id: Mobilization["id"],
  ): ListItem<Mobilization<typeof _defaultOptions>> {
    const index = this.mobilizations.findIndex(
      ({ id: currentId }) => currentId === id,
    );
    const value = this.mobilizations.at(index);

    return { index, value };
  }

  private has(mobilization: Mobilization<typeof _defaultOptions>) {
    return this.mobilizations.some(({ id }) => id === mobilization.id);
  }

  get json(): Mobilization<typeof _defaultOptions>[] {
    return [...this.mobilizations];
  }
}
class MobilizationFactory {
  private constructor(
    private readonly mobilization: Mobilization<typeof _defaultOptions>,
  ) {}

  static init(form: AddMobilization): MobilizationFactory {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { durationSplitInHour, teams, volunteers, ...period } = form;
    this.checkPeriod(durationSplitInHour, period);
    const id = this.generateId(period);

    return new MobilizationFactory({ ...form, id });
  }

  static build(mobilization: Mobilization<typeof _defaultOptions>) {
    return new MobilizationFactory(mobilization);
  }

  private static checkPeriod(
    durationSplitInHour: Mobilization["durationSplitInHour"],
    period: IProvidePeriod,
  ) {
    if (!durationSplitInHour) {
      return Period.init(period);
    }
    const splitDuration = Duration.hours(durationSplitInHour);
    return SplitablePeriod.checkValidity({ ...period, splitDuration });
  }

  private static generateId(period: IProvidePeriod): Mobilization["id"] {
    const { start, end } = period;
    const startMinutes = Duration.ms(start.getTime()).inMinutes;
    const endMinutes = Duration.ms(end.getTime()).inMinutes;

    return `${startMinutes}-${endMinutes}`;
  }

  update(update: UpdateMobilization) {
    const form = { ...this.mobilization, ...update };

    return MobilizationFactory.init(form);
  }

  addTeam(teamToAdd: TeamMobilization) {
    const existingTeamIndex = this.mobilization.teams.findIndex(
      (request) => request.team === teamToAdd.team,
    );
    const alreadyExists = existingTeamIndex !== -1;

    const teams = alreadyExists
      ? updateItemToList(this.mobilization.teams, existingTeamIndex, teamToAdd)
      : [...this.mobilization.teams, teamToAdd];
    return new MobilizationFactory({ ...this.mobilization, teams });
  }

  removeTeam(team: TeamMobilization["team"]) {
    const teams = this.mobilization.teams.filter((t) => t.team !== team);

    return new MobilizationFactory({ ...this.mobilization, teams });
  }

  addVolunteer(volunteer: Volunteer): MobilizationFactory {
    if (this.hasVolunteer(volunteer)) return this;

    const volunteers = [
      ...this.mobilization.volunteers,
      { ...volunteer, conflicts: [] },
    ];

    return new MobilizationFactory({ ...this.mobilization, volunteers });
  }

  removeVolunteer(volunteerId: Volunteer["id"]) {
    const volunteers = this.mobilization.volunteers.filter(
      ({ id }) => id !== volunteerId,
    );

    return new MobilizationFactory({ ...this.mobilization, volunteers });
  }

  private hasVolunteer(volunteer: Volunteer) {
    return this.mobilization.volunteers.some(({ id }) => id === volunteer.id);
  }

  get json(): Mobilization<typeof _defaultOptions> {
    return this.mobilization;
  }
}
