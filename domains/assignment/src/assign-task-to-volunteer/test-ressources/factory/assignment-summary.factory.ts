import { Period } from "@overbookd/period";
import { AssignmentSummary, AssignmentTeam } from "../../assignment";
import { AssignableVolunteer } from "../../assignable-volunteer";

export class AssignmentSummaryFactory {
  private constructor(
    readonly assignment: AssignmentSummary,
    readonly assignableVolunteers: AssignableVolunteer[],
  ) {}

  static init(period: Period) {
    const assignment = {
      start: period.start,
      end: period.end,
      id: period.id,
      teams: [],
    };
    return new AssignmentSummaryFactory(assignment, []);
  }

  withTeams(teams: AssignmentTeam[]): AssignmentSummaryFactory {
    return new AssignmentSummaryFactory(
      { ...this.assignment, teams },
      this.assignableVolunteers,
    );
  }

  withAssignableVolunteers(
    assignableVolunteers: AssignableVolunteer[],
  ): AssignmentSummaryFactory {
    return new AssignmentSummaryFactory(this.assignment, assignableVolunteers);
  }
}

export class AssignmentTeamFactory {
  private constructor(private readonly team: AssignmentTeam) {}

  static init(team?: Partial<AssignmentTeam>): AssignmentTeamFactory {
    const code = team?.code ?? "benevole";
    const demands = team?.demands ?? 1;
    const assigned = team?.assigned ?? 0;
    return new AssignmentTeamFactory({ code, demands, assigned });
  }

  withDemands(demands: number): AssignmentTeamFactory {
    return new AssignmentTeamFactory({ ...this.team, demands });
  }

  withCode(code: string): AssignmentTeamFactory {
    return new AssignmentTeamFactory({ ...this.team, code });
  }

  withAssigned(assigned: number): AssignmentTeamFactory {
    return new AssignmentTeamFactory({ ...this.team, assigned });
  }

  get value(): AssignmentTeam {
    return this.team;
  }
}
