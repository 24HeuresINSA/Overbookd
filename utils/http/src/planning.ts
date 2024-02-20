import { FestivalTask, TimeWindow } from "@overbookd/festival-event";

export type Task = {
  timeWindow: TimeWindow;
  id: FestivalTask["id"];
  name: FestivalTask["general"]["name"];
  status: FestivalTask["status"];
  appointment: FestivalTask["instructions"]["appointment"];
};
