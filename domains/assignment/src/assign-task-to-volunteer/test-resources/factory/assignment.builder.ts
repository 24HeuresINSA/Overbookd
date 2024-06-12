import { Assignee, Assignment, TeamDemanded } from "../../assignment.js";
import { AssignmentSummaryFactory } from "./assignment-summary.factory.js";
import { Period } from "@overbookd/period";

type InitAssignment = {
  assignmentPeriod: Period;
  mobilizationPeriod?: Period;
  taskId?: number;
};

export class AssignmentBuilder {
  private constructor(
    readonly assignment: Assignment,
    readonly summary: AssignmentSummaryFactory,
  ) {}

  static init({
    assignmentPeriod,
    mobilizationPeriod,
    taskId: maybeTaskId,
  }: InitAssignment): AssignmentBuilder {
    const taskId = maybeTaskId ?? 1;
    const assignmentId = assignmentPeriod.id;
    const mobilizationId = mobilizationPeriod?.id ?? assignmentPeriod.id;
    const assignment = {
      taskId,
      name: "Task Name",
      assignmentId,
      mobilizationId,
      start: assignmentPeriod.start,
      end: assignmentPeriod.end,
      demands: [],
      assignees: [],
    };
    const summary = AssignmentSummaryFactory.init(
      Period.init(assignmentPeriod),
      maybeTaskId ?? 1,
    );
    return new AssignmentBuilder(assignment, summary);
  }

  during(period: Period): AssignmentBuilder {
    const assignmentId = period.id;
    const temporal = { start: period.start, end: period.end };
    const assignment = { ...this.assignment, ...temporal, assignmentId };
    const summary = this.summary.during(period);
    return new AssignmentBuilder(assignment, summary);
  }

  withMobilization(period: Period): AssignmentBuilder {
    const mobilizationId = period.id;
    const assignment = { ...this.assignment, mobilizationId };
    const summary = this.summary.withMobilization(period);
    return new AssignmentBuilder(assignment, summary);
  }

  withAssignees(assignees: Assignee[]): AssignmentBuilder {
    return new AssignmentBuilder(
      { ...this.assignment, assignees },
      this.summary,
    );
  }

  withTaskId(taskId: number): AssignmentBuilder {
    const assignment = { ...this.assignment, taskId };
    const summary = this.summary.withTaskId(taskId);
    return new AssignmentBuilder(assignment, summary);
  }

  withRequestedTeams(demands: TeamDemanded[]): AssignmentBuilder {
    return new AssignmentBuilder({ ...this.assignment, demands }, this.summary);
  }

  withSummary(summary: AssignmentSummaryFactory): AssignmentBuilder {
    const assignment = {
      ...this.assignment,
      taskId: summary.assignment.taskId,
    };
    return new AssignmentBuilder(assignment, summary);
  }
}
