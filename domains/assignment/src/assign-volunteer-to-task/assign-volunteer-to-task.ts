import { Period } from "@overbookd/period";
import { FormatVolunteer, Volunteer } from "../volunteer";

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

export type TaskAssignments = {
  findOn(periods: Period[], oneOfTheTeams: string[]): Promise<[]>;
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

  async selectVolunteer(volunteerId: Volunteer["id"]): Promise<[]> {
    const volunteer = await this.allVolunteers.findOne(volunteerId);
    if (!volunteer) return [];

    return this.taskAssignments.findOn(volunteer.assignments, volunteer.teams);
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
