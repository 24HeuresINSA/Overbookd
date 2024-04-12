import { Period } from "@overbookd/period";

export type Volunteer = {
  id: number;
  firstname: string;
  lastname: string;
  nickname?: string;
  charisma: number;
  comment?: string;
  note?: string;
  teams: string[];
};

type WithAssignments = {
  assignments: Period[];
};

type WithAssignmentDuration = {
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
    const assignmentDuration = volunteer.assignments.reduce(
      (acc, assignment) => acc + assignment.duration.inMilliseconds,
      0,
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
