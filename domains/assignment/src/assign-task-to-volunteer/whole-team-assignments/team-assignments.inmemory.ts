import { updateItemToList } from "@overbookd/list";
import {
  Assignment,
  AssignmentIdentifier,
  isTeamMember,
} from "../assignment.js";
import {
  AssignmentIdentifierWithTeam,
  TeamAssignments,
} from "./whole-team-assignments.js";
import { Volunteer } from "../../volunteer.js";
import { ALL_TEAM_MEMBERS } from "@overbookd/festival-event-constants";
import { retrieveImplicitTeams } from "../../candidate-teams.js";

export class InMemoryTeamAssignments implements TeamAssignments {
  constructor(
    private assignments: Assignment[],
    private volunteers: Volunteer[],
  ) {}

  findTeamAssignmentsToAddForVolunteer(
    volunteerId: Volunteer["id"],
  ): Promise<AssignmentIdentifierWithTeam[]> {
    const volunteer = this.volunteers.find(({ id }) => id === volunteerId);
    if (!volunteer) return Promise.resolve([]);

    const assignments = this.assignments.reduce<AssignmentIdentifierWithTeam[]>(
      (
        assignments,
        { taskId, mobilizationId, assignmentId, demands, assignees },
      ) => {
        const isAlreadyAssigned = assignees.some(
          ({ id }) => id === volunteerId,
        );
        if (isAlreadyAssigned) return assignments;

        const teams = retrieveImplicitTeams(volunteer.teams);
        const teamDemand = demands.find(
          ({ team, demand }) =>
            demand === ALL_TEAM_MEMBERS && teams.includes(team),
        );
        if (teamDemand)
          assignments.push({
            taskId,
            mobilizationId,
            assignmentId,
            as: teamDemand.team,
          });

        return assignments;
      },
      [],
    );
    return Promise.resolve(assignments);
  }

  findTeamAssignmentsToRemoveForVolunteer(
    volunteerId: Volunteer["id"],
  ): Promise<AssignmentIdentifier[]> {
    const volunteer = this.volunteers.find(({ id }) => id === volunteerId);
    if (!volunteer) return Promise.resolve([]);

    const assignments = this.assignments.reduce<AssignmentIdentifier[]>(
      (assignments, { taskId, mobilizationId, assignmentId, assignees }) => {
        const teams = retrieveImplicitTeams(volunteer.teams);
        const isWronglyAssigned = assignees.some(
          (assignee) => isTeamMember(assignee) && !teams.includes(assignee.as),
        );
        if (isWronglyAssigned)
          assignments.push({ taskId, mobilizationId, assignmentId });

        return assignments;
      },
      [],
    );
    return Promise.resolve(assignments);
  }

  assign(
    assignments: AssignmentIdentifierWithTeam[],
    volunteerId: Volunteer["id"],
  ): Promise<void> {
    for (const assignment of assignments) {
      const assignmentIndex = this.assignments.findIndex(
        ({ taskId, assignmentId, mobilizationId }) =>
          assignment.taskId === taskId &&
          assignment.mobilizationId === mobilizationId &&
          assignment.assignmentId === assignmentId,
      );
      const currentAssignment = this.assignments.at(assignmentIndex);
      if (assignmentIndex === -1 || !currentAssignment) {
        throw new Error("Not Found");
      }

      const assignees = [
        ...currentAssignment.assignees,
        { id: volunteerId, as: assignment.as },
      ];
      const updatedAssignment = { ...currentAssignment, assignees };

      this.assignments = updateItemToList(
        this.assignments,
        assignmentIndex,
        updatedAssignment,
      );
    }

    return Promise.resolve();
  }

  unassign(
    assignments: AssignmentIdentifier[],
    assigneeId: number,
  ): Promise<void> {
    for (const assignment of assignments) {
      const assignmentIndex = this.assignments.findIndex(
        ({ taskId, assignmentId, mobilizationId }) =>
          assignment.taskId === taskId &&
          assignment.mobilizationId === mobilizationId &&
          assignment.assignmentId === assignmentId,
      );
      const currentAssignment = this.assignments.at(assignmentIndex);
      if (assignmentIndex === -1 || !currentAssignment) {
        return Promise.resolve();
      }

      const assignees = currentAssignment.assignees.filter(
        ({ id }) => id !== assigneeId,
      );

      const updatedAssignment = { ...currentAssignment, assignees };
      this.assignments = updateItemToList(
        this.assignments,
        assignmentIndex,
        updatedAssignment,
      );
    }

    return Promise.resolve();
  }

  get all() {
    return this.assignments;
  }
}
