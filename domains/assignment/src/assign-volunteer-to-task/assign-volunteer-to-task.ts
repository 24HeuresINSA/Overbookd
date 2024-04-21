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
};

export class AssignVolunteerToTask {
  constructor(private readonly allVolunteers: Volunteers) {}

  async volunteers(): Promise<VolunteerWithAssignmentDuration[]> {
    const volunteers = await this.allVolunteers.findAll();
    return volunteers.map((assignee) =>
      this.computeAssignmentDuration(assignee),
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
