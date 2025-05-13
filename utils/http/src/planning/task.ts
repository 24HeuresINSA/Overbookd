import { FestivalTask, TimeWindow } from "@overbookd/festival-event";
import { User } from "@overbookd/user";

export type Task = {
  timeWindow: TimeWindow;
  id: FestivalTask["id"];
  name: FestivalTask["general"]["name"];
  status: FestivalTask["status"];
  appointment: FestivalTask["instructions"]["appointment"];
};

export type TaskForCalendar = Task & {
  contacts: FestivalTask["instructions"]["contacts"];
  assignees: User[];
  globalInstruction: FestivalTask["instructions"]["global"];
  inChargeInstruction: FestivalTask["instructions"]["inCharge"]["instruction"];
};
