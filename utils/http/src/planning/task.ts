import { FestivalTask, TimeWindow } from "@overbookd/festival-event";
import { IProvidePeriod } from "@overbookd/time";
import { User } from "@overbookd/user";

export type PlanningTask = {
  timeWindow: TimeWindow;
  id: FestivalTask["id"];
  name: FestivalTask["general"]["name"];
  status: FestivalTask["status"];
  appointment: FestivalTask["instructions"]["appointment"];
};

export type AssigneesByPeriod = {
  period: IProvidePeriod;
  volunteers: User[];
};

export type TaskForCalendar = PlanningTask & {
  contacts: FestivalTask["instructions"]["contacts"];
  assignees: AssigneesByPeriod[];
  globalInstruction: FestivalTask["instructions"]["global"];
  inChargeInstruction: FestivalTask["instructions"]["inCharge"]["instruction"];
};
