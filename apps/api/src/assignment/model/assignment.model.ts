import { FestivalTask } from "@overbookd/festival-event";
import { IProvidePeriod } from "@overbookd/period";

type DatabaseFt = {
  id: FestivalTask["id"];
  name: FestivalTask["general"]["name"];
  status: FestivalTask["status"];
};

type WithDatabaseFt = {
  ft: DatabaseFt;
};

export type DatabaseVolunteer = {
  ftTimeWindows: IProvidePeriod & WithDatabaseFt;
};

type WithDatabaseTimeWindow = {
  timeWindow: WithDatabaseFt;
};

type DatabaseTimeSpan = IProvidePeriod & WithDatabaseTimeWindow;

export type DatabaseAssignment = {
  timeSpan: DatabaseTimeSpan;
  timeSpanId: number;
};
