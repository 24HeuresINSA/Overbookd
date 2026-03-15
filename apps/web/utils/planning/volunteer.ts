import type { AssignmentEvent } from "@overbookd/assignment";
import type { AssignmentStat, PlanningTask } from "@overbookd/http";
import type { Period } from "@overbookd/time";

export type VolunteerForPlanningCalendar = {
  breakPeriods: Period[];
  tasks: PlanningTask[];
  assignmentStats: AssignmentStat[];
  assignments: AssignmentEvent[];
};
