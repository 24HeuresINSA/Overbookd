import { Period } from "@overbookd/time";
import { FormatVolunteer, Volunteer } from "../volunteer.js";
import { FriendCount } from "../friends.js";

export type VolunteerWithFriendFilter = Volunteer & {
  friendCount: FriendCount;
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
      assignmentDuration,
    };
  }
}
