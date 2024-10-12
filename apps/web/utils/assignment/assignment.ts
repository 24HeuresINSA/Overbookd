import type { Assignment, AssignmentIdentifier } from "@overbookd/assignment";
import type { HttpStringified } from "@overbookd/http";
import { castPeriodWithDate } from "../http/period";

export function castAssignmentWithDate<T extends Assignment>(
  assignment: HttpStringified<T>,
): T {
  return {
    ...assignment,
    ...castPeriodWithDate(assignment),
  } as T;
}

export type UnassignForm = {
  assignmentIdentifier: AssignmentIdentifier;
  assigneeId: number;
};
