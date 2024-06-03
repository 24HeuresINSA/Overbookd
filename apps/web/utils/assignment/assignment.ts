import { Assignment, AssignmentIdentifier } from "@overbookd/assignment";
import { HttpStringified } from "@overbookd/http";
import { castPeriodWithDate } from "../http/period";

export function castAssignmentWithDate(
  assignment: HttpStringified<Assignment | Assignment<{ withDetails: true }>>,
): Assignment | Assignment<{ withDetails: true }> {
  return {
    ...assignment,
    ...castPeriodWithDate(assignment),
  };
}

export type UnassignForm = {
  assignmentIdentifier: AssignmentIdentifier;
  assigneeId: number;
};
