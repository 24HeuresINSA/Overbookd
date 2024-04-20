import { Assignee, Assignment, RequestedTeam } from "../../assignment";
import { AssignmentSummaryFactory } from "./assignment-summary.factory";
import { Period } from "@overbookd/period";

type InitAssignment = {
  assignmentPeriod: Period;
  mobilizationPeriod?: Period;
};

export class AssignmentBuilder {
  private constructor(
    readonly assignment: Assignment,
    readonly summary: AssignmentSummaryFactory,
  ) {}

  static init({
    assignmentPeriod,
    mobilizationPeriod,
  }: InitAssignment): AssignmentBuilder {
    const identifier = {
      assignmentId: assignmentPeriod.id,
      mobilizationId: mobilizationPeriod?.id ?? assignmentPeriod.id,
    };
    const assignment = {
      identifier,
      start: assignmentPeriod.start,
      end: assignmentPeriod.end,
      requestedTeams: [],
      assignees: [],
    };
    const summary = AssignmentSummaryFactory.init(
      Period.init(assignmentPeriod),
    );
    return new AssignmentBuilder(assignment, summary);
  }

  during(period: Period): AssignmentBuilder {
    const identifier = {
      ...this.assignment.identifier,
      assignmentId: period.id,
    };
    const temporal = { start: period.start, end: period.end };
    const assignment = { ...this.assignment, ...temporal, identifier };
    const summary = this.summary.during(period);
    return new AssignmentBuilder(assignment, summary);
  }

  withMobilization(period: Period): AssignmentBuilder {
    const identifier = {
      ...this.assignment.identifier,
      mobilizationId: period.id,
    };
    const assignment = { ...this.assignment, identifier };
    const summary = this.summary.withMobilization(period);
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
