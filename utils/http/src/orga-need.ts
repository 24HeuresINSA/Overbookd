import { FestivalTask } from "@overbookd/festival-event";
import { IProvidePeriod } from "@overbookd/time";

export type OrgaNeedTask = {
  id: FestivalTask["id"];
  name: FestivalTask["general"]["name"];
  count: number;
};

export type OrgaNeedDetails = {
  start: Date;
  end: Date;
  assignedVolunteers: number;
  availableVolunteers: number;
  requestedVolunteers: number;
  tasks: OrgaNeedTask[];
};

export type OrgaNeedRequest = IProvidePeriod & {
  teams: string[];
};
