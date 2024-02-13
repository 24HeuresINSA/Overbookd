import { Duration, IProvidePeriod, Period } from "@overbookd/period";
import { Volunteer } from "../../sections/instructions";
import { DraftMobilization, TeamMobilization } from "../../sections/mobilizations";
import {
  MobilizationAlreadyExist,
  MobilizationNotFound,
  SplitDurationIsNotPeriodDivider,
  TeamAlreadyPartOfMobilization,
} from "../../festival-task.error";
import { updateItemToList } from "@overbookd/list";
import {
  IProvideSplitablePeriod,
  AddMobilization,
  UpdateMobilization,
} from "../prepare";

type ListItem<T> = {
  index: number;
  value?: T;
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
export class Mobilizations {
  private constructor(
    private readonly mobilizations: DraftMobilization<{ withConflicts: false }>[],
  ) {}

  static build(mobilizations: DraftMobilization<{ withConflicts: false }>[]) {
    return new Mobilizations(mobilizations);
  }

  add(form: AddMobilization) {
    const mobilization = MobilizationFactory.init(form).json;

    if (this.has(mobilization)) throw new MobilizationAlreadyExist();

    return new Mobilizations([...this.mobilizations, mobilization]);
  }

  remove(mobilizationId: DraftMobilization["id"]) {
    return new Mobilizations(
      this.mobilizations.filter(({ id }) => id !== mobilizationId),
    );
  }

  update(mobilizationId: DraftMobilization["id"], update: UpdateMobilization) {
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

  addTeamTo(mobilizationId: DraftMobilization["id"], team: TeamMobilization) {
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
    mobilizationId: DraftMobilization["id"],
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

  addVolunteerTo(mobilizationId: DraftMobilization["id"], volunteer: Volunteer) {
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
    mobilizationId: DraftMobilization["id"],
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
    id: DraftMobilization["id"],
  ): ListItem<DraftMobilization<{ withConflicts: false }>> {
    const index = this.mobilizations.findIndex(
      ({ id: currentId }) => currentId === id,
    );
    const value = this.mobilizations.at(index);

    return { index, value };
  }

  private has(mobilization: DraftMobilization<{ withConflicts: false }>) {
    return this.mobilizations.some(({ id }) => id === mobilization.id);
  }

  get json(): DraftMobilization<{ withConflicts: false }>[] {
    return [...this.mobilizations];
  }
}
class MobilizationFactory {
  private constructor(
    private readonly mobilization: DraftMobilization<{ withConflicts: false }>,
  ) {}

  static init(form: AddMobilization): MobilizationFactory {
    const { durationSplitInHour, teams, volunteers, ...period } = form;
    this.checkPeriod(durationSplitInHour, period);
    const id = this.generateId(period);

    return new MobilizationFactory({ ...form, id });
  }

  static build(mobilization: DraftMobilization<{ withConflicts: false }>) {
    return new MobilizationFactory(mobilization);
  }

  private static checkPeriod(
    durationSplitInHour: DraftMobilization["durationSplitInHour"],
    period: IProvidePeriod,
  ) {
    if (!durationSplitInHour) {
      return Period.init(period);
    }
    const splitDuration = Duration.hours(durationSplitInHour);
    return SplitablePeriod.checkValidity({ ...period, splitDuration });
  }

  private static generateId(period: IProvidePeriod): DraftMobilization["id"] {
    const { start, end } = period;
    const startMinutes = Duration.ms(start.getTime()).inMinutes;
    const endMinutes = Duration.ms(end.getTime()).inMinutes;

    return `${startMinutes}-${endMinutes}`;
  }

  update(update: UpdateMobilization) {
    const form = { ...this.mobilization, ...update };

    return MobilizationFactory.init(form);
  }

  addTeam(team: TeamMobilization) {
    if (this.hasTeam(team)) throw new TeamAlreadyPartOfMobilization(team.team);

    const teams = [...this.mobilization.teams, team];

    return new MobilizationFactory({ ...this.mobilization, teams });
  }

  removeTeam(team: TeamMobilization["team"]) {
    const teams = this.mobilization.teams.filter((t) => t.team !== team);

    return new MobilizationFactory({ ...this.mobilization, teams });
  }

  private hasTeam({ team }: TeamMobilization) {
    return this.mobilization.teams.some((request) => request.team === team);
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

  get json(): DraftMobilization<{ withConflicts: false }> {
    return this.mobilization;
  }
}
