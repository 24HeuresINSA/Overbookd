import { Assignee, Assignment, RequestedTeam } from "../../assignment";
import { AssignmentSummaryFactory } from "./assignment-summary.factory";
import { Period } from "@overbookd/period";

export class AssignmentBuilder {
  private constructor(
    readonly assignment: Assignment,
    readonly summary: AssignmentSummaryFactory,
  ) {}

  static init(period: Period, mobilizationId: string): AssignmentBuilder {
    const assignment = {
      id: period.id,
      start: period.start,
      end: period.end,
      mobilizationId,
      requestedTeams: [],
      assignees: [],
    };
    const summary = AssignmentSummaryFactory.init(
      Period.init(period),
      mobilizationId,
    );
    return new AssignmentBuilder(assignment, summary);
  }

  during(period: Period): AssignmentBuilder {
    const temporal = { start: period.start, end: period.end, id: period.id };
    const assignment = { ...this.assignment, ...temporal };
    const summary = this.summary.during(period);
    return new AssignmentBuilder(assignment, summary);
  }

  withAssignees(assignees: Assignee[]): AssignmentBuilder {
    return new AssignmentBuilder(
      { ...this.assignment, assignees },
      this.summary,
    );
  }

  withRequestedTeams(requestedTeams: RequestedTeam[]): AssignmentBuilder {
    return new AssignmentBuilder(
      { ...this.assignment, requestedTeams },
      this.summary,
    );
  }

  withSummary(summary: AssignmentSummaryFactory): AssignmentBuilder {
    return new AssignmentBuilder(this.assignment, summary);
  }
}
