import { IProvidePeriod } from '@overbookd/period';
import { FtStatus } from '../../ft/ft.model';

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

type WithDatabaseTimeWindow = {
  timeWindow: WithDatabaseFt;
};

type DatabaseTimeSpan = IProvidePeriod & WithDatabaseTimeWindow;

export type DatabaseAssignment = {
  timeSpan: DatabaseTimeSpan;
  timeSpanId: number;
};
