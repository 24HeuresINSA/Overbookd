import { Category } from "@overbookd/festival-event-constants";
import { IProvidePeriod } from "@overbookd/period";

type RequestedTeam = {
  code: string;
  count: number;
  assignmentCount: number;
};

type AssignmentPeriod = IProvidePeriod & {
  id: string;
  teams: RequestedTeam[];
};

export type TaskWithPeriods = {
  id: number;
  name: string;
  topPriority: boolean;
  category: Category;
  periods: AssignmentPeriod[];
};
