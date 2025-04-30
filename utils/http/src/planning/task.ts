import { FestivalTask, TimeWindow, Contact } from "@overbookd/festival-event";

export type Task = {
  timeWindow: TimeWindow;
  id: FestivalTask["id"];
  name: FestivalTask["general"]["name"];
  status: FestivalTask["status"];
  appointment: FestivalTask["instructions"]["appointment"];
};

export type TaskForCalendar = Task & {
  contacts: FestivalTask["instructions"]["contacts"];
  assignees: Contact[];
  globalInstructions: FestivalTask["instructions"]["global"];
  inChargeInstructions: FestivalTask["instructions"]["inCharge"]["instruction"];
};
