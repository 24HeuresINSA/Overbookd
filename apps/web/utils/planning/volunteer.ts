import type { AssignmentEvent } from "@overbookd/assignment";
import type { AssignmentStats, PlanningTask } from "@overbookd/http";
import type { Period } from "@overbookd/time";

export type VolunteerForPlanningCalendar = {
  breakPeriods: Period[];
  tasks: PlanningTask[];
  assignmentStats?: AssignmentStats;
  assignments: AssignmentEvent[];
};
