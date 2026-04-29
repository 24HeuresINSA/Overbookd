import { Injectable } from "@nestjs/common";
import {
  AssignVolunteerToTask,
  VolunteerWithAssignmentDuration,
} from "@overbookd/assignment";
import { AssignmentFriend, AssignmentSummaryWithTask } from "@overbookd/http";

export type AvailableAssignments = {
  findAssignableFor(volunteerId: number): Promise<AssignmentSummaryWithTask[]>;
};

export type AssignmentFriends = {
  findFriendsFor(volunteerId: number): Promise<AssignmentFriend[]>;
};

@Injectable()
export class VolunteerToTaskService {
  constructor(
    private readonly assign: AssignVolunteerToTask,
    private readonly assignments: AvailableAssignments,
    private readonly friends: AssignmentFriends,
  ) {}

  async findVolunteers(): Promise<VolunteerWithAssignmentDuration[]> {
    return this.assign.volunteers();
  }

  async findAssignmentsFor(
    volunteerId: number,
  ): Promise<AssignmentSummaryWithTask[]> {
    return this.assignments.findAssignableFor(volunteerId);
  }

  async findFriendsFor(volunteerId: number): Promise<AssignmentFriend[]> {
    return this.friends.findFriendsFor(volunteerId);
  }
}
