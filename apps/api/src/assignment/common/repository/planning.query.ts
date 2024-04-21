import { SELECT_PERIOD } from "./period.query";

export const SELECT_TASK = { name: true, status: true, id: true };

export const SELECT_PLANNING_EVENT = {
  ...SELECT_PERIOD,
  festivalTask: { select: SELECT_TASK },
};
