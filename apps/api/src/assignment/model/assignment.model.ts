import { Period } from '@overbookd/period';
import { FtStatus } from '../../ft/ft.model';

type DatabaseFt = {
  name: string;
  id: number;
  status: FtStatus;
};

type WithDatabaseFt = {
  ft: DatabaseFt;
};

export type DatabaseFtUserRequest = { ftTimeWindows: Period & WithDatabaseFt };

type WithDatabaseTimeWindow = {
  timeWindow: WithDatabaseFt;
};

type DatabaseTimeSpan = Period & WithDatabaseTimeWindow;

export type DatabaseAssignment = {
  timeSpan: DatabaseTimeSpan;
  timeSpanId: number;
};
