import { VolunteerTask } from "~/utils/models/user";
import { getColorByStatus } from "./status-color";

export function convertTaskToPlanningEvent(
  { start, end, ft: { id, name, status } }: VolunteerTask,
  group?: string
) {
  return {
    start,
    end,
    category: group,
    name: `[${id}] ${name}`,
    color: getColorByStatus(status),
    timed: true,
  };
}

type TemporaryTask = {
  start: Date;
  end: Date;
  name: string;
};

export function createTemporaryTaskPlanningEvent(
  { start, end, name }: TemporaryTask,
  group?: string
) {
  return {
    start,
    end,
    name,
    category: group,
    timed: true,
  };
}
