import { IProvidePeriod } from "@overbookd/period";
import { FtStatus } from "../../../ft/ft.model";

type DatabaseFt = {
  name: string;
  id: number;
  status: FtStatus;
};

type WithDatabaseFt = {
  ft: DatabaseFt;
};

export type DatabaseFtUserRequest = {
  ftTimeWindows: IProvidePeriod & WithDatabaseFt;
};
