import { Period } from "@overbookd/period";
import { AssignmentSummary, AssignmentTeam } from "../../assignment";
import { AssignableVolunteer } from "../../assignable-volunteer";
import { BENEVOLE_CODE } from "@overbookd/team";

export class AssignmentSummaryFactory {
  private constructor(
    readonly assignment: AssignmentSummary,
    readonly assignableVolunteers: AssignableVolunteer[],
  ) {}

  static init(period: Period, taskId: number) {
    const assignment = {
      taskId,
      assignmentId: period.id,
      mobilizationId: period.id,
      start: period.start,
      end: period.end,
      teams: [],
    };
    return new AssignmentSummaryFactory(assignment, []);
  }

  during(period: Period) {
    const assignmentId = period.id;
    const temporal = { start: period.start, end: period.end };
    const assignment = { ...this.assignment, ...temporal, assignmentId };
    return new AssignmentSummaryFactory(assignment, this.assignableVolunteers);
  }

  withMobilization(period: Period) {
    const mobilizationId = period.id;
    const assignment = { ...this.assignment, mobilizationId };
    return new AssignmentSummaryFactory(assignment, this.assignableVolunteers);
  }

  withTaskId(taskId: number) {
    const assignment = { ...this.assignment, taskId };
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
  private constructor(readonly assignmentTeam: AssignmentTeam) {}

  static init(assignmentTeam?: Partial<AssignmentTeam>): AssignmentTeamFactory {
    const team = assignmentTeam?.team ?? BENEVOLE_CODE;
    const demand = assignmentTeam?.demand ?? 1;
    const assigned = assignmentTeam?.assigned ?? 0;
    return new AssignmentTeamFactory({ team, demand, assigned });
  }

  withDemands(demand: number): AssignmentTeamFactory {
    return new AssignmentTeamFactory({ ...this.assignmentTeam, demand });
  }

  withCode(team: string): AssignmentTeamFactory {
    return new AssignmentTeamFactory({ ...this.assignmentTeam, team });
  }

  withAssigned(assigned: number): AssignmentTeamFactory {
    return new AssignmentTeamFactory({ ...this.assignmentTeam, assigned });
  }
}
