import { IProvidePeriod } from "@overbookd/period";
import {
  Assignee,
  Assignment,
  RequestedTeam,
} from "./assign-task-to-volunteer";

export class AssignmentBuilder {
  private constructor(private assignment: Assignment) {}

  static init({ start, end }: IProvidePeriod): AssignmentBuilder {
    const assignment = defaultAssignment(start, end);
    return new AssignmentBuilder(assignment);
  }

  withAssignees(assignees: Assignee[]): AssignmentBuilder {
    this.assignment = { ...this.assignment, assignees };
    return this;
  }

  withRequestedTeams(requestedTeams: RequestedTeam[]): AssignmentBuilder {
    this.assignment = { ...this.assignment, requestedTeams };
    return this;
  }

  build(): Assignment {
    return this.assignment;
  }
}

function defaultAssignment(start: Date, end: Date): Assignment {
  return {
    start,
    end,
    requestedTeams: [],
    assignees: [],
  };
}
