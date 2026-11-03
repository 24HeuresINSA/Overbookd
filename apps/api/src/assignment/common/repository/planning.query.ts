import { SELECT_PERIOD_WITH_ID } from "../../../common/query/period.query";
import { friendAssigneesCount } from "./assignment.query";

export const SELECT_TASK = {
  name: true,
  status: true,
  id: true,
  category: true,
};

const SELECT_PLANNING_EVENT = {
  ...SELECT_PERIOD_WITH_ID,
  mobilizationId: true,
  festivalTask: { select: SELECT_TASK },
};

export function selectPlanningEventFor(volunteerId: number) {
  return {
    ...SELECT_PLANNING_EVENT,
    ...friendAssigneesCount(volunteerId),
    assignees: {
      where: { userId: volunteerId },
      select: { teamCode: true },
    },
  };
}
