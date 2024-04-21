import { VolunteerTask } from "~/utils/models/user.model";
import { getColorByStatus } from "./status-color";

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
