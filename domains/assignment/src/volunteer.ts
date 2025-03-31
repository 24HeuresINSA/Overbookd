import { Period } from "@overbookd/time";
import { AssignmentPreferenceType } from "@overbookd/preference";

export type Volunteer = {
  id: number;
  firstname: string;
  lastname: string;
  nickname?: string;
  charisma: number;
  comment?: string;
  note?: string;
  teams: string[];
  preference: {
    assignment: AssignmentPreferenceType;
  };
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
