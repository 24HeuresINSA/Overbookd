import { SELECT_PERIOD_WITH_ID } from "../../../common/query/period.query";

export const SELECT_TASK = { name: true, status: true, id: true };

export const SELECT_PLANNING_EVENT = {
  ...SELECT_PERIOD_WITH_ID,
  mobilizationId: true,
  festivalTask: { select: SELECT_TASK },
};
