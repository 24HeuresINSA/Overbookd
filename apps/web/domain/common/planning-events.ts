import { VolunteerTask } from "~/utils/models/user.model";
import { getColorByStatus } from "./status-color";
import { IProvidePeriod } from "@overbookd/period";

export type PlanningEvent = {
  start: Date;
  end: Date;
  volunteerId?: number;
  name: string;
  color?: string;
};

export function convertTaskToPlanningEvent(
  { start, end, ft: { id, name, status } }: VolunteerTask,
  volunteerId: number,
): PlanningEvent {
  return {
    start,
    end,
    name: `[${id}] ${name}`,
    color: getColorByStatus(status),
    volunteerId,
  };
}

type TemporaryTask = IProvidePeriod & {
  name: string;
};

export function createTemporaryTaskPlanningEvent(
  task: TemporaryTask,
): PlanningEvent {
  const { start, end, name } = task;
  return { start, end, name };
}
