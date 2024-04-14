import { Period } from "@overbookd/period";
import { FormatVolunteer, Volunteer } from "../volunteer";

export type WithAssignments = {
  assignments: Period[];
};

export type WithAssignmentDuration = {
  assignmentDuration: number;
};

export type VolunteerWithAssignments = Volunteer & WithAssignments;

export type VolunteerWithAssignmentDuration = Volunteer &
  WithAssignmentDuration;

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

  private computeAssignmentDuration(
    volunteer: VolunteerWithAssignments,
  ): VolunteerWithAssignmentDuration {
    const assignmentDuration = FormatVolunteer.computeAssignmentDuration(
      volunteer.assignments,
    );
    return {
      id: volunteer.id,
      firstname: volunteer.firstname,
      lastname: volunteer.lastname,
      charisma: volunteer.charisma,
      comment: volunteer.comment,
      note: volunteer.note,
      teams: volunteer.teams,
      assignmentDuration,
    };
  }
}
