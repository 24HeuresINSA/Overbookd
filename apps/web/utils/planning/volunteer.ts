import type { AssignmentEvent, BreakPeriod } from "@overbookd/assignment";
import type { AssignmentStats, PlanningTask } from "@overbookd/http";

export type VolunteerForPlanningCalendar = {
  breakPeriods: BreakPeriod[];
  tasks: PlanningTask[];
  assignmentStats?: AssignmentStats;
  assignments: AssignmentEvent[];
};
