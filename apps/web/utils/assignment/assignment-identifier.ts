import { AssignmentIdentifier } from "@overbookd/assignment";

export type ExtendedAssignementIdentifier = AssignmentIdentifier & {
  taskId: number;
};
