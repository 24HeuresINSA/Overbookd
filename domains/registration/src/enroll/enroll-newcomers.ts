import { JoinableTeam } from "./joinable-team";
import { BENEVOLE_CODE } from "@overbookd/team";

export type NewcomerToEnroll = {
  id: number;
};

type TeamsAfterEnrollment = [JoinableTeam, typeof BENEVOLE_CODE];

export type EnrolledNewcomer = {
  id: number;
  teams: TeamsAfterEnrollment;
};

export class EnrollNewcomers {
  private constructor(private readonly newcomers: NewcomerToEnroll[]) {}

  static with(newcomers: NewcomerToEnroll[]): EnrollNewcomers {
    return new EnrollNewcomers(newcomers);
  }

  to(team: JoinableTeam): EnrolledNewcomer[] {
    return this.newcomers.map((newcomer) => ({
      ...newcomer,
      teams: [team, BENEVOLE_CODE],
    }));
  }
}
