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

export type WithAssignments = {
  assignments: Period[];
};

export type WithAssignmentDuration = {
  assignmentDuration: number;
};

export class FormatVolunteer {
  private constructor() {}

  static computeAssignmentDuration(assignments: Period[]): number {
    return assignments.reduce(
      (acc, assignment) => acc + assignment.duration.inMilliseconds,
      0,
    );
  }
}
