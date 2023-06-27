import { FtStatus } from '@prisma/client';
import { Period } from 'src/volunteer-availability/domain/period.model';

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

type DatabaseTimespan = Period & WithDatabaseTimeWindow;

export type DatabaseAssignment = {
  timeSpan: DatabaseTimespan;
  timeSpanId: number;
};
