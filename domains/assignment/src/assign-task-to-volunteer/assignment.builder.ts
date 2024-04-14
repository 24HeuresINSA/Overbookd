import { IProvidePeriod } from "@overbookd/period";
import {
  Assignee,
  Assignment,
  RequestedTeam,
} from "./assign-task-to-volunteer";
import { AssignmentSummaryFactory } from "./assignment-summary.factory";
import { Period } from "@overbookd/period";

export class AssignmentBuilder {
  private constructor(
    readonly assignment: Assignment,
    readonly summary: AssignmentSummaryFactory,
  ) {}

  static init(period: IProvidePeriod): AssignmentBuilder {
    const assignment = defaultAssignment(period);
    const summary = AssignmentSummaryFactory.init(Period.init(period));
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

function defaultAssignment({ start, end }: IProvidePeriod): Assignment {
  return {
    start,
    end,
    requestedTeams: [],
    assignees: [],
  };
}
