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
      identifier: { assignmentId: period.id, mobilizationId: period.id },
      start: period.start,
      end: period.end,
      teams: [],
    };
    return new AssignmentSummaryFactory(assignment, []);
  }

  during(period: Period) {
    const identifier = {
      ...this.assignment.identifier,
      assignmentId: period.id,
    };
    const temporal = { start: period.start, end: period.end };
    const assignment = { ...this.assignment, ...temporal, identifier };
    return new AssignmentSummaryFactory(assignment, this.assignableVolunteers);
  }

  withMobilization(period: Period) {
    const identifier = {
      ...this.assignment.identifier,
      mobilizationId: period.id,
    };
    const assignment = { ...this.assignment, identifier };
    return new AssignmentSummaryFactory(assignment, this.assignableVolunteers);
  }

  withTeams(teams: AssignmentTeam[]): AssignmentSummaryFactory {
    const assignment = { ...this.assignment, teams };
    return new AssignmentSummaryFactory(assignment, this.assignableVolunteers);
  }

  withAssignableVolunteers(
    assignableVolunteers: AssignableVolunteer[],
  ): AssignmentSummaryFactory {
    return new AssignmentSummaryFactory(this.assignment, assignableVolunteers);
  }
}

export class AssignmentTeamFactory {
  private constructor(readonly team: AssignmentTeam) {}

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
}
