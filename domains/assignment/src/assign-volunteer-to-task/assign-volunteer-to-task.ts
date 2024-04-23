import { Period } from "@overbookd/period";
import { FormatVolunteer, Volunteer } from "../common/volunteer";
import {
  AssignmentSummaryWithTask,
  countAssigneesInTeam,
} from "../common/assignment";
import { TaskAssignmentForVolunteer } from "./task-assignment";

export type VolunteerWithFriendFilter = Volunteer & {
  hasAtLeastOneFriend: boolean;
};

export type VolunteerWithAssignments = VolunteerWithFriendFilter & {
  assignments: Period[];
};

export type VolunteerWithAssignmentDuration = VolunteerWithFriendFilter & {
  assignmentDuration: number;
};

export type Volunteers = {
  findAll(): Promise<VolunteerWithAssignments[]>;
};

export type AssignmentCondition = {
  volunteerId: number;
  oneOfTheTeams: string[];
};

export type TaskAssignments = {
  findAssignableFor(
    condition: AssignmentCondition,
  ): Promise<TaskAssignmentForVolunteer[]>;
};

export class AssignVolunteerToTask {
  constructor(
    private readonly allVolunteers: Volunteers,
    private readonly taskAssignments: TaskAssignments,
  ) {}

  async volunteers(): Promise<VolunteerWithAssignmentDuration[]> {
    const volunteers = await this.allVolunteers.findAll();
    return volunteers.map((assignee) =>
      this.computeAssignmentDuration(assignee),
    );
  }

  async selectVolunteer(
    volunteerId: number,
    oneOfTheTeams: string[],
  ): Promise<AssignmentSummaryWithTask[]> {
    const assignments = await this.taskAssignments.findAssignableFor({
      volunteerId,
      oneOfTheTeams,
    });
    return assignments
      .map((assignment) => ({
        ...assignment,
        teams: assignment.demands
          .map(({ team, demand }) => ({
            team,
            demand,
            assigned: countAssigneesInTeam(team, assignment.assignees),
          }))
          .filter(({ assigned, demand }) => assigned < demand),
      }))
      .filter(({ teams }) => teams.length > 0);
  }

  private computeAssignmentDuration({
    assignments,
    ...volunteer
  }: VolunteerWithAssignments): VolunteerWithAssignmentDuration {
    const assignmentDuration =
      FormatVolunteer.computeAssignmentDuration(assignments);
    return {
      ...volunteer,
      hasAtLeastOneFriend: false,
      assignmentDuration,
    };
  }
}
