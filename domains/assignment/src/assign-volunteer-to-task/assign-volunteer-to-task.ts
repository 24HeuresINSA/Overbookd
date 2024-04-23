import { Period } from "@overbookd/period";
import { FormatVolunteer, Volunteer } from "../volunteer";
import { Assignments } from "../common/repositories/assignments";
import {
  AssignmentSummaryWithTask,
  countAssigneesInTeam,
} from "../common/assignment";
import { Tasks } from "../common/repositories/tasks";

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
  findOne(id: Volunteer["id"]): Promise<VolunteerWithAssignments | undefined>;
};

export class AssignVolunteerToTask {
  constructor(
    private readonly allVolunteers: Volunteers,
    private readonly assignments: Assignments,
    private readonly tasks: Tasks,
  ) {}

  async volunteers(): Promise<VolunteerWithAssignmentDuration[]> {
    const volunteers = await this.allVolunteers.findAll();
    return volunteers.map((assignee) =>
      this.computeAssignmentDuration(assignee),
    );
  }

  async selectVolunteer(
    volunteerId: Volunteer["id"],
  ): Promise<AssignmentSummaryWithTask[]> {
    const volunteer = await this.allVolunteers.findOne(volunteerId);
    if (!volunteer) throw new Error("Volunteer not found");

    const assignments = await this.assignments.findAssignableFor(
      volunteer.assignments,
      volunteer.teams,
    );
    const withTeams = assignments
      .map((assignment) => ({
        ...assignment,
        teams: assignment.demands.map(({ team, demand }) => ({
          team,
          demand,
          assigned: countAssigneesInTeam(team, assignment.assignees),
        })),
      }))
      .filter((assignment) => assignment.teams.length > 0);

    return Promise.all(
      withTeams.map(async (assignment) => {
        const { id, ...task } = await this.tasks.findOne(assignment.taskId);
        return { ...assignment, ...task, hasFriendsAssigned: false };
      }),
    );
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
