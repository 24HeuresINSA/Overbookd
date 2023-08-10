import { MyUserInformation, UserPersonnalData } from '@overbookd/user';
import { TeamWithNestedPermissions } from '../team/utils/permissions';
import { Period } from '@overbookd/period';
import { Ft } from '@prisma/client'; // TODO do not use prisma type

export type UserPasswordOnly = {
  password: string;
};

export interface DatabaseMyUserInformation
  extends Omit<MyUserInformation, 'teams' | 'permissions' | 'tasksCount'> {
  teams: TeamWithNestedPermissions[];
  _count: { assignments: number };
}

export interface VolunteerTask extends Period {
  ft: Pick<Ft, 'id' | 'name' | 'status'>;
  timeSpanId?: number;
}

export interface DatabaseUserPersonalData
  extends Omit<UserPersonnalData, 'teams'> {
  teams: {
    team: {
      code: string;
    };
  }[];
}
